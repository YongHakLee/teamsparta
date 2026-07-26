import type { NextConfig } from "next";

// 루트 앱과 달리 서버에서 동작한다(Vercel). 정적 export를 쓰지 않으므로
// Route Handler를 자유롭게 둘 수 있고, basePath도 필요 없다.
const nextConfig: NextConfig = {};

export default nextConfig;
