// Bước cuối của build: tạo HTML dựng sẵn cho từng trang, dựng trang bài viết từ content/posts/*.md, sinh sitemap.xml.
// Chạy sau `vite build` và `vite build --ssr src/entry-server.tsx --outDir dist-ssr`.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { marked } from "marked";
import { loadPosts, CATEGORIES } from "./posts-lib.mjs";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const ssrEntry = fs.readdirSync(ssrDir).find((f) => /^entry-server\.(m?js)$/.test(f));
const { render, PAGES, SITE_URL } = await import(pathToFileURL(path.join(ssrDir, ssrEntry)).href);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf-8");
const HEAD_RE = /<!--head:start-->[\s\S]*?<!--head:end-->/;

// ---------- 1. Các trang React ----------
for (const page of PAGES) {
  const { html, head } = render(page.path);
  const out = template.replace(HEAD_RE, head).replace("<!--app-html-->", html);
  const file = path.join(dist, page.path, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, out);
  console.log(`Đã dựng sẵn: ${page.path}`);
}

// ---------- 2. Bài viết (content/posts/*.md → dist/posts/<slug>.html) ----------
const posts = loadPosts();
const published = posts.filter((p) => p.publish);
const POST_CSS = fs.readFileSync(path.join(root, "public/assets/post.css"), "utf-8");
const COURSE_LINKS = {
  n5: { href: "/khoa-hoc/n5/", label: "Khóa tiếng Nhật N5 cho người mới bắt đầu tại Quy Nhơn" },
  n4: { href: "/khoa-hoc/n4/", label: "Khóa tiếng Nhật N4 – luyện thi JLPT N4 tại Quy Nhơn" },
  n3: { href: "/khoa-hoc/n3/", label: "Khóa luyện thi JLPT N3 tại Quy Nhơn" },
};
const AUTHOR = "ThS. Nguyễn Thanh Quang";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
const vnDate = (iso) => iso.split("-").reverse().join("/");

// Tiêu đề: chỉ thêm đuôi ngắn " | Thầy Quang" khi tổng độ dài vẫn trong 60 ký tự (Google không cắt).
const TITLE_MAX = 60;
const TITLE_SUFFIX = " | Thầy Quang";
const shortTitle = (t) => ([...t].length + [...TITLE_SUFFIX].length <= TITLE_MAX ? t + TITLE_SUFFIX : t);

// Ảnh trong bài: tải chậm (lazy) để trang mở nhanh
marked.use({
  renderer: {
    image({ href, title, text }) {
      return `<img src="${esc(href)}" alt="${esc(text)}"${title ? ` title="${esc(title)}"` : ""} loading="lazy" decoding="async">`;
    },
  },
});

// Khối ghi chú lưu dạng một khối liền (để trang quản trị nhận ra):
//   <div class="note">\nnội dung Markdown\n<br>\nđoạn tiếp\n</div>
// Khi dựng trang, tách nội dung ra để Markdown bên trong (in đậm, liên kết…) được xử lý.
function expandNotes(md) {
  return md.replace(/^<div class="note">\n([\s\S]*?)\n<\/div>$/gm, (_, inner) =>
    `<div class="note">\n\n${inner.replace(/\n<br>\n/g, "\n\n")}\n\n</div>`,
  );
}

function relatedFor(post) {
  const others = published.filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, 3);
}

function renderPost(post) {
  const url = `${SITE_URL}/posts/${post.slug}.html`;
  const image = `${SITE_URL}${post.image ?? "/assets/brand/og-image.jpg"}`;
  const description = post.description || post.summary;
  const catLabel = CATEGORIES[post.category] ?? "Bài viết";
  const body = marked.parse(expandNotes(post.body)).replace(/https:\/\/imeji-newhorizon-1\.onrender\.com/g, SITE_URL);

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    image: [image],
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "vi",
    mainEntityOfPage: url,
    author: { "@type": "Person", "@id": `${SITE_URL}/giang-vien/#person`, name: AUTHOR, url: `${SITE_URL}/giang-vien/` },
    publisher: {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: "Tiếng Nhật Thầy Quang Quy Nhơn",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/brand/logo.png` },
    },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Bài viết", item: `${SITE_URL}/posts/` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const course = COURSE_LINKS[post.category];
  const related = [
    ...relatedFor(post).map((p) => `<li><a href="/posts/${p.slug}.html">${esc(p.title)}</a></li>`),
    course ? `<li><a href="${course.href}">${esc(course.label)}</a></li>` : "",
    `<li><a href="/posts/">Xem tất cả bài viết</a></li>`,
  ].filter(Boolean);

  const dateLine = post.updated && post.updated !== post.date
    ? `Đăng ${vnDate(post.date)} · Cập nhật <time datetime="${post.updated}">${vnDate(post.updated)}</time>`
    : `<time datetime="${post.date}">${vnDate(post.date)}</time>`;

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
${post.publish ? "" : '  <meta name="robots" content="noindex">\n'}  <title>${esc(shortTitle(post.title))}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="icon" href="/favicon.ico">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${esc(post.title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="vi_VN">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  ${ld(article)}
  ${ld(breadcrumb)}
  <style>
${POST_CSS.trim()}
  </style>
</head>
<body>
  <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Trang chủ</a> › <a href="/posts/">Bài viết</a> › ${esc(catLabel)}</nav>
  <article>
    <h1>${esc(post.title)}</h1>
    <p class="byline">${dateLine} · <a href="/giang-vien/">${AUTHOR}</a></p>
${body.trim()}
  </article>
  <section class="related">
    <h2>Đọc tiếp</h2>
    <ul>
      ${related.join("\n      ")}
    </ul>
  </section>
  <div class="cta">
    <p><strong>Muốn học bài bản cùng thầy Quang?</strong> Lớp tiếng Nhật N5–N3 tại 80 Võ Mười, Quy Nhơn, sĩ số dưới 6 bạn, <strong>học thử miễn phí 2 buổi</strong>.</p>
    <p><a href="/?utm_source=blog&amp;utm_medium=cta#register">Đăng ký học thử miễn phí</a> · <a href="https://zalo.me/0868608647" target="_blank" rel="noopener">Nhắn Zalo 086 860 8647</a> · <a href="/?utm_source=blog&amp;utm_medium=cta#courses">Xem khóa học</a></p>
  </div>
</body>
</html>
`;
}

fs.mkdirSync(path.join(dist, "posts"), { recursive: true });
for (const post of posts) {
  fs.writeFileSync(path.join(dist, "posts", `${post.slug}.html`), renderPost(post));
  console.log(`Đã dựng bài${post.publish ? "" : " nháp (noindex)"}: ${post.slug}`);
}

// ---------- 3. sitemap.xml ----------
// Các trang React lấy ngày build làm ngày cập nhật (lastmod)
const buildDate = new Date().toISOString().slice(0, 10);
const urls = [
  ...PAGES.map((p) => `  <url><loc>${SITE_URL}${p.path}</loc><lastmod>${buildDate}</lastmod></url>`),
  ...published.map(
    (p) => `  <url><loc>${SITE_URL}/posts/${p.slug}.html</loc><lastmod>${p.updated ?? p.date}</lastmod></url>`,
  ),
];
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
);

// robots.txt trỏ tới sitemap trên tên miền chính thức
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log("Xong: sitemap.xml, robots.txt");
