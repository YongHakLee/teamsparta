import SlideFrame from "./SlideFrame";
import { deckMeta } from "@/data/ax";
import BootLog from "./BootLog";

export default function CoverSlide({ no, total }: { no: number; total: number }) {
  return (
    <SlideFrame no={no} total={total} id={`s${no}`} eyebrow="PORTFOLIO — SPECIAL SECTION" className="ax-cover">
      <h1 className="ax-cover-title">
        AI Agent /<br />
        Full-stack AX <span className="ax-acc">포트폴리오</span>
      </h1>
      <p className="ax-tagline">
        {deckMeta.author} — {deckMeta.thesis}
      </p>
      <BootLog lines={deckMeta.bootLog} />
    </SlideFrame>
  );
}
