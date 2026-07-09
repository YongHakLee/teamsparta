export interface Lecture {
  no: string;
  title: string;
  videoId: string;
  thumb: string;
}

export interface LectureSeries {
  id: string;
  title: string;
  count: number;
  audience: string;
  design: string;
  playlistUrl: string;
  lectures: Lecture[];
}

export const lectureSeries: LectureSeries[] = [
  {
    id: "python-basics",
    title: "파이썬 기초 강의",
    count: 4,
    audience: "프로그래밍을 처음 시작하는 데이터 분석 입문자",
    design:
      "환경 설치(아나콘다) → 수치 계산(넘파이) → 표 데이터(판다스) → 코드 구조화(클래스) 순서로, 데이터 분석을 시작하는 데 필요한 최소한의 파이썬을 4편에 담았습니다. 문법 백과사전이 아니라 바로 데이터를 만져보게 하는 최단 경로로 설계했습니다.",
    playlistUrl: "https://www.youtube.com/playlist?list=PLInXakK5867zo1CYn785MZ7f_Y-nEq6Eh",
    lectures: [
      { no: "01", title: "아나콘다를 이용한 파이썬 설치", videoId: "F3VAh_BqVzE", thumb: "/images/lectures/python-01.jpg" },
      { no: "02", title: "넘파이 패키지의 기본 활용법", videoId: "slKrDhcAwZo", thumb: "/images/lectures/python-02.jpg" },
      { no: "03", title: "판다스 패키지의 기본 활용법", videoId: "HWvqV_pGNuY", thumb: "/images/lectures/python-03.jpg" },
      { no: "04", title: "클래스의 정의와 기본 활용법", videoId: "TEetHwPZ2tA", thumb: "/images/lectures/python-04.jpg" },
    ],
  },
  {
    id: "docker-deep-learning",
    title: "도커로 딥러닝 따라하기",
    count: 8,
    audience: "딥러닝을 실습해보고 싶지만 환경 설정에서 막히는 학습자",
    design:
      "딥러닝 학습의 가장 큰 진입장벽인 환경 구축을 도커로 표준화한 뒤(1–4편), 같은 환경 위에서 사물 인식(YOLOv5) · 경계 인식(YOLACT) · 얼굴 인식(FaceNet) · 자세 추정(simple-HRNet)을 직접 돌려봅니다(5–8편). “내 컴퓨터에서는 안 되는데”를 없애는 재현 가능한 실습 커리큘럼입니다.",
    playlistUrl: "https://www.youtube.com/playlist?list=PLInXakK5867zsDKk1ts8hOmY40FaBlOBo",
    lectures: [
      { no: "01", title: "도커 설치하기", videoId: "vWvbGnc_d4U", thumb: "/images/lectures/docker-01.jpg" },
      { no: "02", title: "도커 간단 사용법", videoId: "tnk0lmEI1dE", thumb: "/images/lectures/docker-02.jpg" },
      { no: "03", title: "파이썬과 아나콘다 그리고 딥러닝", videoId: "B0GzSC_P6bg", thumb: "/images/lectures/docker-03.jpg" },
      { no: "04", title: "도커를 활용한 딥러닝 모델 프로그래밍 환경구축", videoId: "N_zhBD2eyXI", thumb: "/images/lectures/docker-04.jpg" },
      { no: "05", title: "사물인식모델(YOLOv5)로 버스, 사람, 넥타이 찾기", videoId: "ZZ-9wMJ4pbQ", thumb: "/images/lectures/docker-05.jpg" },
      { no: "06", title: "사물경계인식모델(YOLACT)로 사람, 테니스 라켓 찾고 구분하기", videoId: "m-HhPykBUH4", thumb: "/images/lectures/docker-06.jpg" },
      { no: "07", title: "얼굴인식모델(FaceNet)로 사람 얼굴 찾기", videoId: "-N6xAo-GuVg", thumb: "/images/lectures/docker-07.jpg" },
      { no: "08", title: "자세추정모델(simple-HRNet)로 사람의 포즈 구현하기", videoId: "LelDbRgyc_E", thumb: "/images/lectures/docker-08.jpg" },
    ],
  },
];

export const videoUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
