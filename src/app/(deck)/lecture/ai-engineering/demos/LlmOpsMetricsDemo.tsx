"use client";
import { opsMetrics } from "./demoData";

function Spark({ points }: { points: number[] }) {
  const min = Math.min(...points), max = Math.max(...points);
  const norm = (v: number) => (max === min ? 50 : 100 - ((v - min) / (max - min)) * 100);
  const d = points.map((v, i) => `${(i / (points.length - 1)) * 100},${norm(v)}`).join(" ");
  return (
    <svg className="lec-spark" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <polyline points={d} fill="none" stroke="var(--accent)" strokeWidth={3} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function LlmOpsMetricsDemo() {
  return (
    <div className="lec-demo lec-ops">
      <div className="lec-ops-cards">
        {opsMetrics.map((m) => (
          <div key={m.label} className="lec-ops-card">
            <div className="lec-mono lec-ops-lbl">{m.label}</div>
            <div className="lec-ops-val">{m.value}</div>
            <Spark points={m.spark} />
            <div className="lec-ops-desc">{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
