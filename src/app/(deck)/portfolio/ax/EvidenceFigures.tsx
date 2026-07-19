"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { EvidenceItem } from "@/data/ax";
import { asset } from "@/lib/paths";

/* 증빙 자료 그리드 + 클릭 확대(라이트박스). 인쇄 대체는 EvidenceSlide가 담당.
   qrSvgs: link 증빙의 QR을 서버에서 미리 그려 넘겨받는다(클라이언트에서 생성하지 않음) */
export default function EvidenceFigures({
  items,
  qrSvgs = {},
}: {
  items: EvidenceItem[];
  qrSvgs?: Record<string, string>;
}) {
  // 라이트박스에서 넘겨볼 수 있는 이미지의 평탄화 목록
  const zoomable = items.flatMap((item, fi) =>
    item.kind === "image"
      ? [{ fi, src: item.src, alt: item.alt }]
      : item.kind === "gallery"
        ? item.images.map((img) => ({ fi, src: img.src, alt: img.alt }))
        : [],
  );
  const [open, setOpen] = useState<number | null>(null);
  // 라이트박스 dialog 컨테이너 및 열기 이전 포커스 대상
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  const move = useCallback(
    (d: number) => setOpen((cur) => (cur === null ? null : (cur + d + zoomable.length) % zoomable.length)),
    [zoomable.length],
  );

  // 열릴 때: 이전 포커스 저장 후 닫기 버튼으로 이동 / 닫힐 때: 이전 포커스 복원
  useEffect(() => {
    const isOpen = open !== null;
    if (isOpen && !wasOpenRef.current) {
      prevFocusRef.current = document.activeElement as HTMLElement | null;
      dialogRef.current?.querySelector<HTMLButtonElement>(".ax-lb-close")?.focus();
    } else if (!isOpen && wasOpenRef.current) {
      prevFocusRef.current?.focus();
    }
    wasOpenRef.current = isOpen;
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "Tab") {
        // 포커스 트랩: dialog 내부 버튼들 사이에서만 순환
        const focusables = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, move]);

  const zoomIndex = (src: string) => zoomable.findIndex((z) => z.src === src);

  return (
    <>
      <div className="ax-figs">
        {items.map((item, i) => {
          const cap = (
            <p className="ax-figcap">
              <span className="ax-mono ax-acc">fig.{String(i + 1).padStart(2, "0")}</span>
              {" — "}
              {"caption" in item ? item.caption : item.title}
            </p>
          );

          if (item.kind === "image")
            return (
              <figure key={item.src} className="ax-fig">
                <button
                  type="button"
                  className={`ax-figbox ${item.fit === "contain" ? "ax-fit" : ""}`}
                  aria-label={`${item.alt} 크게 보기`}
                  onClick={() => setOpen(zoomIndex(item.src))}
                >
                  <img src={asset(item.src)} alt={item.alt} />
                </button>
                {cap}
              </figure>
            );

          if (item.kind === "gallery") {
            const head = item.images.slice(0, 3);
            const rest = item.images.length - head.length;
            return (
              <figure key={item.caption} className="ax-fig">
                <div className="ax-grid2">
                  {head.map((img) => (
                    <button
                      type="button"
                      key={img.src}
                      aria-label={`${img.alt} 크게 보기`}
                      onClick={() => setOpen(zoomIndex(img.src))}
                    >
                      <img src={asset(img.src)} alt={img.alt} />
                    </button>
                  ))}
                  {rest > 0 && (
                    <button
                      type="button"
                      className="ax-more ax-mono"
                      aria-label="갤러리 전체 보기"
                      onClick={() => setOpen(zoomIndex(item.images[3].src))}
                    >
                      +{rest}
                    </button>
                  )}
                </div>
                {cap}
              </figure>
            );
          }

          if (item.kind === "video")
            return (
              <figure key={item.src} className="ax-fig" style={{ flex: 1.6 }}>
                <div className="ax-figbox ax-web-only" style={{ cursor: "default" }}>
                  <video controls preload="metadata" poster={asset(item.poster)} src={asset(item.src)} />
                </div>
                {/* 인쇄본에서는 재생할 수 없으므로 같은 자리를 포스터 컷이 대신한다 */}
                <div className="ax-figbox ax-print-only">
                  <img src={asset(item.poster)} alt="시연 영상 대표 컷" />
                </div>
                {cap}
              </figure>
            );

          if (item.kind === "flow")
            return (
              <figure key={item.title} className="ax-fig" style={{ flex: 1.5 }}>
                <div className="ax-flow">
                  <strong className="ax-flow-title">{item.title}</strong>
                  <ol className="ax-flow-steps">
                    {item.steps.map((s) => (
                      <li key={s.actor + s.text}>
                        <span className="ax-mono ax-flow-actor">{s.actor}</span>
                        <span className="ax-flow-text">{s.text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                {cap}
              </figure>
            );

          if (item.kind === "links")
            return (
              <figure key={item.caption} className="ax-fig">
                <div className="ax-links">
                  {item.items.map((l) => (
                    <a
                      key={l.url}
                      className="ax-linkrow"
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${l.label} 열기 — ${l.url}`}
                    >
                      <span
                        className="ax-qr"
                        aria-hidden="true"
                        dangerouslySetInnerHTML={{ __html: qrSvgs[l.url] ?? "" }}
                      />
                      <span className="ax-linkbody">
                        <span className="ax-linklabel">{l.label}</span>
                        <span className="ax-mono ax-linkurl">
                          {l.url.replace(/^https?:\/\//, "")}
                        </span>
                        <span className="ax-mut ax-linknote">{l.note}</span>
                      </span>
                    </a>
                  ))}
                </div>
                {cap}
              </figure>
            );

          // note
          return (
            <figure key={item.title} className="ax-fig" style={{ flex: 0.8 }}>
              <div className="ax-notebox">
                <strong>{item.title}</strong>
                {item.lines.map((line) => (
                  <div key={line} className="ax-mono ax-mut">{line}</div>
                ))}
              </div>
              {cap}
            </figure>
          );
        })}
      </div>

      {open !== null && zoomable[open] && (
        <div className="ax-lightbox" role="dialog" aria-modal="true" ref={dialogRef} onClick={() => setOpen(null)}>
          <img src={asset(zoomable[open].src)} alt={zoomable[open].alt} onClick={(e) => e.stopPropagation()} />
          <button type="button" className="ax-lb-close" aria-label="닫기" onClick={() => setOpen(null)}>×</button>
          {zoomable.length > 1 && (
            <>
              <button type="button" className="ax-lb-prev" aria-label="이전" onClick={(e) => { e.stopPropagation(); move(-1); }}>‹</button>
              <button type="button" className="ax-lb-next" aria-label="다음" onClick={(e) => { e.stopPropagation(); move(1); }}>›</button>
              <span className="ax-lb-count ax-mono">{open + 1} / {zoomable.length}</span>
            </>
          )}
        </div>
      )}
    </>
  );
}
