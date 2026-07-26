"use client";

export type RunState = {
  status: "idle" | "running" | "done" | "error";
  text: string;
  usage?: { input_tokens: number; output_tokens: number };
  stop_reason?: string | null;
  error?: { status: number; name: string; message: string };
  validations?: { attempt: number; ok: boolean; issues: { path: string; message: string }[] }[];
};

export const IDLE: RunState = { status: "idle", text: "" };

export default function ResponsePane({
  state,
  onRun,
}: {
  state: RunState;
  onRun: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRun}
          disabled={state.status === "running"}
          className="border border-ink bg-ink px-4 py-1.5 text-[14px] font-semibold text-paper disabled:opacity-40"
        >
          {state.status === "running" ? "생성 중…" : "실행"}
        </button>
        {state.usage && (
          <span className="demo-mono text-[12px] text-muted">
            입력 {state.usage.input_tokens} · 출력 {state.usage.output_tokens} 토큰
            {state.stop_reason ? ` · ${state.stop_reason}` : ""}
          </span>
        )}
      </div>

      {state.error && (
        <div className="border border-accent bg-paper p-3">
          <div className="demo-mono text-[12px] font-bold tracking-[0.14em] text-accent">
            {state.error.status > 0 && `HTTP ${state.error.status} · `}
            {state.error.name}
          </div>
          <p className="demo-mono mt-2 text-[13px] leading-relaxed break-words">
            {state.error.message}
          </p>
        </div>
      )}

      {state.validations && state.validations.length > 0 && (
        <ul className="flex flex-col gap-1">
          {state.validations.map((v) => (
            <li
              key={v.attempt}
              className="demo-mono border border-hairline px-2 py-1 text-[12px]"
            >
              <span className={v.ok ? "text-ink" : "text-accent"}>
                {v.attempt + 1}회차 검증 {v.ok ? "통과" : "실패"}
              </span>
              {!v.ok && (
                <span className="ml-2 text-muted">
                  {v.issues.map((i) => `${i.path}: ${i.message}`).join(" / ")}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <pre className="demo-mono min-h-40 overflow-x-auto whitespace-pre-wrap border border-hairline bg-paper p-3 text-[13px] leading-relaxed">
        {state.text || (state.status === "idle" ? "실행을 누르세요." : "")}
      </pre>
    </div>
  );
}
