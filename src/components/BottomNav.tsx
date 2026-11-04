import React from "react";
import { BookOpen, Map, Sparkles, Send, MessageCircle } from "lucide-react";
import { ZALO_URL } from "../data/siteInfo";
import { trackZalo } from "../lib/analytics";

interface Props {
  onOpenQuiz: () => void;
}

export const BottomNav: React.FC<Props> = ({ onOpenQuiz }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-1 pointer-events-none">
      <div className="max-w-md mx-auto glass-panel rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800/90 p-1.5 flex items-center justify-around pointer-events-auto backdrop-blur-xl">
        <a
          href="#courses"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-primary-600 active:scale-90 transition"
        >
          <BookOpen size={18} />
          <span className="text-[10px] font-medium mt-0.5">Khóa học</span>
        </a>

        <a
          href="#roadmap"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-primary-600 active:scale-90 transition"
        >
          <Map size={18} />
          <span className="text-[10px] font-medium mt-0.5">Lộ trình</span>
        </a>

        {/* Level Quiz Button */}
        <button
          onClick={onOpenQuiz}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-amber-600 dark:text-amber-400 active:scale-90 transition relative"
        >
          <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <Sparkles size={18} />
          <span className="text-[10px] font-bold mt-0.5">Test trình độ</span>
        </button>

        {/* Quick Zalo */}
        <a
          href={ZALO_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackZalo("bottom_nav")}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-blue-600 dark:text-blue-400 active:scale-90 transition"
        >
          <MessageCircle size={18} />
          <span className="text-[10px] font-medium mt-0.5">Zalo</span>
        </a>

        {/* Primary CTA button */}
        <a
          href="#register"
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-500/30 active:scale-95 transition"
        >
          <Send size={13} />
          <span>Học thử</span>
        </a>
      </div>
    </div>
  );
};
