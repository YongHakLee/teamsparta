"use client";

export type DeckState = { cur: number; step: number };

const CHANNEL = "lecture-deck";
const LS_KEY = "lecture-deck-state";

/* 두 창(덱 ↔ 발표자) 사이 현재 슬라이드/단계를 양방향 동기화.
   BroadcastChannel 미지원 시 localStorage storage 이벤트로 폴백. */
export function createDeckChannel(onRemote: (s: DeckState) => void) {
  let bc: BroadcastChannel | null = null;
  const hasBC = typeof BroadcastChannel !== "undefined";

  if (hasBC) {
    bc = new BroadcastChannel(CHANNEL);
    bc.onmessage = (e) => onRemote(e.data as DeckState);
  }

  const onStorage = (e: StorageEvent) => {
    if (e.key === LS_KEY && e.newValue) onRemote(JSON.parse(e.newValue) as DeckState);
  };
  if (!hasBC && typeof window !== "undefined") window.addEventListener("storage", onStorage);

  return {
    post(s: DeckState) {
      if (bc) bc.postMessage(s);
      else if (typeof localStorage !== "undefined") localStorage.setItem(LS_KEY, JSON.stringify(s));
    },
    close() {
      if (bc) bc.close();
      else if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
    },
  };
}

/* 암호 평문을 SHA-256 HEX(소문자)로. Web Crypto는 https/localhost에서만 가능(둘 다 배포 환경 충족). */
export async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
