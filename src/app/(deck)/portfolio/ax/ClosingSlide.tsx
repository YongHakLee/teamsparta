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
      <p className="ax-tagline ax-web-only">
        <Link href="/resume">이력서</Link>
        <span className="ax-fnt"> · </span>
        <Link href="/portfolio">포트폴리오 전체</Link>
      </p>
      <Qr text={`${SITE_ORIGIN}${BASE_PATH}${deckMeta.path}`} className="ax-qr-sm" />
      <p className="ax-figcap ax-mono">{SITE_ORIGIN}{BASE_PATH}{deckMeta.path}</p>
    </SlideFrame>
  );
}
