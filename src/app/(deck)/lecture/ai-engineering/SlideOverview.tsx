"use client";
import { useEffect, useRef } from "react";
import type { Part, Slide } from "@/data/lecture";

export type Group = { part?: Part; items: { slide: Slide; index: number }[] };

/* 슬라이드 순서는 그대로 두고 파트가 바뀌는 지점에서만 끊는다 —
   격자에서 보이는 순서와 덱을 넘기는 순서가 같아야 목적지를 고를 수 있다.
   partId가 없는 장(s01·s02·s13·s14)은 헤더 없는 그룹으로 묶인다. */
export function groupSlides(slides: Slide[], parts: Part[]): Group[] {
  const groups: Group[] = [];
  slides.forEach((slide, index) => {
    const part = parts.find((p) => p.id === slide.partId);
    const last = groups[groups.length - 1];
    if (last && last.part === part) last.items.push({ slide, index });
    else groups.push({ part, items: [{ slide, index }] });
  });
  return groups;
}

export default function SlideOverview({
  slides, parts, current, onSelect, onClose,
}: {
  slides: Slide[];
  parts: Part[];
  current: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}) {
  const groups = groupSlides(slides, parts);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);

  /* 열자마자 현재 슬라이드 카드에 포커스 — 포커스 링이 곧 "지금 여기" 표시다. */
  useEffect(() => {
    cards.current[current]?.focus();
  }, [current]);

  /* Esc는 여기서 받는다. 오버뷰가 열려 있는 동안 LectureDeck의 키 핸들러는
     아무것도 하지 않고 빠져나가기 때문이다. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="lec-overview"
      role="dialog"
      aria-modal="true"
      aria-label="전체 슬라이드"
      /* 격자 바깥(배경) 을 눌렀을 때만 닫는다 */
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="lec-ov-grid">
        {groups.map((g, gi) => (
          <div key={g.part?.id ?? `nopart-${gi}`} className="lec-ov-group">
            {g.part && (
              <div className="lec-ov-part lec-mono">{g.part.label} · {g.part.title}</div>
            )}
            <div className="lec-ov-cards">
              {g.items.map(({ slide, index }) => (
                <button
                  key={slide.id}
                  ref={(el) => { cards.current[index] = el; }}
                  type="button"
                  className={`lec-ov-card ${index === current ? "lec-ov-cur" : ""}`}
                  aria-current={index === current ? "true" : undefined}
                  onClick={() => onSelect(index)}
                >
                  <span className="lec-ov-num lec-mono">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="lec-ov-title">{slide.title || slide.eyebrow}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
