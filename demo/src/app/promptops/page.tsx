"use client";

import { useCallback, useState } from "react";
import DemoShell from "@/components/DemoShell";
import ParamControls from "@/components/ParamControls";
import RequestPane from "@/components/RequestPane";
import ResponsePane, { IDLE, type RunState } from "@/components/ResponsePane";
import RightPanel, { type PanelTab } from "@/components/RightPanel";
import { streamGenerate } from "@/lib/sse";
import type { GenerateRequest } from "@/lib/wire";

const INITIAL: GenerateRequest = {
  model: "claude-haiku-4-5",
  user: '다음 리뷰의 감성을 분류해줘.\n리뷰: "배송은 빨랐지만 품질이 별로였다"',
  temperature: 0.7,
  max_tokens: 512,
};

export default function PromptOpsPage() {
  const [request, setRequest] = useState<GenerateRequest>(INITIAL);
  const [tab, setTab] = useState<PanelTab>("request");
  const [run, setRun] = useState<RunState>(IDLE);

  const onRun = useCallback(async () => {
    setRun({ status: "running", text: "" });
    setTab("response");
    await streamGenerate(request, (f) => {
      setRun((prev) => {
        if (f.type === "delta") {
          return { ...prev, status: "running", text: prev.text + f.text };
        }
        if (f.type === "done") {
          return {
            ...prev,
            status: "done",
            usage: f.usage,
            stop_reason: f.stop_reason,
          };
        }
        return {
          ...prev,
          status: "error",
          error: { status: f.status, name: f.name, message: f.message },
        };
      });
    });
  }, [request]);

  return (
    <DemoShell title="PROMPTOPS">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <section>
          <h1 className="mb-4 text-lg font-bold">조작</h1>
          <ParamControls value={request} onChange={setRequest} />
        </section>
        <section>
          <RightPanel
            tab={tab}
            onTab={setTab}
            request={<RequestPane request={request} />}
            code={<p className="text-[13px] text-muted">Task 6에서 채웁니다.</p>}
            response={<ResponsePane state={run} onRun={onRun} />}
          />
        </section>
      </div>
    </DemoShell>
  );
}
