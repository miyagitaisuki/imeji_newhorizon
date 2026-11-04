import { ChevronRight } from "lucide-react";
import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { useRegistrationForm } from "../hooks/useRegistrationForm";
import { PUBLISHED_POSTS, CATEGORY_LABELS, postUrl, formatDate } from "../data/posts";
import { COURSES } from "../data/courseData";
import { FREE_TRIAL } from "../data/siteInfo";

// Trang /posts/: tất cả bài viết, nhóm theo chủ đề
export default function PostsPage() {
  const form = useRegistrationForm();
  const groups = Object.entries(CATEGORY_LABELS)
    .map(([key, label]) => ({ key, label, posts: PUBLISHED_POSTS.filter((p) => (p.category ?? "phuong-phap") === key) }))
    .filter((g) => g.posts.length > 0);

  return (
    <Layout onQuizResult={form.applyQuizResult}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <Breadcrumbs items={[{ name: "Trang chủ", href: "/" }, { name: "Bài viết" }]} />
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-4">
          Bài viết học tiếng Nhật
        </h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Kiến thức ngữ pháp, chữ viết và phương pháp tự học tiếng Nhật từ N5 đến N3, do ThS. Nguyễn Thanh Quang biên soạn.
        </p>

        {groups.map((g) => (
          <section key={g.key} className="mt-12" aria-labelledby={`cat-${g.key}`}>
            <h2 id={`cat-${g.key}`} className="text-xl font-bold text-slate-900 mb-4">
              {g.label}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {g.posts.map((p) => (
                <li key={p.slug}>
                  <a
                    href={postUrl(p.slug)}
                    className="block h-full p-5 rounded-2xl border border-slate-200 bg-white/70 hover:shadow-lg transition"
                  >
                    <div className="text-xs text-slate-500 mb-1.5">{formatDate(p.date)}</div>
                    <h3 className="font-bold text-slate-900 mb-1.5">{p.title}</h3>
                    <p className="text-sm text-slate-600">{p.summary}</p>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-14 p-6 rounded-3xl glass-panel">
          <h2 className="text-lg font-bold text-slate-900">Học bài bản cùng Quang Sensei</h2>
          <p className="text-sm text-slate-600 mt-1">
            Lớp nhỏ dưới 6 bạn tại Quy Nhơn, {FREE_TRIAL.toLowerCase()}.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {COURSES.map((c) => (
              <a
                key={c.id}
                href={`/khoa-hoc/${c.id}/`}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-800 hover:border-primary-500"
              >
                {c.title} <ChevronRight size={15} />
              </a>
            ))}
            <a href="/#register" className="inline-flex items-center px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold">
              Đăng ký học thử miễn phí
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}
