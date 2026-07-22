"use client";
import { useState } from "react";
import { opsMetrics, canaryOutcome } from "./demoData";

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

export default function LlmOpsDashboardDemo() {
  const [pct, setPct] = useState(10);
  const out = canaryOutcome(pct);

  return (
    <div className="lec-demo lec-ops">
      <div className="lec-ops-cards">
        {opsMetrics.map((m) => (
          <div key={m.label} className="lec-ops-card">
            <div className="lec-mono lec-ops-lbl">{m.label}</div>
            <div className="lec-ops-val">{m.value}</div>
            <Spark points={m.spark} />
          </div>
        ))}
      </div>

      <div className="lec-ops-canary">
        <div className="lec-ops-canary-head">
          <span>카나리 — 신버전 트래픽 <b>{pct}%</b></span>
          <button onClick={() => setPct(0)}>롤백(0%로)</button>
        </div>
        <input type="range" min={0} max={100} step={5} value={pct} onChange={(e) => setPct(+e.target.value)} />
        <div className="lec-ops-bar">
          <span className="old" style={{ width: `${100 - pct}%` }}>구버전 {100 - pct}%</span>
          <span className="new" style={{ width: `${pct}%` }}>{pct > 8 ? `신버전 ${pct}%` : ""}</span>
        </div>
        <div className={`lec-ops-outcome ${out.danger ? "danger" : ""}`}>
          <span>에러율 {out.errorRate}%</span>
          <span>품질 {out.quality}</span>
          <span>{out.danger ? "⚠ 임계 초과 — 롤백 권장" : "정상"}</span>
        </div>
      </div>
    </div>
  );
}
