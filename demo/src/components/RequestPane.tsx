"use client";

import type { GenerateRequest } from "@/lib/wire";

/**
 * 지금 서버로 갈 요청 본문을 그대로 보여준다.
 * 왼쪽 컨트롤을 만지면 여기의 필드가 바뀌는 것이 이 화면의 핵심이다.
 */
export default function RequestPane({ request }: { request: GenerateRequest }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] leading-relaxed text-muted">
        왼쪽에서 조작한 값이 그대로 이 JSON이 되어 서버로 갑니다.
      </p>
      <pre className="demo-mono overflow-x-auto border border-hairline bg-paper p-3 text-[13px] leading-relaxed">
        {JSON.stringify(request, null, 2)}
      </pre>
    </div>
  );
}
