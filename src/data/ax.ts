// AX 포트폴리오 덱 데이터. 프로젝트를 추가하면 개요+증빙 슬라이드 2장이 자동으로 늘어난다.
// (stackLayers의 cells 배열도 프로젝트 순서에 맞춰 한 칸씩 추가할 것)

export type PipelineStep = { step: string; note: string };
export type WorkItem = { lead: string; text: string };

export type EvidenceItem =
  // fit: "contain" — 문서 스캔처럼 잘리면 안 되는 이미지 (기본은 채우기)
  | { kind: "image"; src: string; alt: string; caption: string; fit?: "contain" }
  | { kind: "gallery"; images: { src: string; alt: string }[]; caption: string }
  | { kind: "video"; src: string; poster: string; caption: string }
  | { kind: "note"; title: string; lines: string[] }
  // 배포된 서비스 자체가 증빙인 경우 — QR로 인쇄본에서도 바로 열 수 있다
  | { kind: "links"; items: { label: string; url: string; note: string }[]; caption: string }
  // 화면으로 보여줄 수 없는 동작(에이전트 한 턴)을 흐름으로 보여준다
  | { kind: "flow"; title: string; steps: { actor: string; text: string }[]; caption: string };

export type AxProject = {
  code: string; // "AX-01"
  slug: string;
  name: string; // 아이브로우용 짧은 이름
  title: string; // 프로젝트명
  tagline: string; // 제목 아래 한 줄 (역할 — 핵심 성과)
  role: string;
  works: WorkItem[]; // 담당 역할 및 수행 내용
  pipeline: PipelineStep[]; // pipeline.log 레일
  tech: string[]; // 활용 기술 및 도구 (칩)
  results: string[]; // 프로젝트 결과
  evidence: EvidenceItem[]; // 관련 자료 (증빙 슬라이드)
};

export const deckMeta = {
  title: "AI Agent / Full-stack AX 포트폴리오",
  author: "이용학",
  thesis: "데이터 생성부터 배포까지 — AI 에이전트와 함께 풀스택을 완성합니다",
  path: "/portfolio/ax", // BASE_PATH 뒤에 붙는 경로
  bootLog: [
    { step: "init", note: "AI Agent / Full-stack AX" },
    { step: "load", note: "projects (3)" },
    { step: "render", note: "slides" },
    { step: "ready", note: "↓ 스크롤로 시작" },
  ],
};

export const axProjects: AxProject[] = [
  {
    code: "AX-01",
    slug: "datavoucher",
    name: "데이터바우처",
    title: "2025 데이터바우처 공급기업 수행",
    tagline: "수행 총괄 — 3개 수요기업 학습데이터 30,000건+ 수집·생성·가공·납품",
    role: "수행 총괄",
    works: [
      {
        lead: "영웅딸기",
        text: "딸기·노엽 RGB 10,000건 + 가로·세로·둘레·무게 정밀 계측 · Keypoint / Segmentation",
      },
      {
        lead: "씨오에프",
        text: "의류 10,000건 + 모델 착용 1,500건 · BBox / Segmentation / Landmark JSON",
      },
      {
        lead: "아비넨",
        text: "파프리카 10,000건 + 길이·둘레·무게 계측 데이터 · Keypoint",
      },
      {
        lead: "이미지 생성 모델(FLUX) 활용",
        text: "실촬영으로 닿지 않는 조명·배경·결함 조건을 프롬프트 조건화로 합성해 데이터 편중을 메움 — 생성 이미지도 동일 검수 기준으로 통과시켜 납품",
      },
    ],
    pipeline: [
      { step: "collect", note: "실촬영 수집" },
      { step: "generate", note: "FLUX 이미지 생성" },
      { step: "labelme", note: "시드 라벨링" },
      { step: "train", note: "YOLO 3태스크" },
      { step: "auto", note: "자동 라벨링" },
      { step: "deliver", note: "납품·검수" },
    ],
    tech: [
      "FLUX (이미지 생성 모델)",
      "Prompt Conditioning",
      "LabelMe",
      "Ultralytics YOLO",
      "PyTorch · CUDA",
      "COCO / YOLO 포맷",
    ],
    results: ["과제 3건 정상 완료", "전수 검수 결측치 0%"],
    evidence: [
      {
        kind: "image",
        src: "/images/ax/datavoucher/result2.png",
        alt: "딸기 자동 라벨링 결과 그리드",
        caption: "영웅딸기 — 딸기·노엽 자동 라벨링 (Detection · Segmentation)",
      },
      {
        kind: "image",
        src: "/images/ax/datavoucher/result3.png",
        alt: "의류 자동 라벨링 결과 그리드",
        caption: "씨오에프 — 의류 자동 라벨링 (BBox · Segmentation)",
      },
      {
        kind: "image",
        src: "/images/ax/datavoucher/result1.png",
        alt: "파프리카 자동 라벨링 결과 그리드",
        caption: "아비넨 — 파프리카 자동 라벨링 (BBox · Segmentation)",
      },
      {
        kind: "gallery",
        images: [
          { src: "/images/ax/datavoucher/estimate1.png", alt: "사업 견적서 1" },
          { src: "/images/ax/datavoucher/estimate2.png", alt: "사업 견적서 2" },
          { src: "/images/ax/datavoucher/estimate3.png", alt: "사업 견적서 3" },
          { src: "/images/ax/datavoucher/estimate4.png", alt: "사업 견적서 4" },
          { src: "/images/ax/datavoucher/estimate5.png", alt: "사업 견적서 5" },
          { src: "/images/ax/datavoucher/estimate6.png", alt: "사업 견적서 6" },
          { src: "/images/ax/datavoucher/estimate7.png", alt: "사업 견적서 7" },
          { src: "/images/ax/datavoucher/estimate8.png", alt: "사업 견적서 8" },
          { src: "/images/ax/datavoucher/estimate9.png", alt: "사업 견적서 9" },
        ],
        caption: "사업 견적서 9건 (클릭 시 확대)",
      },
    ],
  },
  {
    code: "AX-02",
    slug: "3d",
    name: "3D 역설계",
    title: "3D 데이터 활용 역설계 생성 AI 솔루션 개발",
    tagline: "개발 총괄 — AI바우처 공급기업, 포인트 클라우드 → CAD 복원 웹앱",
    role: "개발 총괄",
    works: [
      {
        lead: "AI Agent 주도 개발",
        text: "Claude Code로 백엔드·프론트 전 영역 설계·구현·리팩터링 · MCP(shadcn · Playwright · context7) 연동 AX 워크플로우",
      },
      {
        lead: "3D 역설계 파이프라인",
        text: "포인트 클라우드 세그멘테이션 → SIREN 자유곡면·프리미티브 피팅 → 위상 구성으로 CAD 복원 (point2cad)",
      },
      {
        lead: "백엔드·3D 처리",
        text: "FastAPI 비동기 변환 + JWT 인증 · Open3D 메시 생성 · pythonocc STEP(B-Rep) 변환 · Three.js 미리보기",
      },
    ],
    pipeline: [
      { step: "scan", note: "포인트 클라우드 입력" },
      { step: "segment", note: "파트 분할" },
      { step: "fit", note: "SIREN 곡면 피팅" },
      { step: "topo", note: "위상 구성 → CAD" },
      { step: "serve", note: "FastAPI 비동기 변환" },
      { step: "ship", note: "웹앱 · Docker 배포" },
    ],
    tech: [
      "Claude Code · MCP",
      "PyTorch · SIREN",
      "FastAPI · uv",
      "Open3D · pythonocc(STEP)",
      "Next.js 16 · React 19",
      "Three.js",
      "TailwindCSS · shadcn/ui",
      "Docker Compose",
    ],
    results: ["시험성적서 발급 (성능목표 3항목 적합)", "과제 정상 완료"],
    evidence: [
      {
        kind: "video",
        src: "/videos/ax-3d-demo.mp4",
        poster: "/images/ax/3d/poster.png",
        caption: "시연 영상 — 포인트 클라우드 업로드부터 CAD 복원까지",
      },
      {
        kind: "image",
        src: "/images/ax/3d/eval.png",
        alt: "AI 바우처 시험성적서",
        fit: "contain",
        caption: "AI 바우처 시험성적서 — Cloud 2 Cad, 성능목표 적합(임펠러·케이싱·샤프트)",
      },
      {
        kind: "note",
        title: "데모 웹 직접 사용해 보기",
        lines: ["http://203.252.147.199:4005", "ID admin · PW admin1234"],
      },
    ],
  },
  {
    code: "AX-03",
    slug: "sparta",
    name: "AI 쇼핑 어시스턴트",
    title: "스파르타전자 온라인몰 — 대화형 AI 쇼핑 어시스턴트",
    tagline: "기획·개발 단독 수행 — 필터 조작 대신 한 문장으로 끝나는 커머스 탐색",
    role: "기획·개발 단독 수행",
    works: [
      {
        lead: "Tool Calling 에이전트 루프",
        text: "모델이 필요하다고 판단할 때 스스로 search_products를 호출하고 결과를 컨텍스트에 되먹여 답변 — 챗봇 UI가 아니라 에이전트 루프가 서비스의 핵심 동작",
      },
      {
        lead: "환각 억제 · 신뢰 경계",
        text: "추천 전 반드시 실제 DB를 조회하게 설계하고, 스펙에 없으면 '확인 불가'로 답변. 모델이 반환한 도구 인자는 화이트리스트·타입 검증을 거쳐야 쿼리가 됨",
      },
      {
        lead: "루프 안정화",
        text: "도구 호출이 반복되면 답변 없이 폴백되던 문제를 마지막 회차에 도구를 제거하는 구조로 해결",
      },
      {
        lead: "풀스택 · 무중단 전환",
        text: "Next.js 16 웹과 Express 5 API를 분리 구축. Prisma 인트로스펙션으로 운영 스키마를 역으로 읽어 데이터 마이그레이션 없이 BaaS → 독립 API 서버 전환",
      },
    ],
    pipeline: [
      { step: "seed", note: "LLM 상품 40·리뷰 132" },
      { step: "schema", note: "Supabase · RLS" },
      { step: "api", note: "Express 5 · Prisma" },
      { step: "agent", note: "Tool Calling 루프" },
      { step: "test", note: "Vitest 42개" },
      { step: "ship", note: "Vercel push 배포" },
    ],
    tech: [
      "Anthropic API (claude-sonnet-5)",
      "Tool Calling 에이전트 루프",
      "Next.js 16 · React 19",
      "Express 5 · Prisma 6",
      "Supabase (PostgreSQL · RLS)",
      "Vitest",
      "Claude Code",
      "Vercel CI/CD",
    ],
    results: ["실서비스 배포 완료", "기획부터 배포까지 완주", "테스트 42개"],
    evidence: [
      {
        kind: "flow",
        title: "에이전트 한 턴 — 도구를 부르는 쪽은 모델이다",
        steps: [
          { actor: "user", text: '"20만원대 노이즈캔슬링 이어폰 추천해줘"' },
          { actor: "model", text: "search_products(category, priceMax, keyword, sort) 호출을 스스로 판단" },
          { actor: "guard", text: "도구 인자를 화이트리스트·타입 검증 후에만 쿼리로 변환" },
          { actor: "db", text: "Supabase에서 조건에 맞는 실제 상품을 조회" },
          { actor: "model", text: "조회 결과만 근거로 답변 — 마지막 회차엔 도구를 빼 반드시 답하게" },
        ],
        caption: "챗봇 UI가 아니라 이 루프가 서비스의 핵심 동작입니다",
      },
      {
        kind: "links",
        items: [
          {
            label: "서비스 (배포)",
            url: "https://sparta-online-shop.vercel.app",
            note: "카탈로그 → 상품 상세 → AI 대화 추천",
          },
          {
            label: "소스코드",
            url: "https://github.com/YongHakLee/sparta-project",
            note: "에이전트 루프 · 인자 검증 · Vitest 42개",
          },
        ],
        caption: "QR로 지금 열어서 직접 대화해 볼 수 있습니다",
      },
      {
        kind: "note",
        title: "다음 단계 — RAG 지식 에이전트",
        lines: [
          "하이브리드 검색 (BM25 + 벡터)",
          "→ RRF 융합 → LLM 재순위화",
          "평가셋 기반 Recall@5 · 환각률 측정",
          "* 상품·리뷰는 시연용 생성 데이터",
        ],
      },
    ],
  },
];

// 역량 맵: cells는 axProjects 순서와 1:1. 해당 계층을 다루지 않으면 null.
export type StackLayer = { layer: string; cells: (string | null)[] };

export const stackLayers: StackLayer[] = [
  {
    layer: "데이터 생성·수집",
    cells: [
      "이미지 생성 모델(FLUX) 합성 + 실촬영 30,000건",
      "3D 스캔 포인트 클라우드",
      "LLM 시드 생성 — 상품 40 · 리뷰 132",
    ],
  },
  {
    layer: "라벨링·가공",
    cells: ["LabelMe 시드 → YOLO 자동 라벨링", "세그멘테이션 전처리", "실존 상표 일괄 치환"],
  },
  {
    layer: "모델 학습·추론",
    cells: [
      "YOLO Detection · Seg · Pose",
      "SIREN 곡면 피팅 · point2cad",
      "Tool Calling 에이전트 루프",
    ],
  },
  {
    layer: "백엔드 · API",
    cells: [null, "FastAPI · JWT · 비동기 변환", "Express 5 · Prisma 인트로스펙션"],
  },
  {
    layer: "프론트엔드",
    cells: [null, "Next.js 16 · Three.js 미리보기", "Next.js 16 · shadcn/ui 채팅 UX"],
  },
  { layer: "배포 · 인프라", cells: [null, "Docker Compose", "Vercel 2개 프로젝트 · CI/CD"] },
  {
    layer: "AI Agent 워크플로우",
    cells: [
      "학습 모델 기반 Pseudo-labeling 자동화",
      "Claude Code + MCP 개발 주도",
      "브레인스토밍 → 스펙 → TDD 구현 파이프라인",
    ],
  },
];
