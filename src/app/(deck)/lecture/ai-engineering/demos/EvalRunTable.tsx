import { evalRows } from "./demoData";

export default function EvalRunTable() {
  return (
    <div className="lec-demo lec-eval">
      <table className="lec-eval-table">
        <thead>
          <tr><th>질문</th><th>기대 답</th><th>새 버전 답</th><th>점수</th><th>통과</th></tr>
        </thead>
        <tbody>
          {evalRows.map((r) => (
            <tr key={r.q} className={r.pass ? "" : "fail"}>
              <td>{r.q}</td>
              <td>{r.expected}</td>
              <td>{r.got}</td>
              <td className="lec-mono">{r.score.toFixed(2)}</td>
              <td>{r.pass ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="lec-eval-note">
        정답이 딱 떨어지지 않는 답은 다른 LLM에게 채점 기준을 주고 평가시킨다(LLM-as-judge).
        점수가 기준 미달이면 CI 게이트가 배포를 막는다.
      </p>
    </div>
  );
}
