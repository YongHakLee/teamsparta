// anthropic.ts와 분리한 이유: anthropic.ts는 최상단에서 @anthropic-ai/sdk를 import하는데,
// presets.ts는 클라이언트 컴포넌트에서 이 함수를 불러 쓴다. 같이 두면 SDK가 브라우저 번들로 끌려온다.

/** s05 — 세 가지 지시 방법의 차이는 결국 user 메시지 문자열 하나다. */
// #region snippet:prompt-patterns
export function buildPatternPrompt(
  kind: "zero" | "few" | "cot",
  review: string,
): string {
  switch (kind) {
    case "zero":
      return `다음 리뷰의 감성을 분류해줘.\n리뷰: "${review}"`;
    case "few":
      return `예시)\n"최고예요" → 긍정\n"다신 안 사요" → 부정\n\n리뷰: "${review}" →`;
    case "cot":
      return `다음 리뷰를 단계적으로 생각해서 분류해줘.\n리뷰: "${review}"`;
  }
}
// #endregion
