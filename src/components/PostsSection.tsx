import { ArrowRight } from "lucide-react";
import { PUBLISHED_POSTS, CATEGORY_LABELS, postUrl, formatDate } from "../data/posts";

// Các bài viết mới nhất trên trang chủ (tối đa 4) + liên kết tới trang tất cả bài viết
export const PostsSection: React.FC = () => {
  const posts = PUBLISHED_POSTS.slice(0, 4);
  if (posts.length === 0) return null;

  return (
    <section id="posts" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Bài viết mới</h2>
        <a href="/posts/" className="text-sm font-semibold text-primary-600 dark:text-primary-400 inline-flex items-center gap-1 hover:underline">
          Xem tất cả <ArrowRight size={15} />
        </a>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((p) => (
          <li key={p.slug}>
            <a
              href={postUrl(p.slug)}
              className="block h-full p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900 hover:shadow-lg transition"
            >
              <div className="text-xs text-slate-500 mb-2">
                {p.category && CATEGORY_LABELS[p.category] ? `${CATEGORY_LABELS[p.category]} ・ ` : ""}
                {formatDate(p.date)}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{p.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{p.summary}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};
