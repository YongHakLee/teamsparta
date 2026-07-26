"use client";

export type PanelTab = "request" | "code" | "response";

const LABELS: Record<PanelTab, string> = {
  request: "요청",
  code: "코드",
  response: "응답",
};

export default function RightPanel({
  tab,
  onTab,
  request,
  code,
  response,
}: {
  tab: PanelTab;
  onTab: (t: PanelTab) => void;
  request: React.ReactNode;
  code: React.ReactNode;
  response: React.ReactNode;
}) {
  const body = { request, code, response }[tab];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-0 border-b border-hairline">
        {(Object.keys(LABELS) as PanelTab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTab(t)}
            className={
              t === tab
                ? "border-b-2 border-accent px-3 py-1.5 text-[14px] font-semibold text-accent"
                : "border-b-2 border-transparent px-3 py-1.5 text-[14px] text-muted hover:text-ink"
            }
          >
            {LABELS[t]}
          </button>
        ))}
      </div>
      {body}
    </div>
  );
}
