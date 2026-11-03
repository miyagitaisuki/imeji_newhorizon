import React, { useEffect, useState } from "react";

interface Post {
  slug: string;
  title: string;
  summary: string;
  date: string;
  publish: boolean;
}

// Danh sách bài viết lấy từ public/posts/index.json (chỉ các bài publish: true)
export const PostsSection: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("posts/index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: { posts: Post[] }) => {
        if (cancelled) return;
        setPosts(
          data.posts
            .filter((p) => p.publish)
            .sort((a, b) => b.date.localeCompare(a.date))
        );
      })
      .catch(() => {
        // Không có danh sách bài thì ẩn mục này, không làm hỏng trang
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (posts.length === 0) return null;

  return (
    <section id="posts" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-8">
        Bài viết mới
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((p) => (
          <li key={p.slug}>
            <a
              href={`posts/${p.slug}.html`}
              className="block h-full p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900 hover:shadow-lg transition"
            >
              <div className="text-xs text-slate-500 mb-2">{p.date}</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{p.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{p.summary}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};
