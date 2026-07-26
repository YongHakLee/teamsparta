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
  // 종료 프레임(done/error)이 실제로 왔는지 추적한다. Vercel 플랫폼 에러 페이지, 502/504,
  // 함수 시간 초과로 스트림이 중간에 끊기는 경우처럼 응답 본문이 SSE가 아니면 프레임이
  // 하나도 안 나올 수 있다 — 그러면 onFrame이 한 번도 안 불리고 함수가 조용히 반환돼서,
  // 화면이 "생성 중…"에 영구 정지한다. 무대에서 새로고침 말고는 복구 수단이 없으므로
  // 종료 프레임을 못 받으면 여기서 하나 합성해 내보낸다.
  let terminal = false;
  const emit = (f: SseFrame) => {
    if (f.type === "done" || f.type === "error") terminal = true;
    onFrame(f);
  };

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req),
    });

    if (!res.body) {
      emit({
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
      frames.forEach(emit);
    }

    // 읽기 루프가 끝났는데도 종료 프레임을 못 받았다면(res.ok가 아니었거나, SSE가 아닌
    // 본문이었거나, 스트림이 중간에 끊긴 경우) 여기서 만들어 낸다. res.status를 그대로
    // 쓰면 "status !== 400이면 fixture로 폴백" 규칙에도 자연스럽게 걸린다 — 다만 서버가
    // 400을 보내면서 SSE가 아닌 본문을 주는 경우는 폴백하지 않는데, 그건 의도된 동작이다.
    if (!terminal) {
      emit({
        type: "error",
        status: res.status,
        name: "NoFrames",
        message: "응답이 SSE 프레임 없이 끝났습니다.",
      });
    }
  } catch (err) {
    // fetch나 reader.read()가 throw했다는 건 HTTP 응답 자체를 받지 못했다는 뜻이라 status가 없다 — 그래서 0.
    // catch 블록은 위 try의 실패 경로이므로 terminal은 항상 false다 — 같은 실패에 프레임이
    // 두 번 나가지 않는다.
    emit({
      type: "error",
      status: 0,
      name: "NetworkError",
      message: `요청을 보내지 못했습니다: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}
