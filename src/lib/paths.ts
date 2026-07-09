// GitHub Pages가 사이트를 /teamsparta 하위 경로에 서비스하므로,
// public/ 정적 자산을 참조할 때는 반드시 asset()을 거친다.
// (next/link, next/font는 basePath를 자동 처리하지만 <img src>는 아니다)
export const BASE_PATH = "/teamsparta";

export const asset = (path: string) => `${BASE_PATH}${path}`;
