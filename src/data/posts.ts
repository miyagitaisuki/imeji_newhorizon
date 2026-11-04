// Danh mục bài viết lấy trực tiếp từ public/posts/index.json lúc build,
// để danh sách bài có sẵn trong HTML dựng sẵn (tốt cho Google).
import postsIndex from "../../public/posts/index.json";

export type PostCategory = "n5" | "n4" | "n3" | "phuong-phap";

export interface Post {
  slug: string;
  title: string;
  summary: string;
  date: string;
  publish: boolean;
  category?: string;
  image?: string;
}

export const CATEGORY_LABELS: Record<string, string> =
  (postsIndex as { categories?: Record<string, string> }).categories ?? {};

export const PUBLISHED_POSTS: Post[] = (postsIndex.posts as Post[])
  .filter((p) => p.publish)
  .sort((a, b) => b.date.localeCompare(a.date));

export const postUrl = (slug: string) => `/posts/${slug}.html`;

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
