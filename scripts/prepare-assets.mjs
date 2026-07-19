// 원본 images/ 를 웹용으로 가공해 public/images/ 에 넣고,
// 강의 유튜브 썸네일을 내려받는다. (반복 실행해도 안전)
import sharp from "sharp";
import { copyFile, mkdir, stat } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";

const SRC = "images";
const DEST = "public/images";
const LECTURE_DEST = "public/images/lectures";

const PROJECT_IMAGES = [
  "project01_01.png", "project01_02.png",
  "project02_01.png", "project02_02.png",
  "project03_01.png", "project03_02.png",
  "project04_01.png", "project04_02.png",
];

// [저장 파일명, 유튜브 video ID]
const THUMBS = [
  ["python-01", "F3VAh_BqVzE"], ["python-02", "slKrDhcAwZo"],
  ["python-03", "HWvqV_pGNuY"], ["python-04", "TEetHwPZ2tA"],
  ["docker-01", "vWvbGnc_d4U"], ["docker-02", "tnk0lmEI1dE"],
  ["docker-03", "B0GzSC_P6bg"], ["docker-04", "N_zhBD2eyXI"],
  ["docker-05", "ZZ-9wMJ4pbQ"], ["docker-06", "m-HhPykBUH4"],
  ["docker-07", "-N6xAo-GuVg"], ["docker-08", "LelDbRgyc_E"],
];

await mkdir(LECTURE_DEST, { recursive: true });

for (const name of PROJECT_IMAGES) {
  const src = path.join(SRC, name);
  const out = path.join(DEST, name);
  await sharp(src)
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(out);
  // 재압축 결과가 원본보다 크면(이미 최적화된 PNG) 원본을 그대로 쓴다
  const [{ size: outSize }, { size: srcSize }] = [await stat(out), await stat(src)];
  if (outSize > srcSize) {
    await copyFile(src, out);
    console.log(`${name}: ${(srcSize / 1024).toFixed(0)}KB (원본 유지)`);
  } else {
    console.log(`${name}: ${(outSize / 1024).toFixed(0)}KB`);
  }
}

await sharp(path.join(SRC, "yonghaklee.jpg"))
  .resize({ width: 480, height: 480, fit: "inside" })
  .jpeg({ quality: 85 })
  .toFile(path.join(DEST, "yonghaklee.jpg"));
console.log("yonghaklee.jpg 완료");

for (const [name, id] of THUMBS) {
  const res = await fetch(`https://img.youtube.com/vi/${id}/hqdefault.jpg`);
  if (!res.ok) throw new Error(`썸네일 실패 ${id}: HTTP ${res.status}`);
  await pipeline(
    Readable.fromWeb(res.body),
    createWriteStream(path.join(LECTURE_DEST, `${name}.jpg`)),
  );
  console.log(`lectures/${name}.jpg 완료`);
}

// ── AX 덱 이미지: projects/ 원본 → public/images/ax/ 웹용 가공 ──
const AX_SETS = [
  {
    src: "projects/datavoucher",
    dest: "public/images/ax/datavoucher",
    files: [
      "result1.png", "result2.png", "result3.png",
      "estimate1.png", "estimate2.png", "estimate3.png",
      "estimate4.png", "estimate5.png", "estimate6.png",
      "estimate7.png", "estimate8.png", "estimate9.png",
    ],
  },
  {
    src: "projects/3D_reverse_engineering",
    dest: "public/images/ax/3d",
    files: ["eval.png"],
  },
];

for (const set of AX_SETS) {
  await mkdir(set.dest, { recursive: true });
  for (const name of set.files) {
    const src = path.join(set.src, name);
    const out = path.join(set.dest, name);
    await sharp(src)
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(out);
    const [{ size: outSize }, { size: srcSize }] = [await stat(out), await stat(src)];
    if (outSize > srcSize) {
      await copyFile(src, out);
      console.log(`ax/${name}: ${(srcSize / 1024).toFixed(0)}KB (원본 유지)`);
    } else {
      console.log(`ax/${name}: ${(outSize / 1024).toFixed(0)}KB`);
    }
  }
}

console.log("DONE");
