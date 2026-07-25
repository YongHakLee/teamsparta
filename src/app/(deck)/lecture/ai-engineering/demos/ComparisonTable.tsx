import type { TableSpec } from "./demoData";

/* 표 계열 데모 공용 렌더러.
   activeStep이 주어지면 덱의 빌드 스텝에 맞춰 행이 하나씩 열리고, 없으면 전부 보인다.
   행은 데이터 순서가 곧 정체성이므로 index를 key로 쓴다(재정렬·삽입 없음). */
export default function ComparisonTable({
  spec, activeStep,
}: { spec: TableSpec; activeStep?: number }) {
  const shown = activeStep === undefined ? spec.rows.length : Math.min(activeStep, spec.rows.length);
  return (
    <div className="lec-demo">
      <table className="lec-table">
        <thead>
          <tr>{spec.columns.map((col) => <th key={col}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {spec.rows.slice(0, shown).map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className={cell.tone ? `lec-td-${cell.tone}` : undefined}>
                  {cell.text}
                  {cell.en && <span className="lec-mono lec-td-en">{cell.en}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {spec.note && <p className="lec-table-note">{spec.note}</p>}
    </div>
  );
}
