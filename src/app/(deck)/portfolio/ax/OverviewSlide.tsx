import SlideFrame from "./SlideFrame";
import type { AxProject } from "@/data/ax";

export default function OverviewSlide({ p, no, total }: { p: AxProject; no: number; total: number }) {
  return (
    <SlideFrame
      no={no}
      total={total}
      id={`s${no}`}
      eyebrow={
        <>
          <span className="ax-acc">{p.code}</span> · {p.name}
        </>
      }
    >
      <h2 className="ax-title">{p.title}</h2>
      <p className="ax-tagline">{p.tagline}</p>

      <div className="ax-cols">
        <div className="ax-col">
          <h3 className="ax-h">담당 역할 및 수행 내용</h3>
          <ul className="ax-works">
            {p.works.map((w) => (
              <li key={w.lead}>
                <strong>{w.lead}</strong>
                <span className="ax-mut"> — {w.text}</span>
              </li>
            ))}
          </ul>
          <h3 className="ax-h ax-h-results">프로젝트 결과</h3>
          <p className="ax-results">
            {p.results.map((r, i) => (
              <span key={r}>
                {i > 0 && <span className="ax-fnt"> | </span>}
                <span className="ax-acc">✓</span> {r}
              </span>
            ))}
          </p>
        </div>

        <div className="ax-log ax-mono">
          <div className="ax-log-head">{"// pipeline.log"}</div>
          {p.pipeline.map((s) => (
            <div key={s.step}>
              <span className="ax-acc">▸</span> {s.step}{" "}
              <span className="ax-log-note">{s.note}</span> <span className="ax-acc">✓</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ax-chips ax-mono">
        {p.tech.map((t) => (
          <span key={t} className="ax-chip">{t}</span>
        ))}
      </div>
    </SlideFrame>
  );
}
