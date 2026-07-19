import { Fragment } from "react";
import type { Metadata } from "next";
import "./ax.css";
import { axProjects, deckMeta } from "@/data/ax";
import CoverSlide from "./CoverSlide";
import StackMapSlide from "./StackMapSlide";
import OverviewSlide from "./OverviewSlide";
import EvidenceSlide from "./EvidenceSlide";
import ClosingSlide from "./ClosingSlide";
import DeckChrome from "./DeckChrome";
import PrintNotice from "./PrintNotice";

export const metadata: Metadata = {
  title: deckMeta.title,
  description: `${deckMeta.author}의 ${deckMeta.title} — ${deckMeta.thesis}`,
};

export default function AxDeckPage() {
  const total = axProjects.length * 2 + 3;
  let no = 0;
  const next = () => ++no;

  return (
    <div className="ax-deck">
      <PrintNotice />
      <DeckChrome total={total} />
      <CoverSlide no={next()} total={total} />
      <StackMapSlide no={next()} total={total} />
      {axProjects.map((p) => {
        const overviewNo = next();
        const evidenceNo = next();
        // Fragment로 감싼다 — 래퍼 엘리먼트를 두면 인쇄 CSS의 :last-child 판정이 어긋난다
        return (
          <Fragment key={p.code}>
            <OverviewSlide p={p} no={overviewNo} total={total} />
            <EvidenceSlide p={p} no={evidenceNo} total={total} />
          </Fragment>
        );
      })}
      <ClosingSlide no={next()} total={total} />
    </div>
  );
}
