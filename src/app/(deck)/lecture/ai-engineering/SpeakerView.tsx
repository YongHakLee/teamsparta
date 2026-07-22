"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Part, Slide } from "@/data/lecture";
import { deckMeta } from "@/data/lecture";
import { createDeckChannel, type DeckState } from "./deckSync";
import PassphraseGate from "./PassphraseGate";

function useTimer() {
  const [sec, setSec] = useState(0);
  const [run, setRun] = useState(true);
  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [run]);
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return { label: `${mm}:${ss}`, run, toggle: () => setRun((r) => !r), reset: () => setSec(0) };
}

export default function SpeakerView({ slides, parts }: { slides: Slide[]; parts: Part[] }) {
  const [ok, setOk] = useState(() => typeof window !== "undefined" && sessionStorage.getItem("lec-present-ok") === "1");
  const [st, setSt] = useState<DeckState>({ cur: 0, step: 0 });
  const chan = useRef<ReturnType<typeof createDeckChannel> | null>(null);
  const timer = useTimer();

  useEffect(() => {
    if (!ok) return;
    chan.current = createDeckChannel((s) => setSt(s));
    return () => chan.current?.close();
  }, [ok]);

  const push = useCallback((next: DeckState) => { setSt(next); chan.current?.post(next); }, []);

  const advance = useCallback(() => {
    const steps = slides[st.cur]?.steps ?? 0;
    if (st.step < steps) push({ cur: st.cur, step: st.step + 1 });
    else if (st.cur < slides.length - 1) push({ cur: st.cur + 1, step: 0 });
  }, [st, slides, push]);
  const back = useCallback(() => {
    if (st.step > 0) push({ cur: st.cur, step: st.step - 1 });
    else if (st.cur > 0) push({ cur: st.cur - 1, step: slides[st.cur - 1]?.steps ?? 0 });
  }, [st, slides, push]);

  if (!ok) return (
    <div className="lec-speaker-gatewrap">
      <PassphraseGate expectedHash={deckMeta.presenterPassHash} onPass={() => setOk(true)} />
    </div>
  );

  const cur = slides[st.cur];
  const nxt = slides[st.cur + 1];
  const note = cur.note;
  const part = parts.find((p) => p.id === cur.partId);

  return (
    <div className="lec-speaker">
      <header className="lec-speaker-top lec-mono">
        <span>{part ? `${part.label}` : "—"} · {String(st.cur + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}</span>
        <span className="lec-speaker-timer">
          {timer.label}
          <button onClick={timer.toggle}>{timer.run ? "❚❚" : "▶"}</button>
          <button onClick={timer.reset}>↺</button>
        </span>
      </header>

      <div className="lec-speaker-grid">
        <section className="lec-speaker-preview">
          <div className="lec-speaker-cur">
            <div className="lec-mono lec-speaker-lbl">현재 · {cur.eyebrow}</div>
            <h2>{cur.title}</h2>
            <ul>{cur.body?.map((b, i) => <li key={b} data-on={(cur.steps ?? 0) === 0 || i < st.step}>{b}</li>)}</ul>
          </div>
          <div className="lec-speaker-next">
            <div className="lec-mono lec-speaker-lbl">다음</div>
            <p>{nxt ? nxt.title : "— 마지막 슬라이드 —"}</p>
          </div>
        </section>

        <section className="lec-speaker-notes">
          <div className="lec-note-block"><h3>말할 것</h3>{note.script.map((s) => <p key={s}>{s}</p>)}</div>
          <div className="lec-note-block"><h3>배경 지식</h3>{note.background.map((s) => <p key={s}>{s}</p>)}</div>
          <div className="lec-note-block"><h3>예상 질문</h3>{note.qa.map((x) => <p key={x.q}><b>Q. {x.q}</b><br />A. {x.a}</p>)}</div>
          {note.demoTips && <div className="lec-note-block"><h3>데모 팁</h3>{note.demoTips.map((s) => <p key={s}>{s}</p>)}</div>}
        </section>
      </div>

      <footer className="lec-speaker-ctrl">
        <button onClick={back}>← 이전</button>
        <button onClick={advance}>다음 →</button>
      </footer>
    </div>
  );
}
