import Link from "next/link";
import SlideFrame from "./SlideFrame";
import Qr from "./Qr";
import { BASE_PATH, SITE_ORIGIN } from "@/lib/paths";
import { deckMeta } from "@/data/ax";

export default function ClosingSlide({ no, total }: { no: number; total: number }) {
  return (
    <SlideFrame no={no} total={total} id={`s${no}`} eyebrow="CONTACT" className="ax-center">
      <p className="ax-title">함께 일할 이야기가 있다면</p>
      <p className="ax-tagline">
        <a href="mailto:feint225@gmail.com" className="ax-acc" style={{ fontWeight: 600 }}>
          feint225@gmail.com
        </a>
      </p>
      <Qr text={`${SITE_ORIGIN}${BASE_PATH}${deckMeta.path}`} className="ax-qr-sm" />
      <p className="ax-figcap ax-mono">{SITE_ORIGIN}{BASE_PATH}{deckMeta.path}</p>
      <nav className="ax-links ax-web-only">
        <Link href="/resume" className="ax-link">이력서</Link>
        <Link href="/portfolio" className="ax-link">포트폴리오 전체</Link>
      </nav>
      {/* 인쇄본은 링크를 누를 수 없다 — 주소를 글자로 남긴다 */}
      <p className="ax-figcap ax-mono ax-print-only ax-links-print">
        이력서 {SITE_ORIGIN}{BASE_PATH}/resume · 포트폴리오 {SITE_ORIGIN}{BASE_PATH}/portfolio
      </p>
    </SlideFrame>
  );
}
