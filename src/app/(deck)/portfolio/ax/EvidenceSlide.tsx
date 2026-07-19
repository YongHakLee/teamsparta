import SlideFrame from "./SlideFrame";
import EvidenceFigures from "./EvidenceFigures";
import type { AxProject } from "@/data/ax";
import { asset } from "@/lib/paths";

export default function EvidenceSlide({ p, no, total }: { p: AxProject; no: number; total: number }) {
  const video = p.evidence.find((e) => e.kind === "video");
  return (
    <SlideFrame
      no={no}
      total={total}
      id={`s${no}`}
      eyebrow={
        <>
          <span className="ax-acc">{p.code}</span> · {p.name} — 증빙
        </>
      }
    >
      <EvidenceFigures items={p.evidence} />

      {/* 인쇄 시: 영상 자리는 포스터 컷으로 대체 */}
      {video && video.kind === "video" && (
        <div className="ax-print-only ax-fig" style={{ flex: 1, marginTop: "1.1em" }}>
          <div className="ax-figbox">
            <img src={asset(video.poster)} alt="시연 영상 대표 컷" />
          </div>
          <p className="ax-figcap">{video.caption} — 재생은 웹에서 가능합니다</p>
        </div>
      )}

      <div className="ax-chips ax-mono">
        <span className="ax-web-only">{"// 이미지를 클릭하면 원본 크기로 열립니다"}</span>
        <span className="ax-print-only">{"// 갤러리 전체와 영상은 웹에서 확인할 수 있습니다"}</span>
      </div>
    </SlideFrame>
  );
}
