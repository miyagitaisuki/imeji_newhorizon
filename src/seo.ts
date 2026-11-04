// Thông tin SEO cho từng trang: tiêu đề, mô tả, canonical, ảnh chia sẻ và dữ liệu có cấu trúc (JSON-LD).
// Dùng khi dựng sẵn HTML lúc build (scripts/prerender.mjs).
import { COURSES } from "./data/courseData";
import { COURSE_DETAILS } from "./data/courseDetails";
import {
  ADDRESS_STREET,
  ADDRESS_WARD,
  ADDRESS_PROVINCE,
  EMAIL,
  PHONE,
  SITE_NAME,
  SITE_URL,
} from "./data/siteInfo";

export interface PageMeta {
  path: string; // dạng "/", "/khoa-hoc/n5/"
  title: string;
  description: string;
  image?: string;
  jsonLd: object[];
}

const OG_IMAGE = `${SITE_URL}/assets/brand/og-image.jpg`;
const ORG_ID = `${SITE_URL}/#organization`;

const address = {
  "@type": "PostalAddress",
  streetAddress: `${ADDRESS_STREET}, ${ADDRESS_WARD}`,
  addressLocality: "Quy Nhơn",
  addressRegion: ADDRESS_PROVINCE,
  addressCountry: "VN",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": ORG_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/assets/brand/logo.png`,
  image: OG_IMAGE,
  description: "Lớp học tiếng Nhật thực chiến từ N5 đến N3 tại Quy Nhơn cùng ThS. Nguyễn Thanh Quang (JLPT N1).",
  address,
  telephone: "+84" + PHONE.slice(1),
  email: EMAIL,
  founder: { "@type": "Person", name: "ThS. Nguyễn Thanh Quang", jobTitle: "Giảng viên tiếng Nhật" },
};

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

function courseLd(id: (typeof COURSES)[number]["id"]) {
  const c = COURSES.find((x) => x.id === id)!;
  const d = COURSE_DETAILS[id];
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${c.title} – luyện thi JLPT ${d.jlpt.level}`,
    description: d.metaDescription,
    url: `${SITE_URL}/khoa-hoc/${id}/`,
    inLanguage: "vi",
    educationalLevel: `JLPT ${d.jlpt.level}`,
    provider: { "@type": "EducationalOrganization", "@id": ORG_ID, name: SITE_NAME, sameAs: `${SITE_URL}/` },
    offers: [
      {
        "@type": "Offer",
        category: "Paid",
        price: 900000 * d.months,
        priceCurrency: "VND",
        description: `900.000 VNĐ/tháng × ${d.months} tháng. Học thử miễn phí 2 buổi.`,
      },
    ],
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: "Onsite",
        location: { "@type": "Place", name: SITE_NAME, address },
        courseSchedule: {
          "@type": "Schedule",
          duration: "PT90M",
          repeatFrequency: "Weekly",
          byDay: ["https://schema.org/Monday", "https://schema.org/Wednesday", "https://schema.org/Friday"],
        },
        courseWorkload: `P${d.months}M`,
        instructor: [{ "@type": "Person", name: "ThS. Nguyễn Thanh Quang" }],
      },
    ],
  };
}

export const PAGES: PageMeta[] = [
  {
    path: "/",
    title: "IMEJI日本語教室 – Lớp học tiếng Nhật thầy Quang | JLPT N5, N4, N3",
    description:
      "Lớp học tiếng Nhật thực chiến từ N5 đến N3 tại Quy Nhơn cùng ThS. Nguyễn Thanh Quang (JLPT N1). Sĩ số dưới 6 bạn, học thử miễn phí 2 buổi.",
    jsonLd: [
      organization,
      { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/`, inLanguage: "vi" },
    ],
  },
  ...COURSES.map((c) => ({
    path: `/khoa-hoc/${c.id}/`,
    title: COURSE_DETAILS[c.id].metaTitle,
    description: COURSE_DETAILS[c.id].metaDescription,
    jsonLd: [
      courseLd(c.id),
      breadcrumbLd([
        { name: "Trang chủ", path: "/" },
        { name: "Khóa học", path: "/#courses" },
        { name: c.title, path: `/khoa-hoc/${c.id}/` },
      ]),
    ],
  })),
  {
    path: "/posts/",
    title: "Bài viết học tiếng Nhật N5, N4, N3 | IMEJI日本語教室",
    description:
      "Ngữ pháp, chữ viết và phương pháp tự học tiếng Nhật từ N5 đến N3 do ThS. Nguyễn Thanh Quang biên soạn. Mẹo nhớ Hiragana, Katakana, ngữ pháp JLPT.",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Bài viết học tiếng Nhật",
        url: `${SITE_URL}/posts/`,
        inLanguage: "vi",
        isPartOf: { "@type": "WebSite", url: `${SITE_URL}/` },
      },
      breadcrumbLd([
        { name: "Trang chủ", path: "/" },
        { name: "Bài viết", path: "/posts/" },
      ]),
    ],
  },
];

// Phần <head> cho một trang: title, description, canonical, Open Graph, JSON-LD
export function renderHead(meta: PageMeta): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const url = `${SITE_URL}${meta.path}`;
  const image = meta.image ?? OG_IMAGE;
  const ld = meta.jsonLd
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`)
    .join("\n    ");
  return `<title>${esc(meta.title)}</title>
    <meta name="description" content="${esc(meta.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${esc(meta.title)}" />
    <meta property="og:description" content="${esc(meta.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="vi_VN" />
    <meta property="og:site_name" content="${esc(SITE_NAME)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    ${ld}`;
}
