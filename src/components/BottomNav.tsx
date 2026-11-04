import React from "react";
import { Gamepad2, LogIn, Sparkles, Send } from "lucide-react";
import { PORTAL_URL, PRACTICE_URL } from "../data/siteInfo";
import { trackEcosystem } from "../lib/analytics";

interface Props {
  base: string; // "" trên trang chủ, "/" trên trang con
  onOpenQuiz: () => void;
}

export const BottomNav: React.FC<Props> = ({ base, onOpenQuiz }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-1 pointer-events-none">
      <div className="max-w-md mx-auto glass-panel rounded-2xl shadow-2xl border border-slate-200/90 p-1.5 flex items-center justify-around pointer-events-auto backdrop-blur-xl">
        <a
          href={PRACTICE_URL}
          onClick={() => trackEcosystem("practice", "bottom_nav")}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-primary-600 active:scale-90 transition"
        >
          <Gamepad2 size={18} />
          <span className="text-[10px] font-bold mt-0.5 whitespace-nowrap">Luyện tập</span>
        </a>

        {/* Level Quiz Button */}
        <button
          onClick={onOpenQuiz}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-warning-600 active:scale-90 transition relative"
        >
          <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-warning-500 animate-ping" />
          <Sparkles size={18} />
          <span className="text-[10px] font-bold mt-0.5 whitespace-nowrap">Test trình độ</span>
        </button>

        {/* Cổng học viên (eduscan) */}
        <a
          href={PORTAL_URL}
          onClick={() => trackEcosystem("portal", "bottom_nav")}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-primary-600 active:scale-90 transition"
        >
          <LogIn size={18} />
          <span className="text-[10px] font-bold mt-0.5 whitespace-nowrap">Học viên</span>
        </a>

        {/* Primary CTA button */}
        <a
          href={`${base}#register`}
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-500/30 active:scale-95 transition"
        >
          <Send size={13} />
          <span>Học thử</span>
        </a>
      </div>
    </div>
  );
};
