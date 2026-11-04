// Dựng HTML tĩnh cho từng trang lúc build (xem scripts/prerender.mjs)
import { renderToString } from "react-dom/server";
import { Page } from "./router";
import { PAGES, renderHead } from "./seo";

export { PAGES };
export { SITE_URL } from "./data/siteInfo";

export function render(path: string) {
  const meta = PAGES.find((p) => p.path === path);
  if (!meta) throw new Error(`Không có thông tin SEO cho trang ${path}`);
  return { html: renderToString(<Page path={path} />), head: renderHead(meta) };
}
