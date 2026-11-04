import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Gift,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import { Layout, useOpenQuiz } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ContactFormSection } from "../components/ContactFormSection";
import { InteractiveMap } from "../components/InteractiveMap";
import { useRegistrationForm } from "../hooks/useRegistrationForm";
import { COURSES, type CourseData } from "../data/courseData";
import { COURSE_DETAILS } from "../data/courseDetails";
import { PUBLISHED_POSTS, postUrl } from "../data/posts";
import {
  ADDRESS_FULL,
  COMMITMENT_DETAIL,
  COMMITMENT_TITLE,
  FREE_TRIAL,
  useScheduleDays,
  SCHEDULE_SHORT,
  useNextStartLabel,
} from "../data/siteInfo";

const formatVnd = (n: number) => n.toLocaleString("vi-VN");
const MONTHLY_FEE = 900000;

export default function CoursePage({ courseId }: { courseId: CourseData["id"] }) {
  const course = COURSES.find((c) => c.id === courseId)!;
  const form = useRegistrationForm(course);
  return (
    <Layout onQuizResult={form.applyQuizResult}>
      <CourseContent course={course} form={form} />
    </Layout>
  );
}

function CourseContent({ course, form }: { course: CourseData; form: ReturnType<typeof useRegistrationForm> }) {
  const d = COURSE_DETAILS[course.id];
  const openQuiz = useOpenQuiz();
  const startLabel = useNextStartLabel();
  const scheduleDays = useScheduleDays();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const otherCourses = COURSES.filter((c) => c.id !== course.id);
  const relatedPosts = PUBLISHED_POSTS.filter((p) => p.category === course.id).slice(0, 3);

  const facts = [
    { icon: Clock, label: "Thời lượng", value: `${d.months} tháng` },
    { icon: CalendarDays, label: "Lịch học", value: `${SCHEDULE_SHORT}, ${scheduleDays}` },
    { icon: Wallet, label: "Học phí", value: `${formatVnd(MONTHLY_FEE)} đ/tháng (cả khóa ${formatVnd(MONTHLY_FEE * d.months)} đ)` },
    { icon: Users, label: "Sĩ số", value: "Dưới 6 học viên/lớp" },
    { icon: Gift, label: "Ưu đãi", value: FREE_TRIAL },
    ...(startLabel ? [{ icon: Sparkles, label: "Khai giảng", value: startLabel }] : []),
  ];

  return (
    <>
      {/* Phần mở đầu */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-blue-50/80 to-transparent dark:from-slate-900/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ name: "Trang chủ", href: "/" }, { name: "Khóa học", href: "/#courses" }, { name: course.title }]}
          />
          <span className="inline-block mt-5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
            {course.tag}
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance">
            {d.h1}
          </h1>
          <div className="mt-5 space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
            {d.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {facts.map((f) => (
              <div key={f.label} className="glass-panel rounded-2xl p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
                  <f.icon size={18} />
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">{f.label}</dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-white">{f.value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => form.selectCourse(course)}
              className="px-7 py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition shadow-lg shadow-primary-500/30 inline-flex items-center justify-center gap-2"
            >
              Đăng ký học thử 2 buổi miễn phí <ArrowRight size={16} />
            </button>
            <button
              onClick={openQuiz}
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm inline-flex items-center justify-center gap-2"
            >
              <Sparkles size={16} className="text-amber-500" /> Chưa chắc trình độ? Làm trắc nghiệm 30s
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-12">
        {/* Dành cho ai + Kết quả */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel rounded-3xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={20} className="text-primary-600" /> Khóa học dành cho ai?
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
              {d.forWhom.map((x) => (
                <li key={x} className="flex gap-2.5">
                  <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel rounded-3xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target size={20} className="text-primary-600" /> Học xong bạn đạt được gì?
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
              {d.outcomes.map((x) => (
                <li key={x} className="flex gap-2.5">
                  <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Lộ trình */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Lộ trình {d.months} tháng của {course.title}
          </h2>
          <ol className="mt-6 space-y-4">
            {d.phases.map((ph, i) => (
              <li key={ph.period} className="glass-panel rounded-2xl p-5 flex gap-4">
                <span className="w-9 h-9 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">{ph.period}</p>
                  <h3 className="font-bold text-slate-900 dark:text-white">{ph.title}</h3>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300 list-disc pl-5">
                    {ph.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* JLPT + học liệu */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel rounded-3xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kỳ thi JLPT {d.jlpt.level} gồm những gì?</h2>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
              <strong>Các phần thi:</strong> {d.jlpt.sections}
            </p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              <strong>Điểm đỗ:</strong> {d.jlpt.passMark}
            </p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              Tại Việt Nam, JLPT thường được tổ chức vào tháng 7 và tháng 12 hằng năm.
            </p>
          </div>
          <div className="glass-panel rounded-3xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen size={20} className="text-primary-600" /> Giáo trình và học liệu
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
              {d.materials.map((x) => (
                <li key={x} className="flex gap-2.5">
                  <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">Không phát sinh chi phí tài liệu ngoài học phí.</p>
          </div>
        </section>

        {/* Cam kết */}
        <section className="rounded-3xl p-6 border-2 border-primary-500/40 bg-primary-50/60 dark:bg-primary-950/30 flex gap-4">
          <ShieldCheck size={28} className="text-primary-600 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{COMMITMENT_TITLE}</h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{COMMITMENT_DETAIL}</p>
          </div>
        </section>

        {/* FAQ riêng của khóa */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Câu hỏi thường gặp về {course.title}</h2>
          <div className="mt-5 space-y-3">
            {d.faqs.map((faq, idx) => (
              <div key={faq.q} className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  aria-expanded={activeFaq === idx}
                  className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 text-sm sm:text-base font-semibold text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`transition-transform text-slate-400 flex-shrink-0 ${activeFaq === idx ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Liên kết nội bộ: bài viết liên quan + khóa khác */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedPosts.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Bài viết cho trình độ {d.jlpt.level}</h2>
              <ul className="space-y-2">
                {relatedPosts.map((p) => (
                  <li key={p.slug}>
                    <a href={postUrl(p.slug)} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      {p.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="/posts/" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:underline">
                    Xem tất cả bài viết →
                  </a>
                </li>
              </ul>
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Các khóa học khác</h2>
            <ul className="space-y-2">
              {otherCourses.map((c) => (
                <li key={c.id}>
                  <a href={`/khoa-hoc/${c.id}/`} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                    {c.title} – {c.targetAudience.toLowerCase()}
                  </a>
                </li>
              ))}
              <li>
                <a href="/luyen-tap/" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:underline">
                  Luyện tập miễn phí theo bài Minna no Nihongo →
                </a>
              </li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">Địa điểm học: {ADDRESS_FULL}</p>
          </div>
        </section>
      </div>

      <ContactFormSection formData={form.formData} setFormData={form.setFormData} />
      <InteractiveMap />
    </>
  );
}
