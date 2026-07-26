"use client";

import { MAX_TOKENS_CAP } from "@/lib/limits";
import type { EffortLevel, GenerateRequest } from "@/lib/wire";

// xhigh·max는 뺐다 — claude-opus-5에서 이 두 단계는 사고 예산이 커서(claude-api
// 스킬: "xhigh/max에서는 max_tokens를 64K 이상으로 두라") 이 시연의 토큰 상한
// (MAX_TOKENS_CAP)에서는 사고에 예산을 다 쓰고 응답이 빈 채로 끝날 가능성이 크다.
const EFFORTS: EffortLevel[] = ["low", "medium", "high"];

// opus-5로 전환할 때 max_tokens를 이 값 이상으로 올린다. opus-5는 thinking을
// 생략해도 adaptive thinking이 기본으로 돌고 max_tokens가 사고+응답 합계에 걸리는
// 하드 상한이라(claude-api 스킬 확인 사실), 프리셋에서 넘어온 낮은 값(64~512)을
// 그대로 두면 "정상 응답이 나온다" 시연이 빈 출력으로 끝날 수 있다.
const OPUS_SAFE_MAX_TOKENS = MAX_TOKENS_CAP;

export default function ParamControls({
  value,
  onChange,
}: {
  value: GenerateRequest;
  onChange: (next: GenerateRequest) => void;
}) {
  const isOpus = value.model === "claude-opus-5";
  const set = (patch: Partial<GenerateRequest>) =>
    onChange({ ...value, ...patch });

  /** opus-5는 샘플링 파라미터를 받지 않는다. 강제 전송을 켜면 400을 확인할 수 있다. */
  const forcingSampling = isOpus && value.temperature !== undefined;

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="demo-mono text-[12px] tracking-[0.14em] text-faint">
          MODEL
        </span>
        <select
          className="border border-hairline bg-paper px-2 py-1.5 text-[14px]"
          value={value.model}
          onChange={(e) => {
            const model = e.target.value;
            // 모델을 바꾸면 그 모델이 못 받는 파라미터를 함께 걷어낸다.
            if (model === "claude-opus-5") {
              const { temperature, top_p, top_k, ...rest } = value;
              void temperature;
              void top_p;
              void top_k;
              onChange({
                ...rest,
                model,
                effort: "medium",
                max_tokens: Math.max(
                  rest.max_tokens ?? 0,
                  OPUS_SAFE_MAX_TOKENS,
                ),
              });
            } else {
              const { effort, ...rest } = value;
              void effort;
              onChange({ ...rest, model, temperature: 0.7 });
            }
          }}
        >
          <option value="claude-haiku-4-5">claude-haiku-4-5</option>
          <option value="claude-opus-5">claude-opus-5</option>
        </select>
      </label>

      {isOpus ? (
        <>
          <label className="flex flex-col gap-1">
            <span className="demo-mono text-[12px] tracking-[0.14em] text-faint">
              EFFORT
            </span>
            <select
              className="border border-hairline bg-paper px-2 py-1.5 text-[14px]"
              value={value.effort ?? "medium"}
              onChange={(e) => set({ effort: e.target.value as EffortLevel })}
            >
              {EFFORTS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-start gap-2 text-[13px] leading-relaxed">
            <input
              type="checkbox"
              className="mt-1"
              checked={forcingSampling}
              onChange={(e) => {
                if (e.target.checked) set({ temperature: 0.7 });
                else {
                  const { temperature, ...rest } = value;
                  void temperature;
                  onChange(rest);
                }
              }}
            />
            <span className="text-muted">
              <b className="text-ink">temperature를 강제로 전송</b>
              <br />
              이 모델은 샘플링 파라미터를 받지 않습니다. 켜면 400 응답을 확인할 수
              있습니다.
            </span>
          </label>
        </>
      ) : (
        <>
          <Slider
            label="TEMPERATURE"
            min={0}
            max={1}
            step={0.1}
            value={value.temperature ?? 0.7}
            onChange={(temperature) => set({ temperature })}
          />
          <Slider
            label="TOP_P"
            min={0}
            max={1}
            step={0.05}
            value={value.top_p}
            optional
            onChange={(top_p) => set({ top_p })}
            onClear={() => {
              const { top_p, ...rest } = value;
              void top_p;
              onChange(rest);
            }}
          />
          <Slider
            label="TOP_K"
            min={1}
            max={50}
            step={1}
            value={value.top_k}
            optional
            onChange={(top_k) => set({ top_k })}
            onClear={() => {
              const { top_k, ...rest } = value;
              void top_k;
              onChange(rest);
            }}
          />
        </>
      )}

      <Slider
        label="MAX_TOKENS"
        min={16}
        max={MAX_TOKENS_CAP}
        step={16}
        value={value.max_tokens ?? 512}
        onChange={(max_tokens) => set({ max_tokens })}
      />

      <label className="flex flex-col gap-1">
        <span className="demo-mono text-[12px] tracking-[0.14em] text-faint">
          SYSTEM
        </span>
        <textarea
          className="demo-mono min-h-16 border border-hairline bg-paper p-2 text-[13px] leading-relaxed"
          value={value.system ?? ""}
          onChange={(e) => set({ system: e.target.value || undefined })}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="demo-mono text-[12px] tracking-[0.14em] text-faint">
          USER
        </span>
        <textarea
          className="demo-mono min-h-32 border border-hairline bg-paper p-2 text-[13px] leading-relaxed"
          value={value.user}
          onChange={(e) => set({ user: e.target.value })}
        />
      </label>
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  optional,
  onChange,
  onClear,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number | undefined;
  optional?: boolean;
  onChange: (n: number) => void;
  onClear?: () => void;
}) {
  const active = value !== undefined;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="demo-mono text-[12px] tracking-[0.14em] text-faint">
          {label}
        </span>
        <span className="demo-mono text-[13px]">
          {active ? value : <span className="text-faint">미지정</span>}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          className="flex-1 accent-accent"
          min={min}
          max={max}
          step={step}
          value={value ?? min}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
        />
        {optional && (
          <button
            type="button"
            className="border border-hairline px-2 py-0.5 text-[12px] text-muted hover:text-ink"
            onClick={() => (active ? onClear?.() : onChange(min))}
          >
            {active ? "제거" : "추가"}
          </button>
        )}
      </div>
    </div>
  );
}
