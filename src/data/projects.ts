export interface ProjectPoint {
  lead: string;
  text: string;
}

export interface Project {
  no: string;
  title: string;
  period: string;
  role: string;
  tech: string[];
  problems: ProjectPoint[];
  solutions: ProjectPoint[];
  images: { src: string; alt: string }[];
}

export const projects: Project[] = [
  {
    no: "01",
    title:
      "모바일 LiDAR와 딥러닝 기반의 키포인트 탐지를 이용한 다중 스케일 객체 3차원 계측 및 속성 추정 프레임워크",
    period: "2023.01 – 2026.06",
    role: "데이터 수집 및 전처리 · 모델 학습 및 평가 · 모델 고도화 · 논문 작성",
    tech: ["Mobile LiDAR", "3D Point Cloud", "Python", "PyTorch", "HRNet", "YOLO"],
    problems: [
      { lead: "2D 비전 한계", text: "단순 이미지는 거리 정보가 없어 실제 크기 측정 시 별도 참조물이 필요함" },
      { lead: "환경 통제 제약", text: "기존 방식은 카메라 거리, 조명, 배경 등을 엄격히 통제해야 해 실용성이 낮음" },
      { lead: "수동 측정 비효율", text: "줄자나 저울을 이용한 수동 측정은 시간이 오래 걸리고 인적 오차가 발생함" },
      { lead: "기존 3D 모델 한계", text: "고성능 장비가 필요하거나 연산이 느려 모바일 실시간 적용이 어려움" },
      { lead: "객체 형태 복잡성", text: "의류 주름, 딸기 모양, 다양한 인체 포즈 등을 단순 알고리즘으로 측정하기 난해함" },
      { lead: "깊이 정보 불일치", text: "2D 이미지의 키포인트가 실제 3D 공간의 경계와 일치하지 않아 오차 발생" },
    ],
    solutions: [
      { lead: "2D–3D 좌표 매핑", text: "딥러닝 키포인트와 LiDAR 거리 정보를 결합해 참조물 없이 정밀 측정 구현" },
      { lead: "키포인트 보정 기술", text: "깊이 맵의 경계선(Edge)을 활용해 키포인트를 실제 객체 외곽으로 보정, 정밀도 향상" },
      { lead: "높은 측정 정확도", text: "의류(오차 ~2%), 딸기(오차 ~4–5%), 신체(주요 부위 오차 <4%) 모두 높은 정확도 달성" },
      { lead: "속성 예측 모델", text: "길이 데이터를 기반으로 딸기 무게(오차 ~10%)와 신체 둘레를 정밀 추정하는 회귀식 개발" },
      { lead: "환경 강건성 확보", text: "배경, 조명, 객체 회전이나 구겨짐 등 다양한 환경 변수에도 일관된 성능 입증" },
      { lead: "모바일 실시간 처리", text: "복잡한 3D 복원 없이 빠른 연산으로 모바일 기기에서 실시간 측정 구현" },
    ],
    images: [
      { src: "/images/project04_01.png", alt: "모바일 LiDAR 계측 파이프라인" },
      { src: "/images/project04_02.png", alt: "다중 스케일 객체 측정 결과" },
    ],
  },
  {
    no: "02",
    title: "로봇 센서 데이터 분석을 통한 가스배관 변화구간 및 길이 탐지 솔루션 개발",
    period: "2022.01 – 2023.01",
    role: "데이터 전처리 · 파생변수 생성 · 모델 학습 및 평가 · 모델 고도화 · 패키징",
    tech: ["Python", "Random Forest", "LightGBM", "YOLO", "Sensor Data"],
    problems: [
      { lead: "자동화의 한계", text: "센서 데이터만으로 WELD(접합부), BEND(만곡부) 구간 탐지를 자동화하기 어려움" },
      { lead: "MLP 성능 한계", text: "입력 크기 고정 제약으로 인해 정확도가 0.18~0.34로 저조함" },
      { lead: "이상 구간의 모호성", text: "비정상 구간과 유사한 패턴이 많아 오탐 발생" },
      { lead: "데이터 불균형", text: "특징 구간보다 일반 구간이 압도적으로 많아 학습이 어려움" },
    ],
    solutions: [
      { lead: "트리 모델 + 파생 변수", text: "MLP 대신 Random Forest로 전환하고 분산, 최대–최소 차이, 행 간 차이 등 7~14개 파생 변수를 생성해 학습" },
      { lead: "예측 정확도 향상", text: "파생 변수를 적용한 Random Forest로 접합부 예측 정확도를 약 0.87까지 향상, 연속 예측을 후처리로 보정" },
      { lead: "만곡부 고성능 달성", text: "접합부 사이 구간을 만곡부 후보로 정의하고 LightGBM을 적용해 정확도 0.98 달성" },
    ],
    images: [
      { src: "/images/project03_01.png", alt: "가스배관 센서 데이터 분석" },
      { src: "/images/project03_02.png", alt: "변화구간 탐지 결과" },
    ],
  },
  {
    no: "03",
    title: "상품 추천을 위한 시각 이미지와 메타데이터 통합 분석 방법론 개발",
    period: "2021.01 – 2022.01",
    role: "데이터 수집 및 전처리 · 모델 학습 및 평가 · 모델 고도화 · 논문 작성",
    tech: ["Python", "PyTorch", "MobileNetV3", "Sentence-BERT", "Amazon Fashion Meta-data"],
    problems: [
      { lead: "단일 데이터의 한계", text: "이미지나 텍스트 중 하나만 사용하면 예측 정확도 확보가 어려움" },
      { lead: "모바일 연산 제약", text: "기존 심층 CNN 모델은 모바일 기기에서 구동하기에 연산 부담이 큼" },
      { lead: "다국어 처리 문제", text: "영어와 한국어가 혼합된 메타데이터에서 효과적인 특징 추출이 필요함" },
      { lead: "선호도 파악 난해", text: "단순 필터링으로는 고객의 숨겨진 선호 패턴을 분석하기 어려움" },
    ],
    solutions: [
      { lead: "통합 분석 모델 구축", text: "이미지와 텍스트 특징을 결합(Concatenate)해 상품 관계 예측 모델 개발" },
      { lead: "효율적 이미지 처리", text: "MobileNetV3로 적은 연산량으로 이미지 특징 추출" },
      { lead: "다국어 성능 입증", text: "한/영 혼합 데이터에서도 언어별 모델 분리 시 80% 이상의 정확도 확보" },
      { lead: "추천 시스템 가능성", text: "상품 간 관계 학습을 통해 사용자 맞춤형 추천 시스템 구현 가능성 확인" },
    ],
    images: [
      { src: "/images/project02_01.png", alt: "이미지·메타데이터 통합 분석 구조" },
      { src: "/images/project02_02.png", alt: "상품 관계 예측 결과" },
    ],
  },
  {
    no: "04",
    title: "분할영상자료를 통한 미세먼지 측정 솔루션 개발",
    period: "2020.01 – 2021.01",
    role: "데이터 수집 및 전처리 · 모델 학습 및 평가 · 모델 고도화",
    tech: ["Raspberry Pi", "Python", "OpenCV"],
    problems: [
      { lead: "고비용·관측 사각지대", text: "국가 측정망은 정확하나 설치·유지비가 비싸고 공간 제약으로 사각지대가 발생" },
      { lead: "보급형 센서의 한계", text: "저가형 광산란 센서는 넓은 범위 커버에 유지관리 비용이 크고 신뢰성 확보가 어려움" },
      { lead: "기존 영상 기술의 한계", text: "단일 이미지만 분석해 시공간 정보를 활용하지 못하고 움직임에 취약함" },
      { lead: "낮은 연산 효율성", text: "심층 신경망 모델은 파라미터가 많아 연산 비용이 높고 비효율적임" },
    ],
    solutions: [
      { lead: "시계열 딥러닝 적용", text: "연속 영상 프레임(Temporal Prior)으로 미세먼지의 흐름과 변동성을 포착하는 모델 개발" },
      { lead: "차분 연산·통계 분석", text: "프레임 간 광도 변화를 수치화하고 이동평균, PLS-DA 등 통계량으로 농도 예측" },
      { lead: "저비용 실시간 시스템", text: "라즈베리 파이로 비용을 낮추고 15초 이내 분석 가능한 실시간 솔루션 구현" },
      { lead: "높은 정확도 달성", text: "실내 약 86%, 실외 약 82% 정확도와 오차 범위 25% 이내 성능 확보" },
    ],
    images: [
      { src: "/images/project01_01.png", alt: "영상 기반 미세먼지 측정 시스템" },
      { src: "/images/project01_02.png", alt: "농도 예측 결과" },
    ],
  },
];
