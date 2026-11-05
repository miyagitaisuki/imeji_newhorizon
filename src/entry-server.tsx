// Dựng HTML tĩnh cho từng trang lúc build (xem scripts/prerender.mjs)
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { Page } from "./router";
import { PAGES, renderHead } from "./seo";
import { PostFooter, PostHeader } from "./components/PostChrome";

export { PAGES };
export { SITE_URL } from "./data/siteInfo";
export { GA_ID, META_PIXEL_ID } from "./lib/analytics";

export function render(path: string) {
  const meta = PAGES.find((p) => p.path === path);
  if (!meta) throw new Error(`Không có thông tin SEO cho trang ${path}`);
  return { html: renderToString(<Page path={path} />), head: renderHead(meta) };
}

/** Header (logo + thanh chuyển 3 app) và chân trang gắn vào mỗi bài viết tĩnh */
export function renderPostChrome() {
  return { header: renderToStaticMarkup(<PostHeader />), footer: renderToStaticMarkup(<PostFooter />) };
}
