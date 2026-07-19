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
        <span className="ax-web-only">{"// 이미지를 클릭하면 원본 크기로 열립니다"}</span>
        <span className="ax-print-only">{"// 갤러리 전체와 영상은 웹에서 확인할 수 있습니다"}</span>
      </div>
    </SlideFrame>
  );
}
