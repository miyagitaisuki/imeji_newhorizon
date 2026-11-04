import { Gamepad2, House, LogIn } from "lucide-react";
import { PORTAL_URL, PRACTICE_URL } from "../data/siteInfo";
import { trackEcosystem } from "../lib/analytics";

// Thanh chuyển 3 app (Trang chủ · Luyện tập · Học viên), cùng markup và kiểu dáng (.imeji-switch trong
// src/styles/imeji-brand.css) với trang luyện tập (imeji_dominion) và cổng học viên (eduscan).
// Ở website nên mục "Trang chủ" luôn là mục đang chọn.
export const EcosystemSwitch: React.FC<{ onDark?: boolean; location: string }> = ({ onDark = false, location }) => (
  <nav className={`imeji-switch${onDark ? " imeji-switch--on-dark" : ""}`} aria-label="IMEJI日本語教室">
    <a className="imeji-switch__item" href="/" aria-current="page" title="Trang chủ">
      <House aria-hidden="true" />
      <span className="imeji-switch__label">Trang chủ</span>
    </a>
    <a className="imeji-switch__item" href={PRACTICE_URL} title="Luyện tập" onClick={() => trackEcosystem("practice", location)}>
      <Gamepad2 aria-hidden="true" />
      <span className="imeji-switch__label">Luyện tập</span>
    </a>
    <a className="imeji-switch__item" href={PORTAL_URL} title="Học viên" onClick={() => trackEcosystem("portal", location)}>
      <LogIn aria-hidden="true" />
      <span className="imeji-switch__label">Học viên</span>
    </a>
  </nav>
);
