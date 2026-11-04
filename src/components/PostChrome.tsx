// Header và chân trang cho bài viết (public/posts/*.html). Không chạy trên trình duyệt:
// scripts/prerender.mjs dựng thành HTML tĩnh rồi gắn vào từng bài lúc build. Kiểu dáng: public/assets/brand/post.css.
import { EcosystemSwitch } from "./EcosystemSwitch";
import { ADDRESS_FULL, BUILD_YEAR, EMAIL, PHONE, PHONE_DISPLAY, PORTAL_URL, PRACTICE_URL, ZALO_URL } from "../data/siteInfo";

export const PostHeader: React.FC = () => (
  <header className="post-header">
    <div className="post-header__inner">
      <a className="post-brand" href="/">
        <img src="/assets/brand/logo.png" alt="Logo IMEJI日本語教室" width={36} height={36} />
        <span>
          <strong>IMEJI日本語教室</strong>
          <small>Lớp học tiếng Nhật thầy Quang</small>
        </span>
      </a>
      <EcosystemSwitch location="post" />
    </div>
  </header>
);

export const PostFooter: React.FC = () => (
  <footer className="post-footer">
    <div className="post-footer__inner">
      <p>
        <strong>IMEJI日本語教室</strong> ・ Lớp học tiếng Nhật thầy Quang ・ ThS. Nguyễn Thanh Quang
      </p>
      <p>{ADDRESS_FULL}</p>
      <p>
        <a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a> ・{" "}
        <a href={ZALO_URL} target="_blank" rel="noreferrer">Zalo</a> ・ <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </p>
      <p>
        <a href="/">Trang chủ</a> ・ <a href={PRACTICE_URL}>Luyện tập Minna (miễn phí)</a> ・ <a href={PORTAL_URL}>Cổng học viên</a> ・{" "}
        <a href="/posts/">Bài viết</a> ・ <a href="/#register">Đăng ký học thử miễn phí</a>
      </p>
      <p>© {BUILD_YEAR} IMEJI日本語教室. All rights reserved.</p>
    </div>
  </footer>
);
