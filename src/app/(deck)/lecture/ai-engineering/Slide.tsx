import type { Slide as SlideT } from "@/data/lecture";
import SlideBody from "./SlideBody";

export default function Slide({
  slide, index, total, activeStep, active,
}: { slide: SlideT; index: number; total: number; activeStep: number; active: boolean }) {
  return (
    <div
      data-slide={index + 1}
      className={`lec-viewport ${active ? "lec-active" : ""}`}
      aria-hidden={!active}
    >
      <section className={`lec-slide ${slide.kind === "cover" ? "lec-cover" : ""} ${slide.kind === "closing" ? "lec-center" : ""}`}>
        <div className="lec-ebrow lec-mono">
          <span>{slide.eyebrow}</span>
          <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
        <SlideBody slide={slide} activeStep={activeStep} />
      </section>
    </div>
  );
}
