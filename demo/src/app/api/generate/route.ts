import Anthropic from "@anthropic-ai/sdk";
import { buildMessageParams, getClient } from "@/lib/anthropic";
import { LimitError } from "@/lib/limits";
import {
  MAX_RETRIES,
  buildRetryPrompt,
  validateAgainstSchema,
  type ValidationIssue,
} from "@/lib/validate";
import type { GenerateRequest, SseFrame } from "@/lib/wire";

// Fluid Compute(Node.js 런타임)에서 스트리밍한다. edge 런타임은 쓰지 않는다.
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

function frame(f: SseFrame): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(f)}\n\n`);
}

/** 에러를 SSE 프레임으로 옮긴다. 400은 숨기지 않는다 — 모델 전환 시연의 재료다. */
function toErrorFrame(err: unknown): SseFrame {
  if (err instanceof LimitError) {
    return { type: "error", status: 400, name: err.name, message: err.message };
  }
  if (err instanceof Anthropic.APIError) {
    return {
      type: "error",
      status: err.status ?? 500,
      // SDK가 에러 서브클래스에서 .name을 덮어쓰지 않아 생성자 이름으로 서브클래스를 식별한다.
      name: err.constructor?.name ?? err.name,
      message: err.message,
    };
  }
  return {
    type: "error",
    status: 500,
    name: "UnknownError",
    message: err instanceof Error ? err.message : String(err),
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as GenerateRequest;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const params = buildMessageParams(body);
        let attempt = 0;
        let userText = body.user;
        let totalIn = 0;
        let totalOut = 0;

        for (;;) {
          const attemptParams = {
            ...params,
            messages: [{ role: "user", content: userText }],
          };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const messageStream = getClient().messages.stream(attemptParams as any);

          let collected = "";
          for await (const event of messageStream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              collected += event.delta.text;
              controller.enqueue(
                frame({ type: "delta", text: event.delta.text }),
              );
            }
          }

          const final = await messageStream.finalMessage();
          totalIn += final.usage.input_tokens;
          totalOut += final.usage.output_tokens;

          if (!body.json_schema) {
            controller.enqueue(
              frame({
                type: "done",
                stop_reason: final.stop_reason,
                usage: { input_tokens: totalIn, output_tokens: totalOut },
              }),
            );
            break;
          }

          let issues: ValidationIssue[];
          try {
            issues = validateAgainstSchema(JSON.parse(collected), body.json_schema);
          } catch {
            issues = [{ path: "(root)", message: "JSON 파싱에 실패했습니다." }];
          }

          controller.enqueue(
            frame({ type: "validation", attempt, ok: issues.length === 0, issues }),
          );

          if (issues.length === 0 || attempt >= MAX_RETRIES) {
            controller.enqueue(
              frame({
                type: "done",
                stop_reason: final.stop_reason,
                usage: { input_tokens: totalIn, output_tokens: totalOut },
              }),
            );
            break;
          }

          attempt += 1;
          userText = buildRetryPrompt(body.user, collected, issues);
          controller.enqueue(
            frame({ type: "delta", text: `\n\n— 재요청 ${attempt}회차 —\n\n` }),
          );
        }
      } catch (err) {
        controller.enqueue(frame(toErrorFrame(err)));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      Connection: "keep-alive",
    },
  });
}
