import type { GenerateRequest } from "@/lib/wire";
import { buildPatternPrompt } from "@/lib/prompts";

export type PresetVariant = {
  label: string;
  request: GenerateRequest;
  /** 이 변형을 몇 번 반복 호출할지. s03의 무작위성 비교에 쓴다. */
  repeat?: number;
};

export type Preset = {
  id: string;
  slide: string;
  label: string;
  desc: string;
  variants: PresetVariant[];
  snippetId: string;
  snippetCaption: string;
};

const REVIEW = "배송은 빨랐지만 품질이 별로였다";

export const PRESETS: Preset[] = [
  {
    id: "randomness",
    slide: "s03",
    label: "무작위성",
    desc: "같은 프롬프트를 temperature만 바꿔 각 5회 호출합니다. 출력이 갈리는 정도를 비교하세요.",
    snippetId: "sampling",
    snippetCaption:
      "temperature·top_p·top_k가 Messages API 파라미터로 들어가는 지점입니다.",
    variants: [
      {
        label: "temperature 0",
        repeat: 5,
        request: {
          model: "claude-haiku-4-5",
          user: "무선 이어폰 광고 문구를 한 문장으로 써줘. 문장만 출력해.",
          temperature: 0,
          max_tokens: 64,
        },
      },
      {
        label: "temperature 1.0",
        repeat: 5,
        request: {
          model: "claude-haiku-4-5",
          user: "무선 이어폰 광고 문구를 한 문장으로 써줘. 문장만 출력해.",
          temperature: 1,
          max_tokens: 64,
        },
      },
    ],
  },
  {
    id: "patterns",
    slide: "s05",
    label: "지시 방법",
    desc: "같은 리뷰에 세 가지 프롬프트 구성을 보냅니다. 출력 토큰 수를 함께 보세요 — CoT의 비용이 드러납니다.",
    snippetId: "prompt-patterns",
    snippetCaption:
      "세 방식의 차이는 결국 messages 배열을 어떻게 구성하느냐입니다.",
    variants: [
      {
        label: "Zero-shot",
        request: {
          model: "claude-haiku-4-5",
          user: buildPatternPrompt("zero", REVIEW),
          temperature: 0,
          max_tokens: 256,
        },
      },
      {
        label: "Few-shot",
        request: {
          model: "claude-haiku-4-5",
          user: buildPatternPrompt("few", REVIEW),
          temperature: 0,
          max_tokens: 256,
        },
      },
      {
        label: "CoT",
        request: {
          model: "claude-haiku-4-5",
          user: buildPatternPrompt("cot", REVIEW),
          temperature: 0,
          max_tokens: 512,
        },
      },
    ],
  },
  {
    id: "antipattern",
    slide: "s06",
    label: "안티패턴",
    desc: "나쁜 프롬프트와 고친 프롬프트를 나란히 실행합니다. 덱의 네 가지 안티패턴 중 하나를 고르세요.",
    snippetId: "sampling",
    snippetCaption: "프롬프트 문자열만 다를 뿐, 호출 코드는 같습니다.",
    variants: [
      {
        label: "① 모호한 지시 — 나쁜 예",
        request: {
          model: "claude-haiku-4-5",
          user: `리뷰 좀 정리해줘.\n리뷰: "${REVIEW}"`,
          temperature: 0,
          max_tokens: 256,
        },
      },
      {
        label: "① 모호한 지시 — 고친 예",
        request: {
          model: "claude-haiku-4-5",
          user: `리뷰를 긍정/부정/중립 중 하나로 분류하고 한 단어로만 답해줘.\n리뷰: "${REVIEW}"`,
          temperature: 0,
          max_tokens: 256,
        },
      },
      {
        label: "③ 한 번에 여러 작업 — 나쁜 예",
        request: {
          model: "claude-haiku-4-5",
          user: `이 리뷰를 요약하고 영어로 번역하고 키워드도 뽑아줘.\n리뷰: "${REVIEW}"`,
          temperature: 0,
          max_tokens: 256,
        },
      },
      {
        label: "③ 한 번에 여러 작업 — 고친 예",
        request: {
          model: "claude-haiku-4-5",
          user: `다음 리뷰를 처리해줘. 세 항목을 각각 라벨을 붙여 모두 출력해.\n1) 요약: 한 문장\n2) 영어 번역: 한 문장\n3) 키워드: 3개, 쉼표로 구분\n리뷰: "${REVIEW}"`,
          temperature: 0,
          max_tokens: 256,
        },
      },
    ],
  },
  {
    id: "structured",
    slide: "s07",
    label: "구조화 출력",
    desc: "자유 텍스트와 스키마 강제를 비교합니다. 스키마 쪽은 응답을 검증하고, 실패하면 오류를 붙여 재요청합니다.",
    snippetId: "structured-output",
    snippetCaption:
      "output_config.format으로 형식을 강제하고, 받는 쪽에서 한 번 더 검증합니다.",
    variants: [
      {
        label: "자유 텍스트",
        request: {
          model: "claude-haiku-4-5",
          user: `이 리뷰의 감성을 알려줘.\n리뷰: "${REVIEW}"`,
          temperature: 0,
          max_tokens: 256,
        },
      },
      {
        label: "JSON 스키마 강제",
        request: {
          model: "claude-haiku-4-5",
          user: `다음 리뷰를 분석해줘.\n리뷰: "${REVIEW}"`,
          temperature: 0,
          max_tokens: 512,
          json_schema: {
            type: "object",
            properties: {
              sentiment: {
                type: "string",
                enum: ["positive", "negative", "neutral"],
              },
              confidence: { type: "number" },
              aspects: {
                type: "object",
                properties: {
                  배송: { type: "string", enum: ["positive", "negative"] },
                  품질: { type: "string", enum: ["positive", "negative"] },
                },
                required: ["배송", "품질"],
                additionalProperties: false,
              },
            },
            required: ["sentiment", "confidence", "aspects"],
            additionalProperties: false,
          },
        },
      },
    ],
  },
];
