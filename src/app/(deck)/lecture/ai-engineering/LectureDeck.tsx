"use client";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Part, Slide as SlideT } from "@/data/lecture";
import Slide from "./Slide";
import DeckProgress from "./DeckProgress";
import { createDeckChannel, type DeckState } from "./deckSync";
import SpeakerView from "./SpeakerView";

export default function LectureDeck({ slides, parts }: { slides: SlideT[]; parts: Part[] }) {
  // present 판정은 클라이언트 전용. useSyncExternalStore로 서버/최초 하이드레이션에는
  // false(덱)를 쓰고, 커밋 후 실제 ?present=1 여부로 전환한다 → 하이드레이션 불일치 없음.
  const present = useSyncExternalStore(
    () => () => {}, // 구독 없음(URL은 창 수명 동안 고정)
    () => new URLSearchParams(window.location.search).get("present") === "1", // 클라이언트 스냅샷
    () => false, // 서버 스냅샷
  );

  const [cur, setCur] = useState(0);
  const [step, setStep] = useState(0);
  const chan = useRef<ReturnType<typeof createDeckChannel> | null>(null);
  const total = slides.length;
  const steps = slides[cur]?.steps ?? 0;

  // 덱 창 ↔ 발표자 창 동기화
  useEffect(() => {
    if (present) return; // 발표자 창은 SpeakerView가 자체 채널을 연다
    chan.current = createDeckChannel((s: DeckState) => { setCur(s.cur); setStep(s.step); });
    return () => chan.current?.close();
  }, [present]);

  const go = useCallback((nextCur: number, nextStep: number) => {
    const c = Math.max(0, Math.min(total - 1, nextCur));
    setCur(c); setStep(nextStep);
    chan.current?.post({ cur: c, step: nextStep });
  }, [total]);

  const advance = useCallback(() => {
    if (step < steps) go(cur, step + 1);
    else if (cur < total - 1) go(cur + 1, 0);
  }, [cur, step, steps, total, go]);

  const back = useCallback(() => {
    if (step > 0) go(cur, step - 1);
    else if (cur > 0) go(cur - 1, slides[cur - 1]?.steps ?? 0);
  }, [cur, step, slides, go]);

  const openSpeaker = useCallback(() => {
    const url = `${window.location.pathname}?present=1`;
    window.open(url, "lec-speaker", "width=1100,height=720");
  }, []);

  useEffect(() => {
    if (present) return; // 발표자 창에서는 덱 키보드 핸들러를 붙이지 않는다
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); advance(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); back(); }
      else if (e.key === "Home") { e.preventDefault(); go(0, 0); }
      else if (e.key === "End") { e.preventDefault(); go(total - 1, slides[total - 1]?.steps ?? 0); }
      else if (e.key === "s" || e.key === "S") { e.preventDefault(); openSpeaker(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [present, advance, back, go, total, slides, openSpeaker]);

  if (present) return <SpeakerView slides={slides} parts={parts} />;

  return (
    <div className="lec-deck">
      <div className="lec-portrait-note">
        가로가 넓은 화면에서 <b>←/→</b> 키로 발표하세요.
      </div>
      <div className="lec-hint lec-mono">← → 이동 · <b>S</b> 발표자 창</div>
      <div className="lec-stage">
        {slides.map((s, i) => (
          <Slide key={s.id} slide={s} index={i} total={total} active={i === cur} activeStep={i === cur ? step : 0} />
        ))}
      </div>
      <DeckProgress slides={slides} parts={parts} current={cur} />
    </div>
  );
}
