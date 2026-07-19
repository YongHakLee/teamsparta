// GitHub Pages가 사이트를 /teamsparta 하위 경로에 서비스하므로,
// public/ 정적 자산을 참조할 때는 반드시 asset()을 거친다.
// (next/link, next/font는 basePath를 자동 처리하지만 <img src>는 아니다)
export const BASE_PATH = "/teamsparta";

export const asset = (path: string) => `${BASE_PATH}${path}`;

// 배포 원본 주소. QR·절대 URL 표기는 SITE_ORIGIN + BASE_PATH + 경로로 만든다.
export const SITE_ORIGIN = "https://yonghaklee.github.io";
