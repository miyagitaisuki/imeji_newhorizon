// Bước cuối của build: tạo HTML dựng sẵn cho từng trang, bổ sung SEO cho bài viết, sinh sitemap.xml.
// Chạy sau `vite build` và `vite build --ssr src/entry-server.tsx --outDir dist-ssr`.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

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

// ---------- 2. Bài viết (HTML tĩnh trong public/posts) ----------
const index = JSON.parse(fs.readFileSync(path.join(root, "public/posts/index.json"), "utf-8"));
const categories = index.categories ?? {};
const published = index.posts.filter((p) => p.publish).sort((a, b) => b.date.localeCompare(a.date));
const COURSE_LINKS = {
  n5: { href: "/khoa-hoc/n5/", label: "Khóa tiếng Nhật N5 cho người mới bắt đầu tại Quy Nhơn" },
  n4: { href: "/khoa-hoc/n4/", label: "Khóa tiếng Nhật N4 – luyện thi JLPT N4 tại Quy Nhơn" },
  n3: { href: "/khoa-hoc/n3/", label: "Khóa luyện thi JLPT N3 tại Quy Nhơn" },
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

const RELATED_CSS = `
    .breadcrumb { font-size: 0.85rem; color: #64748b; margin: 0.5rem 0 1rem; }
    .breadcrumb a { text-decoration: none; }
    .related { border-top: 1px solid #cbd5e1; margin-top: 2rem; padding-top: 1rem; }
    .related h2 { margin-top: 0.5rem; }
    .related li { margin: 0.35rem 0; }
  </style>`;

function relatedFor(post) {
  const others = published.filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, 3);
}

for (const post of index.posts) {
  const file = path.join(dist, "posts", `${post.slug}.html`);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf-8");

  // Đổi mọi link tuyệt đối sang tên miền chính thức
  html = html.replace(/https:\/\/imeji-newhorizon-1\.onrender\.com/g, SITE_URL);

  if (!post.publish) {
    // Bài nháp: không cho Google lập chỉ mục
    html = html.replace("<head>", '<head>\n  <meta name="robots" content="noindex">');
    fs.writeFileSync(file, html);
    continue;
  }

  const url = `${SITE_URL}/posts/${post.slug}.html`;
  const image = post.image ? `${SITE_URL}/${post.image}` : `${SITE_URL}/assets/brand/og-image.jpg`;
  const catLabel = categories[post.category] ?? "Bài viết";

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    image: [image],
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "vi",
    mainEntityOfPage: url,
    author: { "@type": "Person", name: "ThS. Nguyễn Thanh Quang", url: `${SITE_URL}/#about` },
    publisher: {
      "@type": "EducationalOrganization",
      name: "IMEJI日本語教室",
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

  const headExtra = [
    `<link rel="canonical" href="${url}">`,
    html.includes('property="og:url"') ? "" : `<meta property="og:url" content="${url}">`,
    ld(article),
    ld(breadcrumb),
  ]
    .filter(Boolean)
    .map((l) => `  ${l}`)
    .join("\n");
  html = html.replace("</head>", `${headExtra}\n</head>`);
  html = html.replace(/\n  <\/style>/, RELATED_CSS);

  // Đường dẫn điều hướng hiển thị, thay cho liên kết "← Trang chủ"
  const crumbs = `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Trang chủ</a> › <a href="/posts/">Bài viết</a> › ${esc(catLabel)}</nav>`;
  if (html.includes('<p><a href="/">← Trang chủ</a></p>')) {
    html = html.replace('<p><a href="/">← Trang chủ</a></p>', crumbs);
  } else {
    html = html.replace(/<body>\s*/, `<body>\n  ${crumbs}\n  `);
  }

  // Bài liên quan + khóa học liên quan, đặt trước khung mời đăng ký
  const related = relatedFor(post);
  const course = COURSE_LINKS[post.category];
  const items = [
    ...related.map((p) => `<li><a href="/posts/${p.slug}.html">${esc(p.title)}</a></li>`),
    course ? `<li><a href="${course.href}">${esc(course.label)}</a></li>` : "",
    `<li><a href="/posts/">Xem tất cả bài viết</a></li>`,
  ].filter(Boolean);
  const block = `  <section class="related">\n    <h2>Đọc tiếp</h2>\n    <ul>\n      ${items.join("\n      ")}\n    </ul>\n  </section>\n`;
  html = html.includes('<div class="cta">')
    ? html.replace('  <div class="cta">', `${block}  <div class="cta">`)
    : html.replace("</body>", `${block}</body>`);

  fs.writeFileSync(file, html);
  console.log(`Đã bổ sung SEO cho bài: ${post.slug}`);
}

// ---------- 3. sitemap.xml ----------
const urls = [
  ...PAGES.map((p) => `  <url><loc>${SITE_URL}${p.path}</loc></url>`),
  ...published.map(
    (p) => `  <url><loc>${SITE_URL}/posts/${p.slug}.html</loc><lastmod>${p.updated ?? p.date}</lastmod></url>`,
  ),
];
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
);

// robots.txt trỏ tới sitemap trên tên miền chính thức
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log("Xong: sitemap.xml, robots.txt");
