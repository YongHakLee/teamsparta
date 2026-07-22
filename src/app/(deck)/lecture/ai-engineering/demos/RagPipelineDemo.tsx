"use client";
import { useEffect, useRef, useState } from "react";
import { ragCase, RAG_STAGES } from "./demoData";

export default function RagPipelineDemo() {
  const [stage, setStage] = useState(0); // 0=대기, 1..5=단계
  const [useRag, setUseRag] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const playing = stage > 0 && stage < RAG_STAGES.length;

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const play = () => {
    if (timer.current) clearInterval(timer.current);
    setStage(0);
    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      setStage(i);
      if (i >= RAG_STAGES.length && timer.current) clearInterval(timer.current);
    }, 700);
  };

  const answer = useRag ? ragCase.groundedAnswer : ragCase.ungroundedAnswer;

  return (
    <div className="lec-demo lec-rag">
      <div className="lec-rag-top">
        <div className="lec-rag-q">Q. {ragCase.question}</div>
        <label className="lec-rag-toggle">
          <input type="checkbox" checked={useRag} onChange={(e) => setUseRag(e.target.checked)} /> RAG 사용
        </label>
        <button onClick={play}>{playing ? "재생 중…" : "▶ 재생"}</button>
      </div>

      <ol className="lec-rag-stages">
        {RAG_STAGES.map((s, i) => (
          <li key={s} className={stage >= i + 1 ? "on" : ""}>{s}</li>
        ))}
      </ol>

      {useRag && stage >= 3 && (
        <ul className="lec-rag-chunks">
          {ragCase.chunks.map((c) => (
            <li key={c.id} className={c.score >= 0.5 ? "hit" : ""}>
              <span className="lec-mono lec-rag-id">{c.id}</span>
              <span className="lec-rag-txt">{c.text}</span>
              <span className="lec-mono lec-rag-score">{c.score.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}

      {stage >= RAG_STAGES.length && (
        <div className={`lec-rag-answer ${useRag ? "grounded" : "ungrounded"}`}>{answer}</div>
      )}
    </div>
  );
}
