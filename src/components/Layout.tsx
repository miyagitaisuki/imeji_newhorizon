import { createContext, useContext, useState } from "react";
import { MessageCircle } from "lucide-react";
import { SiteHeader } from "./SiteHeader";
import { BottomNav } from "./BottomNav";
import { PlacementQuizModal } from "./PlacementQuizModal";
import { trackZalo } from "../lib/analytics";
import { PORTAL_URL, PRACTICE_URL, ADDRESS_FULL, EMAIL, PHONE, PHONE_DISPLAY, ZALO_URL, BUILD_YEAR } from "../data/siteInfo";
import { COURSES } from "../data/courseData";

const QuizContext = createContext<() => void>(() => {});
// Mở trắc nghiệm chọn lớp từ bất kỳ đâu trong trang
export const useOpenQuiz = () => useContext(QuizContext);

interface Props {
  isHome?: boolean;
  onQuizResult: (level: string, targetJlpt: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ isHome = false, onQuizResult, children }) => {
  const [quizOpen, setQuizOpen] = useState(false);
  const openQuiz = () => setQuizOpen(true);
  const base = isHome ? "" : "/";

  return (
    <QuizContext.Provider value={openQuiz}>
      <div className="relative isolate min-h-screen bg-japanese-pattern text-slate-800 dark:text-slate-100 selection:bg-primary-600 selection:text-white pb-16 md:pb-0">
        <SiteHeader isHome={isHome} onOpenQuiz={openQuiz} />

        <main>{children}</main>

        <footer className="py-10 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-1.5">
              <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">IMEJI日本語教室</p>
              <p>Lớp học tiếng Nhật thầy Quang</p>
              <p>ThS. Nguyễn Thanh Quang</p>
              <p>{ADDRESS_FULL}</p>
              <p>
                <a href={`tel:${PHONE}`} className="hover:text-primary-600">{PHONE_DISPLAY}</a> ・{" "}
                <a href={`mailto:${EMAIL}`} className="hover:text-primary-600">{EMAIL}</a>
              </p>
            </div>
            <nav aria-label="Khóa học" className="space-y-1.5">
              <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">Khóa học</p>
              {COURSES.map((c) => (
                <a key={c.id} href={`/khoa-hoc/${c.id}/`} className="block hover:text-primary-600">
                  {c.title}
                </a>
              ))}
            </nav>
            <nav aria-label="Tài nguyên" className="space-y-1.5">
              <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">Tài nguyên</p>
              <a href={PRACTICE_URL} className="block hover:text-primary-600">Luyện tập Minna no Nihongo (miễn phí)</a>
              <a href={PORTAL_URL} className="block hover:text-primary-600">Cổng học viên (điểm danh, học phí, bài tập)</a>
              <a href="/posts/" className="block hover:text-primary-600">Bài viết học tiếng Nhật</a>
              <a href={`${base}#faq`} className="block hover:text-primary-600">Câu hỏi thường gặp</a>
              <a href={`${base}#register`} className="block hover:text-primary-600">Đăng ký học thử miễn phí</a>
            </nav>
          </div>
          <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">© {BUILD_YEAR} IMEJI日本語教室. All rights reserved.</p>
        </footer>

        {/* Nút Zalo nổi */}
        <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-end gap-3">
          <a
            href={ZALO_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackZalo("floating_button")}
            aria-label="Nhắn tin Zalo với Thầy Quang"
            className="w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow-xl ring-2 ring-white/80 hover:scale-110 active:scale-95 transition-transform"
          >
            <MessageCircle size={24} />
          </a>
        </div>

        <BottomNav base={base} onOpenQuiz={openQuiz} />

        <PlacementQuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} onSelectLevel={onQuizResult} />
      </div>
    </QuizContext.Provider>
  );
};
