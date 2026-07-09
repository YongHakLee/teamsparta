export interface Publication {
  title: string;
  venue: string;
  year: string;
  authors: string;
  role?: string;
  summary: string;
}

// 연도 역순. authors 문자열 안의 "Lee Y." 은 렌더링 시 강조 처리한다.
export const publications: Publication[] = [
  {
    title: "A Two-Stage Diffusion Pipeline for Consistent Front-Back Clothing Generation",
    venue: "Quantitative Bio-Science",
    year: "2025",
    authors: "Hwang M., Jeong Y., Kim S., Noh T., Jeong S., Jeong H. and Lee Y.*",
    role: "교신저자",
    summary:
      "확산 모델(Diffusion Model)을 2단계로 적용해 의상의 앞면과 뒷면 디자인이 서로 일관성을 유지하도록 생성하는 기술을 제안한 연구.",
  },
  {
    title: "A Mobile LiDAR-Based Deep Learning Approach for Real-Time 3D Body Measurement",
    venue: "Applied Sciences",
    year: "2025",
    authors: "Jeong Y., Noh T., Lee Y., Lee S., Choi K., Jeong S. and Kim S.",
    summary:
      "모바일 기기에 내장된 LiDAR 센서와 딥러닝을 결합해 실시간으로 인체의 3D 치수를 정밀하게 측정하는 방법론.",
  },
  {
    title: "Automated Technology for Strawberry Size Measurement and Weight Prediction Using AI",
    venue: "IEEE Access",
    year: "2024",
    authors: "Jeong H., Moon H., Jeong Y., Kwon H., Kim C., Lee Y., Yang S. and Kim S.",
    summary:
      "컴퓨터 비전으로 딸기 영상을 분석해 크기를 자동 측정하고 무게를 예측함으로써 농산물 분류와 스마트팜 자동화에 기여하는 기술.",
  },
  {
    title:
      "A Multi-View Integrated Ensemble for the Background Discrimination of Semi-Supervised Semantic Segmentation",
    venue: "Applied Sciences",
    year: "2023",
    authors: "Gwak H., Jeong Y., Kim C., Lee Y., Yang S. and Kim S.",
    summary:
      "다양한 시점의 정보를 결합한 앙상블 기법으로 준지도 영상 분할에서 객체와 배경의 구분 정확도를 향상시킨 연구.",
  },
  {
    title: "Dental Image Data Generation for Instance Segmentation using Generative Adversarial Networks",
    venue: "Quantitative Bio-Science",
    year: "2023",
    authors: "Heo S., Jung S., Kwak H., Jeong Y., Yang S., Lee Y., and Kim S.",
    summary:
      "데이터 확보가 어려운 치과 의료 영상 분야에서 GAN으로 학습 데이터를 생성(증강)해 인스턴스 분할 모델의 성능을 높인 연구.",
  },
  {
    title: "Integrated Analytic Methodology Using Visual Image and Meta-Data for Product Recommendation",
    venue: "Quantitative Bio-Science",
    year: "2022",
    authors: "Lee Y., Oh J., Yang S. and Kim S.",
    role: "제1저자",
    summary:
      "제품의 시각 이미지와 텍스트 메타데이터를 통합 분석해 추천 시스템의 정확도와 사용자 만족도를 높이는 방법론.",
  },
  {
    title: "Automatic Measurements of Garment Sizes Using Computer Vision Deep Learning Models and Point Cloud Data",
    venue: "Applied Sciences",
    year: "2022",
    authors: "Kim S., Moon H., Oh J., Lee Y., Kwon H. and Kim S.",
    summary:
      "3D 포인트 클라우드와 딥러닝 비전 모델을 활용해 사람의 개입 없이 의류 각 부위 치수를 자동 측정하는 시스템 연구.",
  },
  {
    title: "Reinforcement Learning Guided by Double Replay Memory",
    venue: "Journal of Sensors",
    year: "2020",
    authors: "Han J., Jo K., Lim W., Lee Y., Ko K., Sim E., Cho J. and Kim S.",
    summary:
      "이중 재생 메모리(Double Replay Memory) 구조를 도입해 강화학습의 학습 효율성과 안정성을 개선한 연구.",
  },
  {
    title: "Estimation of Particulate Levels Using Deep Dehazing Network and Temporal Prior",
    venue: "Journal of Sensors",
    year: "2020",
    authors: "Jung S., Yang S., Lee E., Lee Y., Ko J., Lee S., Cho J., Lee J. and Kim S.",
    summary:
      "안개 제거 딥러닝 네트워크(Dehazing)와 시간적 변화 정보를 활용해 대기 중 미세먼지 농도를 추정하는 기술.",
  },
];

export interface Patent {
  title: string;
  titleEn: string;
  applied: string;
  registered: string;
  inventors: string;
}

export const patents: Patent[] = [
  {
    title: "2D 및 3D 데이터 융합 기반의 신체 둘레 측정 방법 및 장치",
    titleEn: "METHOD AND DEVICE FOR BODY CIRCUMFERENCE MEASUREMENT BASED ON 2D AND 3D DATA FUSION",
    applied: "출원 10-2024-0099646 (2024.07.26)",
    registered: "등록 10-2821984-0000 (2025.06.13)",
    inventors: "김성환, 이용학, 김장환",
  },
];

export interface RndItem {
  period: string;
  title: string;
}

export const rndProjects: RndItem[] = [
  { period: "2023.09 – 2024.07", title: "온라인 중고 거래 활성화를 위한 옷 치수 자동 측정 솔루션 고도화" },
  { period: "2019.12 – 2021.01", title: "딥러닝 기술과 이미지 프로세싱 기술을 활용한 미세먼지 측정기술 개발" },
];
