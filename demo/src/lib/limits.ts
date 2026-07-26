/**
 * 서버가 받아들일 범위를 정한다.
 * 남용 방어가 아니라 사고 방지가 목적이다 — 1회성 시연이라 인증·요청 제한은 두지 않지만,
 * 무한 루프나 오타로 토큰을 태우는 것은 막는다.
 */

export const ALLOWED_MODELS = ["claude-haiku-4-5", "claude-opus-5"] as const;
export type AllowedModel = (typeof ALLOWED_MODELS)[number];

export const MAX_TOKENS_CAP = 2048;
export const MAX_PROMPT_CHARS = 8000;

export class LimitError extends Error {
  readonly status = 400 as const;
  constructor(message: string) {
    super(message);
    this.name = "LimitError";
  }
}

export function assertAllowedModel(model: string): AllowedModel {
  if ((ALLOWED_MODELS as readonly string[]).includes(model)) {
    return model as AllowedModel;
  }
  throw new LimitError(
    `허용되지 않은 모델입니다: ${model}. 사용 가능: ${ALLOWED_MODELS.join(", ")}`,
  );
}

export function clampMaxTokens(n: number | undefined): number {
  if (n === undefined || Number.isNaN(n)) return MAX_TOKENS_CAP;
  return Math.min(MAX_TOKENS_CAP, Math.max(1, Math.floor(n)));
}

export function assertPromptLength(text: string): void {
  if (text.length > MAX_PROMPT_CHARS) {
    throw new LimitError(
      `프롬프트가 너무 깁니다: ${text.length}자 (상한 ${MAX_PROMPT_CHARS}자)`,
    );
  }
}
