// AX 포트폴리오 덱 데이터. 프로젝트를 추가하면 개요+증빙 슬라이드 2장이 자동으로 늘어난다.
// (stackLayers의 cells 배열도 프로젝트 순서에 맞춰 한 칸씩 추가할 것)

export type PipelineStep = { step: string; note: string };
export type WorkItem = { lead: string; text: string };

export type EvidenceItem =
  | { kind: "image"; src: string; alt: string; caption: string }
  | { kind: "gallery"; images: { src: string; alt: string }[]; caption: string }
  | { kind: "video"; src: string; poster: string; caption: string }
  | { kind: "note"; title: string; lines: string[] };

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
    { step: "init", note: "AX portfolio" },
    { step: "load", note: "projects (2)" },
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
    ],
    pipeline: [
      { step: "collect", note: "실촬영 수집" },
      { step: "flux", note: "합성 생성" },
      { step: "labelme", note: "시드 라벨링" },
      { step: "train", note: "YOLO 3태스크" },
      { step: "auto", note: "자동 라벨링" },
      { step: "deliver", note: "납품·검수" },
    ],
    tech: [
      "FLUX",
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
        caption: "AI 바우처 시험성적서 — Cloud 2 Cad, 성능목표 적합(임펠러·케이싱·샤프트)",
      },
      {
        kind: "note",
        title: "데모 웹 직접 사용해 보기",
        lines: ["http://203.252.147.199:4005", "ID admin · PW admin1234"],
      },
    ],
  },
];

// 역량 맵: cells는 axProjects 순서와 1:1. 해당 계층을 다루지 않으면 null.
export type StackLayer = { layer: string; cells: (string | null)[] };

export const stackLayers: StackLayer[] = [
  {
    layer: "데이터 생성·수집",
    cells: ["FLUX 합성 + 실촬영 30,000건", "3D 스캔 포인트 클라우드"],
  },
  {
    layer: "라벨링·가공",
    cells: ["LabelMe 시드 → YOLO 자동 라벨링", "세그멘테이션 전처리"],
  },
  {
    layer: "모델 학습·추론",
    cells: ["YOLO Detection · Seg · Pose", "SIREN 곡면 피팅 · point2cad"],
  },
  { layer: "백엔드 · API", cells: [null, "FastAPI · JWT · 비동기 변환"] },
  { layer: "프론트엔드", cells: [null, "Next.js 16 · Three.js 미리보기"] },
  { layer: "배포 · 인프라", cells: [null, "Docker Compose"] },
  {
    layer: "AI Agent 워크플로우",
    cells: ["학습 모델 기반 Pseudo-labeling 자동화", "Claude Code + MCP 개발 주도"],
  },
];
