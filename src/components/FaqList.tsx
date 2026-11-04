import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Faq } from "../data/courseData";
import { useOpenQuiz } from "./Layout";

// Danh sách câu hỏi thường gặp dạng mở/đóng.
// Mọi câu trả lời luôn có sẵn trong HTML (chỉ ẩn bằng CSS khi đóng) để Google đọc được và khớp
// với dữ liệu FAQPage trong src/seo.ts.
export const FaqList: React.FC<{ items: Faq[]; compact?: boolean }> = ({ items, compact = false }) => {
  const [active, setActive] = useState<number | null>(0);
  const openQuiz = useOpenQuiz();
  const pad = compact ? "px-5" : "px-5 sm:px-6";

  return (
    <div className="space-y-3.5">
      {items.map((faq, idx) => {
        const open = active === idx;
        const panelId = `faq-panel-${idx}`;
        return (
          <div
            key={faq.q}
            className="glass-panel rounded-2xl overflow-hidden transition-colors border border-slate-200 dark:border-slate-800"
          >
            <h3>
              <button
                onClick={() => setActive(open ? null : idx)}
                aria-expanded={open}
                aria-controls={panelId}
                className={`w-full ${pad} py-4 text-left flex justify-between items-center gap-4 text-sm sm:text-base font-semibold text-slate-900 dark:text-white min-h-[48px]`}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 text-slate-400 flex-shrink-0 ${open ? "rotate-180 text-primary-500" : ""}`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              className={`grid transition-[grid-template-rows] duration-200 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden" inert={!open}>
                <div className={`${pad} pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3`}>
                  <p>{faq.a}</p>
                  {faq.link && (
                    <a
                      href={faq.link.href}
                      {...(faq.link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="inline-block font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {faq.link.label} →
                    </a>
                  )}
                  {faq.action === "quiz" && (
                    <button onClick={openQuiz} className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                      Làm trắc nghiệm chọn lớp 30 giây →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
