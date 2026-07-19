import SlideFrame from "./SlideFrame";
import { axProjects, stackLayers } from "@/data/ax";

export default function StackMapSlide({
  no,
  total,
}: {
  no: number;
  total: number;
}) {
  return (
    <SlideFrame
      no={no}
      total={total}
      id={`s${no}`}
      eyebrow="STACK MAP · 역량 맵"
    >
      <h2 className="ax-title">데이터 생성부터 배포까지, 계층과 프로젝트</h2>
      <p className="ax-tagline">
        한 프로젝트 안에서 어느 계층을 직접 다뤘는지의 지도입니다.
      </p>
      <table className="ax-matrix">
        <thead>
          <tr>
            <th className="ax-h">계층</th>
            {axProjects.map((p) => (
              <th key={p.code}>
                <span className="ax-mono ax-acc">{p.code}</span> {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stackLayers.map((row) => (
            <tr key={row.layer}>
              <td className="ax-h">{row.layer}</td>
              {row.cells.map((cell, i) => (
                <td
                  key={axProjects[i]?.code ?? i}
                  className={cell ? "ax-mut" : "ax-none"}
                >
                  {cell ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </SlideFrame>
  );
}
