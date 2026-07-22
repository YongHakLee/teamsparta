import type { Slide } from "@/data/lecture";
import NextTokenDemo from "./demos/NextTokenDemo";
import PromptPatternDemo from "./demos/PromptPatternDemo";
import RagPipelineDemo from "./demos/RagPipelineDemo";
import LlmOpsDashboardDemo from "./demos/LlmOpsDashboardDemo";

/* activeStep: 0이면 아무 fragment도 안 열림, n이면 data-frag<=n 까지 열림 */
export default function SlideBody({ slide, activeStep }: { slide: Slide; activeStep: number }) {
  if (slide.kind === "cover") {
    return (
      <div style={{ marginTop: "auto", marginBottom: "auto" }}>
        <h1 className="lec-title">{slide.title}</h1>
        {slide.body?.map((b) => (
          <p key={b} className="lec-mut" style={{ fontSize: "0.95em", marginTop: "0.6em" }}>{b}</p>
        ))}
      </div>
    );
  }

  return (
    <>
      {slide.title && <h2 className="lec-title">{slide.title}</h2>}
      {slide.body && (
        <ul className="lec-body">
          {slide.body.map((b, i) => {
            const stepped = (slide.steps ?? 0) > 0;
            const on = !stepped || i < activeStep;
            return (
              <li key={b} className={`lec-frag ${on ? "lec-frag-on" : ""}`}>{b}</li>
            );
          })}
        </ul>
      )}
      {/* 데모 슬롯: slide.demo 별 컴포넌트 연결 */}
      {slide.demo === "nextToken" && <NextTokenDemo />}
      {slide.demo === "promptPattern" && <PromptPatternDemo />}
      {slide.demo === "ragPipeline" && <RagPipelineDemo />}
      {slide.demo === "llmOps" && <LlmOpsDashboardDemo />}
    </>
  );
}
