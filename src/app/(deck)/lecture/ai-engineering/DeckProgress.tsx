"use client";
import type { Part, Slide } from "@/data/lecture";

export default function DeckProgress({
  slides, parts, current,
}: { slides: Slide[]; parts: Part[]; current: number }) {
  const total = slides.length;
  const pct = ((current + 1) / total) * 100;
  const partId = slides[current]?.partId;
  const part = parts.find((p) => p.id === partId);
  return (
    <div className="lec-progress lec-mono" aria-hidden>
      <div className="lec-progress-bar"><span style={{ width: `${pct}%` }} /></div>
      <div className="lec-progress-meta">
        <span>{part ? `${part.label} · ${part.title}` : " "}</span>
        <span>{String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
