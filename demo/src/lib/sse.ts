import type { GenerateRequest, SseFrame } from "./wire";

/**
 * SSE 텍스트 조각에서 완성된 프레임만 뽑고, 잘린 꼬리는 돌려준다.
 * 네트워크 청크 경계가 프레임 경계와 일치한다는 보장이 없어서 필요하다.
 */
export function parseSseChunk(buffer: string): {
  frames: SseFrame[];
  rest: string;
} {
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";
  const frames: SseFrame[] = [];

  for (const part of parts) {
    const line = part.trim();
    if (!line.startsWith("data:")) continue;
    try {
      frames.push(JSON.parse(line.slice(5).trim()) as SseFrame);
    } catch {
      // 망가진 프레임은 조용히 버린다 — 다음 프레임이 도착하면 화면은 계속 진행된다.
    }
  }

  return { frames, rest };
}

/** /api/generate를 호출하고 프레임이 도착할 때마다 콜백을 부른다. */
export async function streamGenerate(
  req: GenerateRequest,
  onFrame: (f: SseFrame) => void,
): Promise<void> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.body) {
    onFrame({
      type: "error",
      status: res.status,
      name: "NoBody",
      message: "응답 본문이 비어 있습니다.",
    });
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const { frames, rest } = parseSseChunk(buffer);
    buffer = rest;
    frames.forEach(onFrame);
  }
}
