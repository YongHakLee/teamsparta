import { searchQualityRows } from "./demoData";

export default function SearchQualityTable() {
  return (
    <div className="lec-demo lec-knob">
      <table className="lec-knob-table">
        <thead>
          <tr><th>손잡이</th><th>나쁜 설정 증상</th><th>좋은 방향</th></tr>
        </thead>
        <tbody>
          {searchQualityRows.map((r) => (
            <tr key={r.knob}>
              <td className="lec-knob-name"><b>{r.knob}</b><span className="lec-mono">{r.en}</span></td>
              <td className="lec-knob-bad">{r.bad}</td>
              <td className="lec-knob-good">{r.good}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
