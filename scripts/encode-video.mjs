// projects/의 시연 영상(77MB)을 웹용 720p H.264로 재인코딩하고 포스터 컷을 추출한다.
// 사용법: node scripts/encode-video.mjs  (반복 실행해도 안전)
import ffmpeg from "ffmpeg-static";
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const IN = "projects/3D_reverse_engineering/movie2.mp4";
const OUT = "public/videos/ax-3d-demo.mp4";
const POSTER = "public/images/ax/3d/poster.png";

mkdirSync("public/videos", { recursive: true });
mkdirSync("public/images/ax/3d", { recursive: true });

const encode = spawnSync(
  ffmpeg,
  [
    "-y", "-i", IN,
    "-vf", "scale=-2:720",
    "-c:v", "libx264", "-crf", "26", "-preset", "slow",
    "-movflags", "+faststart",
    "-c:a", "aac", "-b:a", "96k", // 음성 트랙이 없으면 무시된다
    OUT,
  ],
  { stdio: "inherit" },
);
if (encode.status !== 0) process.exit(encode.status ?? 1);

const poster = spawnSync(
  ffmpeg,
  ["-y", "-ss", "3", "-i", OUT, "-frames:v", "1", POSTER],
  { stdio: "inherit" },
);
process.exit(poster.status ?? 0);
