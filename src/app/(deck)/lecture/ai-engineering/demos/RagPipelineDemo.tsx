"use client";
import { ragStageRows } from "./demoData";

export default function RagPipelineDemo({ activeStep = ragStageRows.length }: { activeStep?: number }) {
  const shown = Math.min(activeStep, ragStageRows.length);
  return (
    <div className="lec-demo lec-rag">
      <table className="lec-rag-table">
        <thead>
          <tr>
            <th>단계</th>
            <th>RAG 사용</th>
            <th>RAG 미사용</th>
          </tr>
        </thead>
        <tbody>
          {ragStageRows.slice(0, shown).map((r) => (
            <tr key={r.stage} className={r.stage === "생성" ? "lec-rag-final" : ""}>
              <td className="lec-rag-stagecell"><b>{r.stage}</b><span className="lec-mono">{r.en}</span></td>
              <td>{r.withRag}</td>
              <td className="lec-rag-off">{r.withoutRag}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
