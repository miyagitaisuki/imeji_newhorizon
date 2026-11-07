import React, { useEffect, useState } from "react";
import { X, Sparkles, CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";
import { trackEvent } from "../lib/analytics";
import { FREE_TRIAL } from "../data/siteInfo";
import { MONTHLY_FEE, formatVnd } from "../data/courseData";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectLevel: (level: string, targetJlpt: string) => void;
}

interface Question {
  id: number;
  question: string;
  options: {
    label: string;
    level: string;
    target: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Bạn đã từng tiếp xúc với tiếng Nhật trước đây chưa?",
    options: [
      { label: "Chưa từng, bắt đầu từ con số 0", level: "Chưa biết gì (Người mới)", target: "JLPT N5" },
      { label: "Đã thuộc 2 bảng chữ cái Hiragana/Katakana", level: "Đã thuộc bảng chữ cái", target: "JLPT N5" },
      { label: "Đã học xong 25 bài Minna no Nihongo (hoặc tương đương N5)", level: "Đã hoàn thành N5", target: "JLPT N4" },
      { label: "Đã có chứng chỉ N4 hoặc học xong 50 bài Minna", level: "Đã hoàn thành N4", target: "JLPT N3" },
    ],
  },
  {
    id: 2,
    question: "Mục tiêu chính khi học tiếng Nhật của bạn là gì?",
    options: [
      { label: "Thi lấy chứng chỉ chuẩn đầu ra đại học / du học", level: "Tùy chọn", target: "JLPT N4" },
      { label: "Ứng tuyển công ty Nhật hoặc làm việc với khách hàng Nhật", level: "Tùy chọn", target: "JLPT N3" },
      { label: "Phục vụ sở thích xem anime, manga, văn hóa Nhật", level: "Tùy chọn", target: "JLPT N5" },
      { label: "Săn học bổng du học tại Nhật Bản", level: "Tùy chọn", target: "JLPT N3" },
    ],
  },
];

const JLPT_RANK: Record<string, number> = { "JLPT N5": 5, "JLPT N4": 4, "JLPT N3": 3 };
const jlptRank = (target: string) => JLPT_RANK[target] ?? 5;

export const PlacementQuizModal: React.FC<Props> = ({ isOpen, onClose, onSelectLevel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ level: string; target: string }[]>([]);
  const [result, setResult] = useState<{ level: string; target: string; courseName: string; reason: string } | null>(null);

  // Mỗi lần mở: bắt đầu lại từ câu 1 và ghi nhận sự kiện bắt đầu trắc nghiệm
  useEffect(() => {
    if (!isOpen) return;
    setCurrentStep(0);
    setSelectedAnswers([]);
    setResult(null);
    trackEvent("quiz_start");
  }, [isOpen]);

  // Đóng modal khi nhấn phím Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectOption = (opt: { level: string; target: string }) => {
    const updated = [...selectedAnswers, opt];
    setSelectedAnswers(updated);

    if (currentStep + 1 < QUESTIONS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate recommendation
      const firstAns = updated[0];
      const secondAns = updated[1];

      let recommendedCourse = "Khóa N5 Cơ Bản";
      const recommendedLevel = firstAns.level;
      let reason = "Khởi đầu vững vàng với phát âm chuẩn Tokyo và 25 bài ngữ pháp sơ cấp.";

      if (firstAns.level === "Đã hoàn thành N5") {
        recommendedCourse = "Khóa N4 Tăng Tốc";
        reason = "Bạn đã có nền N5, tiếp tục bứt phá N4 để tự tin giao tiếp phản xạ và chuẩn bị thi chứng chỉ.";
      } else if (firstAns.level === "Đã hoàn thành N4") {
        recommendedCourse = "Khóa N3 Chuyên Sâu";
        reason = "Trình độ trung cấp chuyên sâu mở ra cơ hội làm việc tại doanh nghiệp Nhật Bản.";
      }

      // Câu 2 (mục tiêu) quyết định JLPT đích, nhưng không hạ thấp hơn mức tối thiểu
      // của trình độ hiện tại (ví dụ đã xong N4 thì không đề xuất mục tiêu N5).
      const minimumTarget = firstAns.target || "JLPT N5";
      const goalTarget = secondAns?.target || minimumTarget;
      const recommendedTarget =
        jlptRank(goalTarget) < jlptRank(minimumTarget) ? goalTarget : minimumTarget;

      trackEvent("quiz_complete", {
        course: recommendedCourse,
        target_jlpt: recommendedTarget,
        goal_jlpt: goalTarget,
      });
      setResult({
        level: recommendedLevel,
        target: recommendedTarget,
        courseName: recommendedCourse,
        reason,
      });
    }
  };

  const handleApplyAndRegister = () => {
    if (result) {
      onSelectLevel(result.level, result.target);
      onClose();
      // Scroll smoothly to register form
      // Trang nào cũng có form #register; nếu không có thì về form ở trang chủ
      const el = document.getElementById("register");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.location.href = "/#register";
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setResult(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-slate-200 bg-white overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Đóng bảng trắc nghiệm"
        >
          <X size={20} />
        </button>

        {!result ? (
          <div>
            <div className="flex items-center gap-2 text-primary-600 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={16} />
              <span>Trắc nghiệm nhanh (30 giây)</span>
            </div>
            <h3 id="quiz-modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              Khám phá khóa học phù hợp với bạn
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Câu {currentStep + 1} / {QUESTIONS.length}: Chọn phương án miêu tả chính xác nhất tình trạng của bạn
            </p>

            {/* Question Card */}
            <div className="space-y-4">
              <p className="font-semibold text-sm sm:text-base text-slate-800">
                {QUESTIONS[currentStep].question}
              </p>

              <div className="space-y-2.5">
                {QUESTIONS[currentStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    className="w-full text-left p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-primary-500 hover:bg-primary-50/50 transition-all flex items-center justify-between group active:scale-[0.98]"
                  >
                    <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-primary-600">
                      {opt.label}
                    </span>
                    <ArrowRight size={16} className="text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mt-6">
              {QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStep
                      ? "w-8 bg-primary-600"
                      : idx < currentStep
                      ? "w-4 bg-success-500"
                      : "w-4 bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-2 space-y-5 animate-fade-in" aria-live="polite">
            <div className="w-14 h-14 rounded-2xl bg-success-500/10 text-success-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 mb-2">
                Đề xuất dành riêng cho bạn
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {result.courseName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                {result.reason}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Trình độ hiện tại:</span>
                <span className="font-semibold text-slate-800">{result.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mục tiêu đề xuất:</span>
                <span className="font-semibold text-primary-600">{result.target}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Học phí:</span>
                <span className="font-bold text-slate-900">{formatVnd(MONTHLY_FEE)} VNĐ / tháng</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ưu đãi:</span>
                <span className="font-semibold text-success-600">{FREE_TRIAL}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleApplyAndRegister}
                className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition shadow-lg shadow-primary-500/25 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Đăng ký học thử miễn phí</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={handleReset}
                className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100 flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>Làm lại</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
