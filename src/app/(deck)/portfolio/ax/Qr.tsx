import QRCode from "qrcode";

/* 빌드 시점에 QR을 SVG로 생성해 인라인한다 — 클라이언트 JS·외부 요청 없음 */
export function qrSvg(text: string) {
  return QRCode.toString(text, {
    type: "svg",
    margin: 0,
    color: { dark: "#262019", light: "#ffffff00" },
  });
}

export default async function Qr({ text, className }: { text: string; className?: string }) {
  const svg = await qrSvg(text);
  return (
    <span
      className={`ax-qr ${className ?? ""}`}
      role="img"
      aria-label={`QR 코드: ${text}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
