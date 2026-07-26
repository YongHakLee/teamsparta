export type EffortLevel = "low" | "medium" | "high" | "xhigh" | "max";

/** 브라우저 → /api/generate 요청 본문 */
export type GenerateRequest = {
  model: string;
  system?: string;
  user: string;
  max_tokens?: number;
  /** haiku 전용. opus-5에 보내면 400이 나는데, 그게 모델 전환 시연의 목적이다. */
  temperature?: number;
  top_p?: number;
  top_k?: number;
  /** opus-5 전용 */
  effort?: EffortLevel;
  /** s07 구조화 출력. JSON Schema 객체 */
  json_schema?: Record<string, unknown>;
};

/** /api/generate → 브라우저 SSE 프레임 */
export type SseFrame =
  | { type: "delta"; text: string }
  | {
      type: "done";
      stop_reason: string | null;
      usage: { input_tokens: number; output_tokens: number };
    }
  | { type: "error"; status: number; name: string; message: string };
