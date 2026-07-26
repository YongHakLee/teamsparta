export type ValidationIssue = { path: string; message: string };

export const MAX_RETRIES = 2;

type Schema = Record<string, unknown>;

/**
 * 시연에 필요한 범위만 검사하는 작은 검증기다.
 * s07의 요점은 "받는 쪽에서 확인한다"는 태도이지 검증기의 완성도가 아니므로,
 * 라이브러리를 들이는 대신 필드·타입·enum·잉여 키만 본다.
 */
// #region snippet:structured-validate
export function validateAgainstSchema(
  value: unknown,
  schema: Schema,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return [{ path: "(root)", message: "JSON 객체가 아닙니다." }];
  }

  const obj = value as Record<string, unknown>;
  const props = (schema.properties ?? {}) as Record<string, Schema>;
  const required = (schema.required ?? []) as string[];

  for (const key of required) {
    if (!(key in obj)) {
      issues.push({ path: key, message: "필수 항목이 없습니다." });
    }
  }

  if (schema.additionalProperties === false) {
    for (const key of Object.keys(obj)) {
      if (!(key in props)) {
        issues.push({ path: key, message: "스키마에 없는 항목입니다." });
      }
    }
  }

  for (const [key, sub] of Object.entries(props)) {
    if (!(key in obj)) continue;
    const v = obj[key];

    const expected = sub.type as string | undefined;
    if (expected === "number" && typeof v !== "number") {
      issues.push({ path: key, message: "number 여야 합니다." });
      continue;
    }
    if (expected === "string" && typeof v !== "string") {
      issues.push({ path: key, message: "string 이어야 합니다." });
      continue;
    }
    if (expected === "object") {
      issues.push(
        ...validateAgainstSchema(v, sub).map((i) => ({
          path: `${key}.${i.path}`,
          message: i.message,
        })),
      );
      continue;
    }

    const allowed = sub.enum as unknown[] | undefined;
    if (allowed && !allowed.includes(v)) {
      issues.push({
        path: key,
        message: `${allowed.join(" | ")} 중 하나여야 합니다.`,
      });
    }
  }

  return issues;
}
// #endregion

/** 무엇이 틀렸는지를 함께 넣어 다시 묻는다. 상한은 호출하는 쪽이 건다. */
// #region snippet:structured-retry
export function buildRetryPrompt(
  original: string,
  raw: string,
  issues: ValidationIssue[],
): string {
  const list = issues.map((i) => `- ${i.path}: ${i.message}`).join("\n");
  return [
    original,
    "",
    "직전 응답이 형식 검증을 통과하지 못했습니다.",
    "",
    "받은 값:",
    raw,
    "",
    "문제:",
    list,
    "",
    "위 문제를 고쳐 스키마에 맞는 JSON만 다시 출력하세요.",
  ].join("\n");
}
// #endregion
