"use client";
import { useEffect, useState } from "react";
import { promptPatterns, type PatternKey, type PatternSample } from "./demoData";

/* 출력 패널: 부모에서 key={sample.key}로 렌더해 탭 전환 시 remount(상태 초기화).
   CoT만 한 줄씩 순차 등장, 나머지는 즉시 전부. */
function OutputPane({ sample }: { sample: PatternSample }) {
  const total = sample.output.length;
  const animate = sample.key === "cot";
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [shown, setShown] = useState(animate && !reduce ? 1 : total);

  useEffect(() => {
    if (!animate || reduce) return;
    const t = setInterval(() => setShown((n) => Math.min(n + 1, total)), 500);
    return () => clearInterval(t);
  }, [animate, reduce, total]);

  return (
    <div className="lec-pat-output">
      <div className="lec-mono lec-pat-lbl">OUTPUT</div>
      <pre className={sample.structured ? "lec-pat-json" : ""}>
        {sample.output.slice(0, shown).join("\n")}
      </pre>
    </div>
  );
}

export default function PromptPatternDemo({ variant = "patterns" }: { variant?: "patterns" | "structured" }) {
  const tabs = promptPatterns.filter((p) =>
    variant === "structured" ? p.key === "structured" || p.key === "zero" : p.key !== "structured",
  );
  const [key, setKey] = useState<PatternKey>(tabs[0].key);
  const sample = promptPatterns.find((p) => p.key === key)!;

  return (
    <div className="lec-demo lec-pattern">
      <div className="lec-pat-tabs">
        {tabs.map((p) => (
          <button key={p.key} className={p.key === key ? "on" : ""} onClick={() => setKey(p.key)}>
            {variant === "structured" && p.key === "zero" ? "자유 텍스트" : p.label}
          </button>
        ))}
      </div>
      <div className="lec-pat-panes">
        <div className="lec-pat-prompt">
          <div className="lec-mono lec-pat-lbl">PROMPT</div>
          <pre>{sample.prompt}</pre>
        </div>
        <OutputPane key={sample.key} sample={sample} />
      </div>
      {sample.note && <p className="lec-pat-note">{sample.note}</p>}
    </div>
  );
}
