"use client";

import { useCallback, useState } from "react";
import CodePane from "@/components/CodePane";
import DemoShell from "@/components/DemoShell";
import ParamControls from "@/components/ParamControls";
import PresetTabs from "@/components/PresetTabs";
import RequestPane from "@/components/RequestPane";
import ResponsePane, { IDLE, type RunState } from "@/components/ResponsePane";
import RightPanel, { type PanelTab } from "@/components/RightPanel";
import { PRESETS, type Preset } from "@/data/presets";
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

  const selectPreset = useCallback((p: Preset) => {
    setPreset(p);
    setRequest(p.variants[0].request);
    setSingle(IDLE);
    setVariantRuns(null);
    setTab("request");
  }, []);

  /** 왼쪽 조작부의 현재 요청 하나만 실행한다. */
  const runSingle = useCallback(async () => {
    setSingle({ status: "running", text: "" });
    setVariantRuns(null);
    setTab("response");
    await streamGenerate(request, (f) =>
      setSingle((prev) => reduceFrame(prev, f)),
    );
  }, [request]);

  /** 프리셋의 모든 변형을 (repeat 회수만큼) 병렬 실행해 나란히 비교한다. */
  const runPreset = useCallback(async () => {
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
          streamGenerate(v.request, (f) =>
            setVariantRuns((prev) => {
              if (!prev) return prev;
              const next = prev.map((x) => ({ ...x, runs: [...x.runs] }));
              next[vi].runs[ri] = reduceFrame(next[vi].runs[ri], f);
              return next;
            }),
          ),
        ),
      ),
    );
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
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(variants.length, 3)}, minmax(0, 1fr))` }}>
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
              <pre
                key={i}
                className="demo-mono min-h-10 whitespace-pre-wrap border border-hairline bg-paper p-2 text-[12px] leading-relaxed"
              >
                {r.error
                  ? `${r.error.status > 0 ? `HTTP ${r.error.status} · ` : ""}${r.error.name}\n${r.error.message}`
                  : r.text || "…"}
              </pre>
            ))}
          </div>
        );
      })}
    </div>
  );
}
