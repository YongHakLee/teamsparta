"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Part, Slide as SlideT } from "@/data/lecture";
import Slide from "./Slide";
import DeckProgress from "./DeckProgress";
import SlideOverview from "./SlideOverview";

/* 터치 조작 기준값 */
const SWIPE_MIN_PX = 30;   // 이만큼 가로로 움직여야 스와이프로 본다
const TAP_MAX_PX = 10;     // 이보다 적게 움직이면 탭으로 본다
const TAP_ZONE = 0.25;     // 화면 좌/우 25%가 이전/다음 탭 영역

/* 덱이 조작을 가로채면 안 되는 곳:
   - 데모·버튼·입력요소 — 후보 버튼, temperature 슬라이더, 패턴 탭이 그대로 동작해야 한다
   - 세로 화면 안내 · 전체 슬라이드 오버뷰 — 덮여 있는 동안 뒤에서 슬라이드가 넘어가면 안 된다 */
function isInteractive(target: EventTarget | null) {
  return target instanceof Element &&
    !!target.closest(".lec-demo, .lec-portrait-note, .lec-overview, button, a, input, select, textarea");
}

export default function LectureDeck({ slides, parts }: { slides: SlideT[]; parts: Part[] }) {
  const [cur, setCur] = useState(0);
  const [step, setStep] = useState(0);
  const [overviewOpen, setOverviewOpen] = useState(false);
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

  const closeOverview = useCallback(() => setOverviewOpen(false), []);

  /* 점프의 단계 규칙은 기존 advance/back과 같다 —
     뒤로 가면 그 장에서 마지막으로 보여준 화면 그대로, 앞으로 가면 처음부터. */
  const jumpTo = useCallback((index: number) => {
    setOverviewOpen(false);
    if (index === cur) return;
    go(index, index < cur ? (slides[index]?.steps ?? 0) : 0);
  }, [cur, slides, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      /* O로 열고 닫는다. 한글 입력 상태에서는 e.key가 "ㅐ"로 오므로 e.code도 함께 본다.
         Ctrl+O(파일 열기) 같은 조합은 브라우저에 넘긴다. */
      if ((e.key === "o" || e.key === "O" || e.code === "KeyO") &&
          !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setOverviewOpen((v) => !v);
        return;
      }
      /* 오버뷰가 열려 있으면 덱은 아무 키에도 반응하지 않는다.
         Esc·방향키는 SlideOverview가 자기 안에서 처리한다. */
      if (overviewOpen) return;

      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); advance(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); back(); }
      else if (e.key === "Home") { e.preventDefault(); go(0, 0); }
      else if (e.key === "End") { e.preventDefault(); go(total - 1, slides[total - 1]?.steps ?? 0); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, back, go, total, slides, overviewOpen]);

  /* ── 터치 조작: 좌우 스와이프 + 가장자리 탭 ──
     터치 기기에서만 켠다. 데스크톱 마우스 클릭은 지금처럼 아무 일도 하지 않는다. */
  const touch = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (isInteractive(e.target)) { touch.current = null; return; }
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;

    // 가로 성분이 세로보다 커야 스와이프 — 세로 스크롤·튕김과 구분한다.
    if (Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) advance(); else back();
      return;
    }
    // 거의 안 움직였으면 탭 — 좌/우 가장자리에서만 반응하고 가운데는 무시한다.
    if (Math.abs(dx) <= TAP_MAX_PX && Math.abs(dy) <= TAP_MAX_PX) {
      const ratio = t.clientX / window.innerWidth;
      if (ratio <= TAP_ZONE) back();
      else if (ratio >= 1 - TAP_ZONE) advance();
    }
  }, [advance, back]);

  return (
    <div className="lec-deck" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="lec-portrait-note">
        화면을 가로로 돌려주세요.
        <br />
        <b>좌우 스와이프</b> 또는 <b>화면 가장자리 탭</b>으로 넘기고,
        키보드에서는 <b>←/→</b> 키를 씁니다.
      </div>
      {/* 조작 힌트: 기기에 따라 한 쪽만 보인다(lecture.css) */}
      <div className="lec-hint lec-mono">
        <span className="lec-hint-key">← → 이동</span>
        <span className="lec-hint-touch">좌우 스와이프 · 가장자리 탭</span>
      </div>
      <div className="lec-stage">
        {slides.map((s, i) => (
          <Slide key={s.id} slide={s} index={i} total={total} active={i === cur} activeStep={i === cur ? step : 0} />
        ))}
      </div>
      <DeckProgress slides={slides} parts={parts} current={cur} />
      {overviewOpen && (
        <SlideOverview
          slides={slides}
          parts={parts}
          current={cur}
          onSelect={jumpTo}
          onClose={closeOverview}
        />
      )}
    </div>
  );
}
