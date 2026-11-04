import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Flame,
  GraduationCap,
  Layers,
  Send,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

import { ROADMAP_STEPS, FAQS } from "../data/courseData";
import { CourseSection } from "../components/CourseSection";
import { InteractiveMap } from "../components/InteractiveMap";
import { ContactFormSection } from "../components/ContactFormSection";
import { PostsSection } from "../components/PostsSection";
import { Layout, useOpenQuiz } from "../components/Layout";
import { useRegistrationForm } from "../hooks/useRegistrationForm";
import {
  FREE_TRIAL,
  SCHEDULE_SHORT,
  SCHEDULE_DAYS,
  COMMITMENT_TITLE,
  COMMITMENT_DETAIL,
  useNextStartLabel,
} from "../data/siteInfo";

type Form = ReturnType<typeof useRegistrationForm>;

export default function HomePage() {
  const form = useRegistrationForm();
  return (
    <Layout isHome onQuizResult={form.applyQuizResult}>
      <HomeContent form={form} />
    </Layout>
  );
}

function HomeContent({ form }: { form: Form }) {
  const openQuiz = useOpenQuiz();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const startLabel = useNextStartLabel();

  return (
    <>
    {/* =========================================================================
        SECTION 1: HERO (With Sky Sunrise Cloudscape Background & Teacher Photo)
    ========================================================================= */}
    <section className="relative min-h-[92vh] pt-28 sm:pt-34 pb-16 flex items-center overflow-hidden">
      {/* Sky Sunrise Background Image (Prominently visible behind the entire hero) */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        <img
          src="/assets/aistudio/clouds-blue.jpg"
          alt="Biển mây bình minh rực sáng - Tiếng Nhật Thầy Quang Quy Nhơn"
          className="w-full h-full object-cover object-top sm:object-center filter brightness-100 contrast-[1.05]"
          loading="eager"
          fetchPriority="high"
        />
        {/* Subtle overlay that lets the sky and clouds shine through while providing a smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/20 dark:from-black/85 dark:via-black/65 dark:to-black/35" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-50 dark:from-[#0b0f19] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Content (Glass Panel ensures 100% text contrast in both light & dark modes) */}
          <div className="lg:col-span-7 p-6 sm:p-9 rounded-3xl border border-white/25 shadow-2xl space-y-6 text-center lg:text-left backdrop-blur-xl bg-slate-900/25 text-white">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-50/95 dark:bg-blue-950/80 text-primary-700 dark:text-primary-300 border border-blue-200/90 dark:border-blue-900/60 shadow-sm">
                <Sparkles size={14} className="text-amber-500" />
                <span>Lớp học Tiếng Nhật Thầy Quang Quy Nhơn</span>
              </div>
              {startLabel && (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-400 text-slate-900 shadow-sm">
                  <CalendarDays size={14} />
                  <span>Khai giảng {startLabel}</span>
                </div>
              )}
            </div>

            <h1 className="text-balance text-3xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight leading-[1.18] text-white">
              Học tiếng Nhật thực chiến{" "}
              <span className="whitespace-nowrap bg-gradient-to-r from-sky-300 via-primary-400 to-sky-300 bg-clip-text text-transparent">
                từ N5 đến N3
              </span>{" "}
              tại Quy Nhơn
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Học trực tiếp cùng giảng viên Đại học giàu kinh nghiệm, thạc sĩ Ngôn ngữ học. Lộ trình bài bản tinh gọn, kết hợp flashcard Anki thông minh và học liệu đa dạng. Lịch học {SCHEDULE_SHORT}, vào {SCHEDULE_DAYS}.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>Đăng ký học thử 2 buổi miễn phí</span>
                <Send size={15} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={openQuiz}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/90 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm border border-slate-200/90 dark:border-slate-700 transition flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              >
                <Sparkles size={16} className="text-amber-500" />
                <span>Trắc nghiệm chọn lớp 30s</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-white/90 font-semibold border-t border-white/20">
              <span className="flex items-center gap-1.5">
                <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> {FREE_TRIAL}
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> Sĩ số dưới 6 bạn
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> Học trực tiếp 80 Võ Mười
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> {COMMITMENT_TITLE}
              </span>
            </div>
          </div>

          {/* Right Side: Instructor Portrait Card with Teacher's Real Photo */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-68 sm:w-80 md:w-88 aspect-[3.8/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/95 dark:border-slate-800/95 group bg-slate-900">
              {/* Teacher Photo Uploaded by User */}
              <img
                src="/assets/aistudio/teacher.webp"
                loading="eager"
                alt="ThS. Nguyễn Thanh Quang - Giảng viên Tiếng Nhật Trường Đại học Quy Nhơn"
                className="w-full h-full object-cover object-[50%_18%] scale-125 group-hover:scale-[1.35] transition-transform duration-700"
              />

              {/* Subtle dark gradient overlay at bottom for crystal clear text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent pointer-events-none" />

              <div className="w-full h-full flex flex-col items-center justify-between p-5 sm:p-6 z-10 relative">
                <div className="w-full flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full glass-panel text-[11px] font-bold text-white tracking-wide border-white/30 backdrop-blur-md shadow-md">
                    🇯🇵 Giảng viên Trường Đại học Quy Nhơn (QNU)
                  </span>
                  <img
                    src="/assets/brand/logo.png"
                    alt="Logo"
                    width={36}
                    height={36}
                    className="w-9 h-9 object-contain drop-shadow-md"
                  />
                </div>

                <div className="w-full text-white text-left">
                  <p className="text-[11px] font-semibold tracking-wider uppercase text-sky-300 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-amber-300" />
                    <span>Giảng viên phụ trách</span>
                  </p>
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5 text-white">
                    ThS. Nguyễn Thanh Quang
                  </h3>
                  <p className="text-xs text-slate-200 mt-0.5">
                    Giảng viên Trường Đại học Quy Nhơn (QNU)
                  </p>
                  <p className="text-[11px] text-amber-200 mt-1 italic font-medium">
                    “Thực chiến JLPT N5 - N3 ・ Tận tâm đồng hành”
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Badges (GPU CSS transformed, mobile safe) */}
            <div className="absolute -top-3 -left-2 sm:-left-6 glass-panel px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-medium border border-slate-200/90 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <GraduationCap size={16} />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Thạc sĩ Ngôn ngữ học</p>
                <p className="text-[10px] text-slate-500">Chuyên ngành đào tạo</p>
              </div>
            </div>

            <div className="absolute top-1/3 -right-2 sm:-right-6 glass-panel px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-medium border border-slate-200/90 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90">
              <div className="p-1.5 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400">
                <Award size={16} />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Chứng chỉ JLPT N1</p>
                <p className="text-[10px] text-slate-500">Cấp độ cao nhất</p>
              </div>
            </div>

            <div className="absolute -bottom-3 -left-2 sm:left-4 glass-panel px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-medium border border-slate-200/90 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Flame size={16} />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">10+ Năm Giảng Dạy</p>
                <p className="text-[10px] text-slate-500">Kinh nghiệm thực tế</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* =========================================================================
        SECTION 2: TRUST STATS
    ========================================================================= */}
    <section className="py-10 border-y border-slate-200/70 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          <div className="pt-2 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-primary-600 dark:text-primary-400 tracking-tight">
              10+
            </p>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Năm kinh nghiệm giảng dạy
            </p>
          </div>
          <div className="pt-2 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-primary-600 dark:text-primary-400 tracking-tight">
              JLPT N1
            </p>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Trình độ tiếng Nhật chuẩn mực
            </p>
          </div>
          <div className="pt-2 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-primary-600 dark:text-primary-400 tracking-tight">
              3
            </p>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Lộ trình đào tạo (N5 - N4 - N3)
            </p>
          </div>
          <div className="pt-2 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-primary-600 dark:text-primary-400 tracking-tight">
              Đa dạng
            </p>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Học liệu đa dạng
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* =========================================================================
        SECTION 3: GIỚI THIỆU GIẢNG VIÊN
    ========================================================================= */}
    <section id="about" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2">
          Đội ngũ chuyên môn
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Gặp gỡ người đồng hành cùng bạn
        </h2>
        <div className="w-12 h-1 bg-primary-600 rounded-full mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-primary-500 shadow-md flex-shrink-0">
              <img
                src="/assets/aistudio/teacher.webp" loading="lazy"
                alt="ThS. Nguyễn Thanh Quang"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                ThS. Nguyễn Thanh Quang
              </h3>
              <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mt-0.5">
                Giảng viên Trường Đại học Quy Nhơn (QNU) ・ JLPT N1 Holder
              </p>
            </div>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            ThS. Nguyễn Thanh Quang hiện là giảng viên đại học với hơn 10 năm kinh nghiệm giảng dạy tiếng Nhật chuyên nghiệp. Với trình độ JLPT N1 cùng bằng thạc sĩ Ngôn ngữ học, thầy xây dựng phương pháp học tập thực chiến, loại bỏ rào cản sợ Hán tự (Kanji) và ngữ pháp phức tạp.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            Lớp học không chỉ tập trung vào việc thi đỗ chứng chỉ JLPT điểm cao, mà còn chú trọng khả năng ứng dụng phản xạ ngôn ngữ thực tế trong môi trường học bổng, du học và làm việc tại các doanh nghiệp Nhật Bản.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <span className="px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium">
              # Trường Đại học Quy Nhơn (QNU)
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium">
              # JLPT N1 Holder
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium">
              # Thạc sĩ Ngôn ngữ học
            </span>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {[
            { title: "Thạc sĩ Ngôn ngữ học", desc: "Nền tảng học thuật chuyên sâu về ngôn ngữ và phương pháp giảng dạy.", icon: GraduationCap },
            { title: "Trình độ JLPT N1", desc: "Năng lực tiếng Nhật cao cấp nhất, nắm trọn ngữ nghĩa tinh tế.", icon: Award },
            { title: "Giảng viên Đại học", desc: "Kinh nghiệm sư phạm chuẩn mực, phương pháp truyền cảm hứng.", icon: Users },
            { title: "Tài liệu tự biên soạn", desc: "Hệ thống hóa kiến thức súc tích, lược bỏ lan man không cần thiết.", icon: BookOpen },
            { title: "Học liệu đa dạng", desc: "Tài liệu, flashcard, đề thi thử và bài luyện nghe cho từng giai đoạn học.", icon: Layers },
            { title: COMMITMENT_TITLE, desc: COMMITMENT_DETAIL, icon: UserCheck },
          ].map((card, idx) => (
            <div
              key={idx}
              className="glass-panel p-4 sm:p-5 rounded-2xl hover:border-primary-400 dark:hover:border-primary-500 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <card.icon size={18} />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                {card.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* =========================================================================
        SECTION 4: ĐIỂM KHÁC BIỆT
    ========================================================================= */}
    <section id="features" className="py-20 bg-slate-100/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2">
            Giá trị cốt lõi
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tại sao học viên chọn lớp của thầy Quang?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3">
            Mô hình học kết hợp giữa sự tận tụy của lớp học nhỏ và công nghệ ghi nhớ hiện đại.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[
            {
              num: "01",
              title: "Sĩ số nhỏ",
              desc: "Mỗi lớp giới hạn số lượng học viên để thầy trực tiếp sửa lỗi phát âm, ngữ pháp và theo sát từng bạn.",
              icon: Users,
            },
            {
              num: "02",
              title: "Lộ trình thực chiến",
              desc: "Học đúng trọng tâm đề thi JLPT thực tế, rèn kỹ năng phản xạ và bẫy đề thi thay vì chỉ học vẹt lý thuyết.",
              icon: TrendingUp,
            },
            {
              num: "03",
              title: "Tài liệu tự biên soạn",
              desc: "Tổng hợp kiến thức tinh gọn, chọn lọc từ các giáo trình chuẩn Nhật Bản (Minna no Nihongo, Somatome, Shinkanzen).",
              icon: BookOpen,
            },
            {
              num: "04",
              title: "Flashcard Anki",
              desc: "Hệ thống Flashcard thông minh theo phương pháp Spaced Repetition (Lặp lại ngắt quãng) giúp nhớ từ vựng vĩnh viễn.",
              icon: Layers,
            },
            {
              num: "05",
              title: "AI hỗ trợ học tập",
              desc: "Ứng dụng các công cụ AI phân tích ngữ pháp, kiểm tra cách dùng từ tự nhiên và mở rộng hội thoại mọi lúc mọi nơi.",
              icon: Sparkles,
            },
            {
              num: "06",
              title: "Học liệu đa dạng",
              desc: "Tài liệu tự biên soạn, flashcard Anki, đề thi thử có đáp án và bài luyện nghe theo từng giai đoạn.",
              icon: BookOpen,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 sm:p-7 rounded-3xl relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="absolute top-4 right-5 text-4xl font-extrabold text-slate-200/50 dark:text-slate-800/60 select-none">
                {item.num}
              </span>
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
                <item.icon size={20} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* =========================================================================
        SECTION 5: KHÓA HỌC (Mobile Tabs Optimized Component)
    ========================================================================= */}
    <CourseSection onSelectCourse={form.selectCourse} onOpenQuiz={openQuiz} />

    {/* =========================================================================
        SECTION 6: LỘ TRÌNH HỌC (TIMELINE)
    ========================================================================= */}
    <section id="roadmap" className="py-20 bg-slate-100/60 dark:bg-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2">
            Lộ trình rõ ràng
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Hành trình từng bước chinh phục JLPT
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3">
            Không vội vã, không học dồn – Xây chắc móng để bứt phá thần tốc.
          </p>
        </div>

        <div className="relative">
          {/* Horizontal Timeline bar for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6 relative z-10">
            {ROADMAP_STEPS.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel p-5 rounded-2xl flex flex-col items-center text-center hover:scale-105 transition-transform"
              >
                <span className="w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-xs flex items-center justify-center mb-3 shadow-md">
                  {idx + 1}
                </span>
                <p className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                  {item.step}
                </p>
                <h3 className="font-bold text-base text-slate-900 dark:text-white my-1">
                  {item.title}
                </h3>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 mb-2 font-medium">
                  {item.time}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 p-5 rounded-2xl glass-panel max-w-2xl mx-auto text-center border-primary-300 dark:border-primary-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
            💡 {COMMITMENT_TITLE}: {COMMITMENT_DETAIL}
          </p>
        </div>
      </div>
    </section>

    {/* =========================================================================
        SECTION 7: HỆ SINH THÁI HỌC TẬP (DASHBOARD MOCKUP)
    ========================================================================= */}
    <section id="ecosystem" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2">
          Công nghệ giáo dục
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Hệ sinh thái học tập số hóa
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3">
          Học tập không giới hạn không gian với nền tảng hỗ trợ độc quyền của lớp.
        </p>
      </div>

      {/* Dashboard Showcase Frame */}
      <div className="rounded-3xl p-5 sm:p-10 glass-panel border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 gap-8 items-center">
          {/* Checklist of Features */}
          <div className="lg:col-span-12 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Mọi công cụ bạn cần để giỏi tiếng Nhật
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Không cần mang vác sách vở cồng kềnh. Học viên tại lớp được cấp quyền truy cập toàn bộ tài nguyên số hóa:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "Flashcard Anki thông minh",
                "Kho đề thi JLPT thử có bấm giờ",
                "Thống kê chi tiết kết quả thi",
                "Tài liệu số hóa PDF bản quyền",
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check size={13} />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* =========================================================================
        SECTION 9: HỌC PHÍ MINH BẠCH
    ========================================================================= */}
    <section id="pricing" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto glass-panel p-6 sm:p-12 rounded-3xl border-2 border-primary-500/40 relative overflow-hidden shadow-2xl">
        {/* Subtle cloud ambient texture */}
        <div className="absolute inset-0 -z-10 opacity-10 dark:opacity-15 pointer-events-none overflow-hidden">
          <img
            src="/assets/aistudio/hero.webp" loading="lazy"
            alt="Cloud background"
            className="w-full h-full object-cover object-center filter blur-[1px]"
          />
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-2xl -z-10" />

        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-semibold text-xs uppercase tracking-wider">
            Chi phí hợp lý cho sinh viên
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            900.000 VNĐ <span className="text-base font-normal text-slate-500">/ tháng</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Chính sách học phí đồng nhất, không phát sinh chi phí tài liệu hay giáo trình phụ trợ.
          </p>
        </div>

        <div className="my-6 sm:my-8 py-6 border-y border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {[
            "Toàn bộ tài liệu biên soạn độc quyền",
            "Kho từ vựng thông minh Flashcard Anki",
            "Bộ đề thi JLPT thử có đáp án chi tiết",
            "Học liệu đa dạng: tài liệu, flashcard và đề thi thử",
            "Học lại miễn phí 1 khóa nếu chưa thi đỗ (*)",
            FREE_TRIAL + " trước khi đóng học phí",
          ].map((perk, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <Check size={16} className="text-emerald-500 flex-shrink-0" />
              <span>{perk}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="#register"
            className="inline-flex items-center justify-center px-8 py-3.5 sm:py-4 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition shadow-lg shadow-primary-500/25 active:scale-95"
          >
            Đăng ký học thử miễn phí
          </a>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            Lịch học: {SCHEDULE_SHORT} ・ {SCHEDULE_DAYS}
            {startLabel && <> ・ Khai giảng {startLabel}</>}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Lớp học giới hạn dưới 6 học viên mỗi khóa để đảm bảo chất lượng.
          </p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">(*) {COMMITMENT_DETAIL}</p>
        </div>
      </div>
    </section>

    {/* =========================================================================
        SECTION 10: FAQ (ACCORDION)
    ========================================================================= */}
    <section id="faq" className="py-20 bg-slate-100/50 dark:bg-slate-900/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2">
            Giải đáp thắc mắc
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Câu hỏi thường gặp
          </h2>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl overflow-hidden transition-colors border border-slate-200 dark:border-slate-800"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-5 sm:px-6 py-4 text-left flex justify-between items-center gap-4 text-sm sm:text-base font-semibold text-slate-900 dark:text-white min-h-[48px]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 text-slate-400 flex-shrink-0 ${
                    activeFaq === idx ? "rotate-180 text-primary-500" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 sm:px-6 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>


      <PostsSection />

      <ContactFormSection formData={form.formData} setFormData={form.setFormData} />

      <InteractiveMap />
    </>
  );
}
