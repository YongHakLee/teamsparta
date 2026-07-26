import Anthropic from "@anthropic-ai/sdk";
import type { GenerateRequest } from "./wire";
import {
  assertAllowedModel,
  assertPromptLength,
  clampMaxTokens,
} from "./limits";

let client: Anthropic | null = null;

/** SDK 클라이언트 싱글턴. ANTHROPIC_API_KEY는 환경에서 자동으로 읽힌다. */
export function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

/**
 * 콘솔의 조작값을 Messages API 파라미터로 옮긴다.
 * 화면 왼쪽에서 만진 값이 여기의 어느 필드로 가는지가 시연의 핵심이라,
 * 이 함수 전체가 콘솔의 `코드` 탭에 그대로 표시된다.
 */
// #region snippet:sampling
export function buildMessageParams(req: GenerateRequest) {
  const model = assertAllowedModel(req.model);
  assertPromptLength((req.system ?? "") + req.user);

  const params: Record<string, unknown> = {
    model,
    max_tokens: clampMaxTokens(req.max_tokens),
    messages: [{ role: "user", content: req.user }],
  };

  if (req.system) params.system = req.system;

  // 샘플링 파라미터 — claude-haiku-4-5만 받는다.
  // claude-opus-5에 보내면 400이 나는데, 그 실패가 곧 시연 내용이다.
  if (req.temperature !== undefined) params.temperature = req.temperature;
  if (req.top_p !== undefined) params.top_p = req.top_p;
  if (req.top_k !== undefined) params.top_k = req.top_k;

  // effort는 output_config 아래로 들어간다. 구조화 출력(json_schema)은
  // withJsonSchema가 output_config.format을 채워 넣는다.
  if (req.effort) params.output_config = { effort: req.effort };

  return req.json_schema ? withJsonSchema(params, req.json_schema) : params;
}
// #endregion

/** s07 — 스키마를 output_config.format에 실어 형식을 강제한다. */
// #region snippet:structured-output
export function withJsonSchema(
  params: Record<string, unknown>,
  schema: Record<string, unknown>,
): Record<string, unknown> {
  const prev = (params.output_config ?? {}) as Record<string, unknown>;
  return {
    ...params,
    output_config: { ...prev, format: { type: "json_schema", schema } },
  };
}
// #endregion
