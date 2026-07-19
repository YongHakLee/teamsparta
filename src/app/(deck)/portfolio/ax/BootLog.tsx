/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

/* 표지 부팅 로그: 줄이 차례로 나타나는 시그니처 모션. reduced-motion이면 CSS가 즉시 전부 표시 */
export default function BootLog({ lines }: { lines: { step: string; note: string }[] }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(lines.length);
      return;
    }
    const t = setInterval(() => {
      setShown((n) => {
        if (n >= lines.length) {
          clearInterval(t);
          return n;
        }
        return n + 1;
      });
    }, 350);
    return () => clearInterval(t);
  }, [lines.length]);

  return (
    <div className="ax-log ax-mono" style={{ width: "auto", border: "none", padding: 0, marginTop: "2em" }}>
      <div className="ax-log-head">{"// boot.log"}</div>
      {lines.map((l, i) => (
        <div key={l.step} className={`ax-bootline ${i < shown ? "ax-on" : ""}`}>
          <span className="ax-acc">▸</span> {l.step} <span className="ax-log-note">{l.note}</span>{" "}
          <span className="ax-acc">✓</span>
        </div>
      ))}
    </div>
  );
}
