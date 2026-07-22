"use client";
import { useState } from "react";
import { nextTokenCandidates } from "./demoData";

export default function NextTokenDemo() {
  const [tokens, setTokens] = useState<string[]>([]);
  const [temp, setTemp] = useState(0.7);
  const prefix = tokens.join("");
  const cands = nextTokenCandidates(prefix, temp);

  return (
    <div className="lec-demo lec-nexttoken">
      <div className="lec-nt-sentence">
        <span className="lec-nt-text">{prefix || "​"}</span>
        <span className="lec-nt-caret" />
      </div>
      <div className="lec-nt-controls">
        <label>temperature <b>{temp.toFixed(1)}</b>
          <input type="range" min={0.1} max={1.5} step={0.1} value={temp} onChange={(e) => setTemp(+e.target.value)} />
        </label>
        <button onClick={() => setTokens([])}>처음부터</button>
      </div>
      {cands.length > 0 ? (
        <ul className="lec-nt-cands">
          {cands.map((c) => (
            <li key={c.token}>
              <button onClick={() => setTokens((t) => [...t, c.token])}>
                <span className="lec-nt-tok">{c.token.trim() || c.token}</span>
                <span className="lec-nt-bar"><span style={{ width: `${Math.round(c.prob * 100)}%` }} /></span>
                <span className="lec-nt-prob lec-mono">{Math.round(c.prob * 100)}%</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="lec-mut lec-nt-done">문장 완성 — [처음부터]로 다시</p>
      )}
    </div>
  );
}
