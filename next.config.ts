import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/paths";

const nextConfig: NextConfig = {
  // 서버 없이 동작하는 정적 사이트로 빌드 (결과물이 out/ 폴더에 생성됨)
  output: "export",

  // 사이트가 https://yonghaklee.github.io/teamsparta/ 에 배포되므로
  // 모든 경로 앞에 /teamsparta 를 붙임 (src/lib/paths.ts와 단일 소스)
  basePath: BASE_PATH,

  // next/image의 이미지 최적화는 서버가 필요하므로 끔
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
