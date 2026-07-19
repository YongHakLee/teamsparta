import SlideFrame from "./SlideFrame";
import EvidenceFigures from "./EvidenceFigures";
import { qrSvg } from "./Qr";
import type { AxProject } from "@/data/ax";

export default async function EvidenceSlide({
  p,
  no,
  total,
}: {
  p: AxProject;
  no: number;
  total: number;
}) {
  // link 증빙의 QR은 빌드 시점에 서버에서 그려 클라이언트 컴포넌트로 넘긴다
  // 확대할 이미지가 없는 슬라이드에 "클릭하면 열립니다" 안내를 띄우지 않는다
  const hasZoomable = p.evidence.some((e) => e.kind === "image" || e.kind === "gallery");

  const urls = p.evidence.flatMap((e) => (e.kind === "links" ? e.items.map((l) => l.url) : []));
  const qrSvgs = Object.fromEntries(
    await Promise.all(urls.map(async (url) => [url, await qrSvg(url)] as const)),
  );

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
      <EvidenceFigures items={p.evidence} qrSvgs={qrSvgs} />

      <div className="ax-chips ax-mono">
        <span className="ax-web-only">
          {hasZoomable
            ? "// 이미지를 클릭하면 원본 크기로 열립니다"
            : "// QR을 찍거나 카드를 눌러 바로 열 수 있습니다"}
        </span>
        <span className="ax-print-only">
          {hasZoomable
            ? "// 갤러리 전체와 영상은 웹에서 확인할 수 있습니다"
            : "// QR을 찍으면 배포된 서비스가 바로 열립니다"}
        </span>
      </div>
    </SlideFrame>
  );
}
