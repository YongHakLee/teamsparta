"use client";
import { useState } from "react";
import { canarySteps, canaryOutcome } from "./demoData";

export default function LlmOpsCanaryDemo() {
  const [idx, setIdx] = useState(0); // 현재 도달 단계 인덱스
  const pct = canarySteps[idx];
  const out = canaryOutcome(pct);

  return (
    <div className="lec-demo lec-canary">
      <p className="lec-canary-lead">
        새 프롬프트/모델 버전을 한 번에 바꾸지 않고, 소수 트래픽부터 단계적으로 늘린다(카나리·canary).
        지표가 나빠지면 즉시 검증된 이전 버전으로 되돌린다(롤백·rollback).
      </p>
      <ol className="lec-canary-steps">
        {canarySteps.map((s, i) => {
          const o = canaryOutcome(s);
          const reached = i <= idx;
          return (
            <li key={s} className={`${reached ? "on" : ""} ${o.danger ? "danger" : ""}`}>
              <div className="lec-canary-pct">신버전 {s}%</div>
              <div className="lec-canary-metrics">
                <span>에러율 {o.errorRate}%</span>
                <span>품질 {o.quality}</span>
              </div>
              <div className="lec-canary-flag">{o.danger ? "⚠ 임계 초과 — 롤백" : "정상"}</div>
            </li>
          );
        })}
      </ol>
      <div className="lec-canary-ctrl">
        <button disabled={idx === 0} onClick={() => setIdx(0)}>롤백(5%로)</button>
        <button disabled={idx >= canarySteps.length - 1} onClick={() => setIdx((n) => Math.min(n + 1, canarySteps.length - 1))}>
          다음 단계 →
        </button>
      </div>
      <div className={`lec-canary-now ${out.danger ? "danger" : ""}`}>
        현재 노출 {pct}% · 에러율 {out.errorRate}% · 품질 {out.quality} · {out.danger ? "롤백 권장" : "안정"}
      </div>
    </div>
  );
}
