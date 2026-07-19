"use client";

import { useEffect, useState } from "react";

/* 우측 점 내비 + 현재 장 표시. 인쇄 시 숨김(ax-web-only) */
export default function DeckChrome({ total }: { total: number }) {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const slides = Array.from(document.querySelectorAll<HTMLElement>("[data-slide]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrent(Number((e.target as HTMLElement).dataset.slide));
        }
      },
      { threshold: 0.6 },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div className="ax-web-only">
      <nav className="ax-chrome" aria-label="슬라이드 이동">
        <span className="ax-chrome-count ax-mono">
          {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            className="ax-dot"
            aria-current={current === i + 1}
            aria-label={`${i + 1}번 슬라이드로 이동`}
            onClick={() => document.getElementById(`s${i + 1}`)?.scrollIntoView({ behavior: "smooth" })}
          />
        ))}
      </nav>
    </div>
  );
}
