"use client";
import type { Part, Slide } from "@/data/lecture";

export default function DeckProgress({
  slides, parts, current, onOpen, ref,
}: {
  slides: Slide[];
  parts: Part[];
  current: number;
  onOpen: () => void;
  ref?: React.Ref<HTMLButtonElement>;
}) {
  const total = slides.length;
  const pct = ((current + 1) / total) * 100;
  const partId = slides[current]?.partId;
  const part = parts.find((p) => p.id === partId);
  return (
    <button
      ref={ref}
      type="button"
      className="lec-progress lec-mono"
      onClick={onOpen}
      /* 이 버튼에 포커스가 있을 때 Space는 버튼을 누르는 키다.
         window까지 올려보내면 덱이 그걸 "다음으로"로도 받아 한 번에 두 일이 일어난다. */
      onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") e.stopPropagation(); }}
      aria-label="전체 슬라이드 보기"
    >
      <span className="lec-progress-bar"><span style={{ width: `${pct}%` }} /></span>
      <span className="lec-progress-meta">
        <span>{part ? `${part.label} · ${part.title}` : " "}</span>
        <span>{String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </span>
    </button>
  );
}
