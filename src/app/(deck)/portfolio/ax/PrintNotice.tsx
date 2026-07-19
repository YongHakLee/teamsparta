import Qr from "./Qr";
import { BASE_PATH, SITE_ORIGIN } from "@/lib/paths";
import { deckMeta } from "@/data/ax";

/* PDF 첫 페이지 전용 안내장. 화면에서는 보이지 않는다(ax-print-only) */
export default function PrintNotice() {
  const url = `${SITE_ORIGIN}${BASE_PATH}${deckMeta.path}`;
  return (
    <section className="ax-viewport ax-print-only ax-notice">
      <div className="ax-slide ax-center">
        <p className="ax-ebrow ax-mono" style={{ justifyContent: "center" }}>NOTICE</p>
        <p className="ax-title">이 문서는 웹에서 보시길 권장합니다</p>
        <ul className="ax-notice-why ax-mut">
          <li>시연 영상을 바로 재생할 수 있습니다</li>
          <li>견적서·결과 이미지를 원본 크기로 확대할 수 있습니다</li>
          <li>항상 최신본이 유지됩니다</li>
        </ul>
        <Qr text={url} className="ax-qr-lg" />
        <p className="ax-tagline ax-mono">{url}</p>
      </div>
    </section>
  );
}
