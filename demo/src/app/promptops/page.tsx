"use client";

import { useCallback, useRef, useState } from "react";
import CodePane from "@/components/CodePane";
import DemoShell from "@/components/DemoShell";
import ParamControls from "@/components/ParamControls";
import PresetTabs from "@/components/PresetTabs";
import RequestPane from "@/components/RequestPane";
import ResponsePane, { IDLE, type RunState } from "@/components/ResponsePane";
import RightPanel, { type PanelTab } from "@/components/RightPanel";
import { PRESETS, type Preset } from "@/data/presets";
import { loadFixture } from "@/lib/fixtures";
import { streamGenerate } from "@/lib/sse";
import type { GenerateRequest, SseFrame } from "@/lib/wire";

type VariantRun = { label: string; runs: RunState[] };

export default function PromptOpsPage() {
  const [preset, setPreset] = useState<Preset>(PRESETS[0]);
  const [request, setRequest] = useState<GenerateRequest>(
    PRESETS[0].variants[0].request,
  );
  const [tab, setTab] = useState<PanelTab>("request");
  const [single, setSingle] = useState<RunState>(IDLE);
  const [variantRuns, setVariantRuns] = useState<VariantRun[] | null>(null);

  // 실행 세대 카운터. 발표 중 프리셋을 갈아타거나 실행을 다시 누르면 증가시켜,
  // 버려진 이전 실행에서 뒤늦게 도착한 프레임이 새 상태를 옛 인덱스로 건드리지 않게 한다.
  const generationRef = useRef(0);

  const selectPreset = useCallback((p: Preset) => {
    generationRef.current += 1;
    setPreset(p);
    setRequest(p.variants[0].request);
    setSingle(IDLE);
    setVariantRuns(null);
    setTab("request");
  }, []);

  /** 왼쪽 조작부의 현재 요청 하나만 실행한다. */
  const runSingle = useCallback(async () => {
    const generation = ++generationRef.current;
    setSingle({ status: "running", text: "" });
    setVariantRuns(null);
    setTab("response");

    let next: RunState = { status: "running", text: "" };
    await streamGenerate(request, (f) => {
      if (generation !== generationRef.current) return;
      next = reduceFrame(next, f);
      setSingle(next);
    });

    if (generation !== generationRef.current) return;

    // 400은 시연 재료(모델 전환 토글)이므로 폴백하지 않는다.
    // 그 외의 에러(네트워크 실패 포함 status:0, 401, 5xx 등)는 실시간 호출이
    // 죽었다는 뜻이므로 리허설 때 기록해 둔 fixture로 대체한다.
    if (next.status === "error" && next.error?.status !== 400) {
      const variant = preset.variants.find(
        (v) => JSON.stringify(v.request) === JSON.stringify(request),
      );
      const fx = variant && loadFixture(preset.id, variant.label);
      if (fx) {
        setSingle({
          status: "done",
          text: fx.text,
          usage: fx.usage,
          fromFixture: true,
        });
      }
    }
  }, [request, preset]);

  /** 프리셋의 모든 변형을 (repeat 회수만큼) 병렬 실행해 나란히 비교한다. */
  const runPreset = useCallback(async () => {
    const generation = ++generationRef.current;
    const initial: VariantRun[] = preset.variants.map((v) => ({
      label: v.label,
      runs: Array.from({ length: v.repeat ?? 1 }, () => ({
        status: "running" as const,
        text: "",
      })),
    }));
    setVariantRuns(initial);
    setTab("response");

    await Promise.all(
      preset.variants.flatMap((v, vi) =>
        Array.from({ length: v.repeat ?? 1 }, (_, ri) =>
          streamGenerate(v.request, (f) => {
            if (generation !== generationRef.current) return;
            setVariantRuns((prev) => {
              if (!prev) return prev;
              // 방어적으로: 옛 세대 인덱스가 새 배열 범위를 벗어나면 그대로 반환.
              if (!prev[vi] || !prev[vi].runs[ri]) return prev;
              const next = prev.map((x) => ({ ...x, runs: [...x.runs] }));
              next[vi].runs[ri] = reduceFrame(next[vi].runs[ri], f);
              return next;
            });
          }),
        ),
      ),
    );

    // 기록 모드: ?record=1로 열었을 때만 동작한다. 리허설 중 fixture를 뽑기 위한 것이라
    // 발표용 빌드에는 영향이 없다.
    if (new URLSearchParams(window.location.search).get("record") === "1") {
      setVariantRuns((prev) => {
        if (!prev) return prev;
        const out = prev.flatMap((v) =>
          v.runs[0] && v.runs[0].status === "done"
            ? [
                {
                  presetId: preset.id,
                  variantLabel: v.label,
                  text: v.runs[0].text,
                  usage: v.runs[0].usage ?? {
                    input_tokens: 0,
                    output_tokens: 0,
                  },
                },
              ]
            : [],
        );
        // 콘솔에서 복사해 src/data/fixtures.json 배열에 합친다.
        console.log("[fixtures]\n" + JSON.stringify(out, null, 2));
        return prev;
      });
    }
  }, [preset]);

  return (
    <DemoShell title="PROMPTOPS">
      <div className="mx-auto max-w-6xl">
        <PresetTabs
          presets={PRESETS}
          activeId={preset.id}
          onSelect={selectPreset}
        />
        <p className="mt-3 text-[14px] leading-relaxed text-muted">
          {preset.desc}
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-lg font-bold">조작</h1>
              <button
                type="button"
                onClick={runPreset}
                className="border border-ink px-3 py-1 text-[13px] font-semibold hover:bg-ink hover:text-paper"
              >
                프리셋 전체 실행
              </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {preset.variants.map((v) => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => setRequest(v.request)}
                  className="border border-hairline px-2 py-1 text-[12px] text-muted hover:border-accent hover:text-ink"
                >
                  {v.label}
                </button>
              ))}
            </div>
            <ParamControls value={request} onChange={setRequest} />
          </section>

          <section>
            <RightPanel
              tab={tab}
              onTab={setTab}
              request={<RequestPane request={request} />}
              code={
                <CodePane
                  id={preset.snippetId}
                  caption={preset.snippetCaption}
                />
              }
              response={
                variantRuns ? (
                  <VariantGrid variants={variantRuns} />
                ) : (
                  <ResponsePane state={single} onRun={runSingle} />
                )
              }
            />
          </section>
        </div>
      </div>
    </DemoShell>
  );
}

function reduceFrame(prev: RunState, f: SseFrame): RunState {
  if (f.type === "delta") {
    return { ...prev, status: "running", text: prev.text + f.text };
  }
  if (f.type === "validation") {
    return {
      ...prev,
      validations: [
        ...(prev.validations ?? []),
        { attempt: f.attempt, ok: f.ok, issues: f.issues },
      ],
    };
  }
  if (f.type === "done") {
    return { ...prev, status: "done", usage: f.usage, stop_reason: f.stop_reason };
  }
  return {
    ...prev,
    status: "error",
    error: { status: f.status, name: f.name, message: f.message },
  };
}

function VariantGrid({ variants }: { variants: VariantRun[] }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${variants.length <= 3 ? variants.length : 2}, minmax(0, 1fr))` }}>
      {variants.map((v) => {
        const totalOut = v.runs.reduce(
          (a, r) => a + (r.usage?.output_tokens ?? 0),
          0,
        );
        return (
          <div key={v.label} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between border-b border-hairline pb-1">
              <span className="text-[13px] font-semibold">{v.label}</span>
              {totalOut > 0 && (
                <span className="demo-mono text-[11px] text-muted">
                  출력 {totalOut}토큰
                </span>
              )}
            </div>
            {v.runs.map((r, i) => (
              <div key={i} className="flex flex-col gap-1">
                {r.validations && r.validations.length > 0 && (
                  <div className="demo-mono flex flex-col gap-0.5 text-[11px]">
                    {r.validations.map((val) => (
                      <span
                        key={val.attempt}
                        className={val.ok ? "text-ink" : "text-accent"}
                      >
                        {val.attempt + 1}회차 검증 {val.ok ? "통과" : "실패"}
                        {!val.ok &&
                          ` — ${val.issues.map((iss) => `${iss.path}: ${iss.message}`).join(" / ")}`}
                      </span>
                    ))}
                  </div>
                )}
                {/* 폴백이 단일 실행에만 걸려 있어 지금은 닿지 않는 경로다 (프리셋 전체 실행에는 폴백이 없다) */}
                {r.fromFixture && (
                  <div className="demo-mono text-[11px] text-accent">저장된 응답</div>
                )}
                <pre className="demo-mono min-h-10 whitespace-pre-wrap border border-hairline bg-paper p-2 text-[12px] leading-relaxed">
                  {r.error
                    ? `${r.error.status > 0 ? `HTTP ${r.error.status} · ` : ""}${r.error.name}\n${r.error.message}`
                    : r.text || "…"}
                </pre>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
