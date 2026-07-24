"use client";
import { useCallback, useEffect, useState } from "react";
import type { Part, Slide as SlideT } from "@/data/lecture";
import Slide from "./Slide";
import DeckProgress from "./DeckProgress";

export default function LectureDeck({ slides, parts }: { slides: SlideT[]; parts: Part[] }) {
  const [cur, setCur] = useState(0);
  const [step, setStep] = useState(0);
  const total = slides.length;
  const steps = slides[cur]?.steps ?? 0;

  const go = useCallback((nextCur: number, nextStep: number) => {
    const c = Math.max(0, Math.min(total - 1, nextCur));
    setCur(c); setStep(nextStep);
  }, [total]);

  const advance = useCallback(() => {
    if (step < steps) go(cur, step + 1);
    else if (cur < total - 1) go(cur + 1, 0);
  }, [cur, step, steps, total, go]);

  const back = useCallback(() => {
    if (step > 0) go(cur, step - 1);
    else if (cur > 0) go(cur - 1, slides[cur - 1]?.steps ?? 0);
  }, [cur, step, slides, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); advance(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); back(); }
      else if (e.key === "Home") { e.preventDefault(); go(0, 0); }
      else if (e.key === "End") { e.preventDefault(); go(total - 1, slides[total - 1]?.steps ?? 0); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, back, go, total, slides]);

  return (
    <div className="lec-deck">
      <div className="lec-portrait-note">
        가로가 넓은 화면에서 <b>←/→</b> 키로 발표하세요.
      </div>
      <div className="lec-hint lec-mono">← → 이동</div>
      <div className="lec-stage">
        {slides.map((s, i) => (
          <Slide key={s.id} slide={s} index={i} total={total} active={i === cur} activeStep={i === cur ? step : 0} />
        ))}
      </div>
      <DeckProgress slides={slides} parts={parts} current={cur} />
    </div>
  );
}
