import { Award, BookOpen, GraduationCap, Layers, Sparkles, Users } from "lucide-react";
import { Layout, useOpenQuiz } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { useRegistrationForm } from "../hooks/useRegistrationForm";
import { COURSES } from "../data/courseData";
import { PUBLISHED_POSTS, postUrl, formatDate } from "../data/posts";
import { TEACHER } from "../data/teacher";
import { ADDRESS_FULL, COMMITMENT_DETAIL, COMMITMENT_TITLE, FREE_TRIAL } from "../data/siteInfo";

// Trang /giang-vien/: hồ sơ giảng viên (giúp Google và học viên đánh giá độ uy tín của người dạy)
export default function TeacherPage() {
  const form = useRegistrationForm();
  return (
    <Layout onQuizResult={form.applyQuizResult}>
      <TeacherContent />
    </Layout>
  );
}

function TeacherContent() {
  const openQuiz = useOpenQuiz();
  const credentials = [
    { icon: GraduationCap, title: TEACHER.degree, desc: "Nền tảng học thuật về ngôn ngữ và phương pháp giảng dạy ngoại ngữ." },
    { icon: Award, title: `Chứng chỉ ${TEACHER.jlpt}`, desc: "Cấp độ cao nhất của kỳ thi Năng lực Nhật ngữ (JLPT)." },
    { icon: Users, title: `Giảng viên ${TEACHER.university.name}`, desc: "Đang giảng dạy tiếng Nhật ở bậc đại học." },
    { icon: Sparkles, title: `${TEACHER.yearsTeaching} giảng dạy`, desc: "Kinh nghiệm dạy tiếng Nhật từ sơ cấp đến trung cấp." },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <Breadcrumbs items={[{ name: "Trang chủ", href: "/" }, { name: "Giảng viên" }]} />

      {/* Giới thiệu */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-4">
          <img
            src={TEACHER.photo}
            alt={`${TEACHER.fullTitle} – giảng viên tiếng Nhật ${TEACHER.university.name}`}
            width={400}
            height={520}
            className="w-full max-w-xs mx-auto aspect-[4/5] object-cover object-top rounded-3xl shadow-xl border-4 border-white dark:border-slate-800"
          />
        </div>
        <div className="md:col-span-8 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Giảng viên phụ trách
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {TEACHER.fullTitle} – Giảng viên tiếng Nhật tại Quy Nhơn
          </h1>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {TEACHER.fullTitle} là giảng viên tiếng Nhật của {TEACHER.university.name}, {TEACHER.degree.toLowerCase()}, có
            chứng chỉ {TEACHER.jlpt} và {TEACHER.yearsTeaching.toLowerCase()} kinh nghiệm giảng dạy. Thầy trực tiếp đứng lớp
            tất cả các khóa N5, N4, N3 của Lớp tiếng Nhật Thầy Quang tại {ADDRESS_FULL}.
          </p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Mục tiêu của thầy là giúp người Việt học tiếng Nhật đúng trọng tâm: vượt qua nỗi sợ Kanji và ngữ pháp, thi đỗ
            JLPT, đồng thời dùng được tiếng Nhật trong học tập, du học và làm việc với doanh nghiệp Nhật Bản.
          </p>
        </div>
      </section>

      {/* Bằng cấp */}
      <section className="mt-14" aria-labelledby="bang-cap">
        <h2 id="bang-cap" className="text-2xl font-bold text-slate-900 dark:text-white">
          Bằng cấp và kinh nghiệm
        </h2>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {credentials.map((c) => (
            <div key={c.title} className="glass-panel rounded-2xl p-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
                <c.icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{c.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Phương pháp */}
      <section className="mt-14" aria-labelledby="phuong-phap">
        <h2 id="phuong-phap" className="text-2xl font-bold text-slate-900 dark:text-white">
          Phương pháp giảng dạy
        </h2>
        <ul className="mt-5 space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex gap-3">
            <Users size={18} className="mt-1 text-primary-600 flex-shrink-0" />
            <span>
              <strong>Lớp nhỏ dưới 6 học viên:</strong> thầy sửa phát âm, ngữ pháp cho từng bạn ngay trên lớp.
            </span>
          </li>
          <li className="flex gap-3">
            <BookOpen size={18} className="mt-1 text-primary-600 flex-shrink-0" />
            <span>
              <strong>Tài liệu tự biên soạn:</strong> tóm tắt trọng tâm từ các giáo trình chuẩn Nhật Bản (Minna no Nihongo,
              Soumatome, Shinkanzen Master).
            </span>
          </li>
          <li className="flex gap-3">
            <Layers size={18} className="mt-1 text-primary-600 flex-shrink-0" />
            <span>
              <strong>Flashcard Anki:</strong> ôn từ vựng và Kanji theo phương pháp lặp lại ngắt quãng, mỗi ngày 20–30 phút.
            </span>
          </li>
          <li className="flex gap-3">
            <Award size={18} className="mt-1 text-primary-600 flex-shrink-0" />
            <span>
              <strong>Luyện đề JLPT thật:</strong> thi thử có bấm giờ, phân tích bẫy đề và cách phân bổ thời gian.{" "}
              {COMMITMENT_TITLE}: {COMMITMENT_DETAIL}
            </span>
          </li>
        </ul>
      </section>

      {/* Khóa học do thầy phụ trách */}
      <section className="mt-14" aria-labelledby="khoa-hoc">
        <h2 id="khoa-hoc" className="text-2xl font-bold text-slate-900 dark:text-white">
          Các khóa học thầy trực tiếp giảng dạy
        </h2>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {COURSES.map((c) => (
            <a
              key={c.id}
              href={`/khoa-hoc/${c.id}/`}
              className="glass-panel rounded-2xl p-5 hover:border-primary-400 dark:hover:border-primary-500 transition"
            >
              <h3 className="font-bold text-slate-900 dark:text-white">{c.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{c.targetAudience}</p>
              <p className="text-xs text-slate-500 mt-2">Thời lượng {c.duration}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Bài viết của thầy */}
      {PUBLISHED_POSTS.length > 0 && (
        <section className="mt-14" aria-labelledby="bai-viet">
          <h2 id="bai-viet" className="text-2xl font-bold text-slate-900 dark:text-white">
            Bài viết của {TEACHER.fullTitle}
          </h2>
          <ul className="mt-5 space-y-2">
            {PUBLISHED_POSTS.slice(0, 6).map((p) => (
              <li key={p.slug}>
                <a href={postUrl(p.slug)} className="text-primary-600 dark:text-primary-400 hover:underline">
                  {p.title}
                </a>{" "}
                <span className="text-xs text-slate-500">({formatDate(p.date)})</span>
              </li>
            ))}
            <li>
              <a href="/posts/" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:underline">
                Xem tất cả bài viết →
              </a>
            </li>
          </ul>
        </section>
      )}

      {/* Mời học thử */}
      <section className="mt-14 glass-panel rounded-3xl p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Học thử với thầy Quang</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {FREE_TRIAL} để làm quen với cách dạy của thầy trước khi đóng học phí.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/#register"
            className="px-7 py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition shadow-lg shadow-primary-500/30"
          >
            Đăng ký học thử miễn phí
          </a>
          <button
            onClick={openQuiz}
            className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm"
          >
            Trắc nghiệm chọn lớp 30s
          </button>
        </div>
      </section>
    </div>
  );
}
