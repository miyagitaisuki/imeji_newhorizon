import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, LogIn, Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import { PORTAL_URL, PRACTICE_URL } from "../data/siteInfo";
import { trackEcosystem } from "../lib/analytics";

const NAV_ITEMS: { id?: string; label: string; href?: string }[] = [
  { id: "about", label: "Giảng viên" },
  { id: "features", label: "Điểm khác biệt" },
  { id: "courses", label: "Khóa học" },
  { id: "roadmap", label: "Lộ trình" },
  { id: "ecosystem", label: "Hệ sinh thái" },
  { id: "pricing", label: "Học phí" },
  { id: "faq", label: "FAQ" },
  { label: "Bài viết", href: "/posts/" },
];

interface Props {
  // Trang chủ có ảnh nền tối ở đầu trang nên header trong suốt chữ trắng;
  // các trang con luôn dùng header nền sáng.
  isHome: boolean;
  onOpenQuiz: () => void;
}

export const SiteHeader: React.FC<Props> = ({ isHome, onOpenQuiz }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const [activeId, setActiveId] = useState("");
  const scrolled = scrolledDown || !isHome;
  const base = isHome ? "" : "/";

  useEffect(() => {
    // Lớp "dark" đã được gắn sớm bằng script trong index.html; ở đây chỉ đồng bộ trạng thái nút.
    setDarkMode(document.documentElement.classList.contains("dark"));
    const handleScroll = () => setScrolledDown(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tô sáng mục menu của phần đang xem (chỉ trang chủ có các phần này).
  useEffect(() => {
    if (!isHome) return;
    const ids = NAV_ITEMS.filter((i) => i.id).map((i) => i.id as string);
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActiveId(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome]);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    try {
      localStorage.setItem("thayquang_theme", nextDark ? "dark" : "light");
    } catch {
      // trình duyệt chặn lưu trữ thì bỏ qua
    }
  };

  return (
    <>
  {/* =========================================================================
      TOP NAVIGATION BAR (Optimized Glass Bar)
  ========================================================================= */}
  <header
    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-5 pt-3`}
  >
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-5 py-2 rounded-full border flex items-center justify-between gap-3 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-900/10 backdrop-blur"
          : "bg-slate-900/45 border-white/25 shadow-lg shadow-black/10 backdrop-blur-md"
      }`}
    >
      {/* Logo & Teacher Branding */}
      <a href="/" className="flex items-center gap-3 group">
        <img
          src="/assets/brand/logo.png"
          alt="Logo IMEJI日本語教室"
          width={40}
          height={40}
          className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
        />
        <div>
          <p className={`font-extrabold text-base sm:text-lg leading-tight ${scrolled ? "text-slate-900 dark:text-white" : "text-white"}`}>
            IMEJI日本語教室
          </p>
          <p className={`text-xs font-semibold ${scrolled ? "text-primary-700 dark:text-primary-300" : "text-white/95"}`}>
            Lớp học tiếng Nhật thầy Quang
          </p>
        </div>
      </a>

      {/* Desktop Nav Items */}
      <nav className="hidden 2xl:flex items-center gap-1 text-[15px] font-semibold">
        {NAV_ITEMS.map((i) => {
          const active = !!i.id && activeId === i.id;
          const tone = active
            ? scrolled
              ? "bg-primary-100 text-primary-800 dark:bg-primary-900/60 dark:text-primary-200"
              : "bg-white text-primary-800"
            : scrolled
              ? "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              : "text-white hover:bg-white/20";
          return (
            <a
              key={i.label}
              href={i.href ?? `${base}#${i.id}`}
              aria-current={active ? "true" : undefined}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors ${tone}`}
            >
              {i.label}
            </a>
          );
        })}
      </nav>

      {/* Action buttons on Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Lối tắt tới Luyện tập (dominion) và Cổng học viên (eduscan) */}
        <a
          href={PRACTICE_URL}
          onClick={() => trackEcosystem("practice", "header")}
          className={`hidden md:inline-flex whitespace-nowrap items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold border transition active:scale-95 ${scrolled ? "border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950/40" : "border-white/50 text-white hover:bg-white/20"}`}
        >
          <Gamepad2 size={15} />
          <span>Luyện tập</span>
        </a>
        <a
          href={PORTAL_URL}
          onClick={() => trackEcosystem("portal", "header")}
          className={`hidden md:inline-flex whitespace-nowrap items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold border transition active:scale-95 ${scrolled ? "border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950/40" : "border-white/50 text-white hover:bg-white/20"}`}
        >
          <LogIn size={15} />
          <span>Học viên</span>
        </a>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Chuyển chế độ sáng tối"
          className={`p-2.5 rounded-xl border transition active:scale-95 ${scrolled ? "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" : "border-white/30 text-white hover:bg-white/10"}`}
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Desktop Register CTA */}
        <a
          href={`${base}#register`}
          className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 transition shadow-sm"
        >
          Học thử miễn phí
        </a>

        {/* Mobile Menu Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`2xl:hidden p-2 rounded-xl transition ${scrolled ? "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800" : "text-white hover:bg-white/10"}`}
          aria-label="Mở menu điều hướng"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </div>

    {/* Mobile Dropdown Menu */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="2xl:hidden border-b border-slate-200 dark:border-slate-800 glass-panel px-6 py-4 flex flex-col gap-2.5 text-sm"
        >
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <a
              onClick={() => { setMobileMenuOpen(false); trackEcosystem("practice", "mobile_menu"); }}
              href={PRACTICE_URL}
              className="py-3 rounded-xl bg-primary-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <Gamepad2 size={16} />
              <span>Luyện tập</span>
            </a>
            <a
              onClick={() => { setMobileMenuOpen(false); trackEcosystem("portal", "mobile_menu"); }}
              href={PORTAL_URL}
              className="py-3 rounded-xl border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              <span>Học viên</span>
            </a>
          </div>
          <a
            onClick={() => setMobileMenuOpen(false)}
            href={`${base}#about`}
            className="py-2 text-slate-800 dark:text-slate-200 font-medium hover:text-primary-600"
          >
            Giảng viên phụ trách
          </a>
          <a
            onClick={() => setMobileMenuOpen(false)}
            href={`${base}#features`}
            className="py-2 text-slate-800 dark:text-slate-200 font-medium hover:text-primary-600"
          >
            Điểm khác biệt lớp học
          </a>
          <a
            onClick={() => setMobileMenuOpen(false)}
            href={`${base}#courses`}
            className="py-2 text-slate-800 dark:text-slate-200 font-medium hover:text-primary-600"
          >
            Các khóa học (N5 - N4 - N3)
          </a>
          <a
            onClick={() => setMobileMenuOpen(false)}
            href={`${base}#roadmap`}
            className="py-2 text-slate-800 dark:text-slate-200 font-medium hover:text-primary-600"
          >
            Lộ trình chinh phục JLPT
          </a>
          <a
            onClick={() => setMobileMenuOpen(false)}
            href={`${base}#ecosystem`}
            className="py-2 text-slate-800 dark:text-slate-200 font-medium hover:text-primary-600"
          >
            Hệ sinh thái học tập số hóa
          </a>
          <a
            onClick={() => setMobileMenuOpen(false)}
            href={`${base}#pricing`}
            className="py-2 text-slate-800 dark:text-slate-200 font-medium hover:text-primary-600"
          >
            Chính sách học phí
          </a>
          <a
            onClick={() => setMobileMenuOpen(false)}
            href={`${base}#faq`}
            className="py-2 text-slate-800 dark:text-slate-200 font-medium hover:text-primary-600"
          >
            Câu hỏi thường gặp
          </a>
          <a
            onClick={() => setMobileMenuOpen(false)}
            href="/posts/"
            className="py-2 text-slate-800 dark:text-slate-200 font-medium hover:text-primary-600"
          >
            Bài viết học tiếng Nhật
          </a>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuiz();
              }}
              className="py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} className="text-amber-500" />
              <span>Trắc nghiệm kiểm tra trình độ (30 giây)</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </header>
    </>
  );
};
