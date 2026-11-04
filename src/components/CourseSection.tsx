import React, { useState } from "react";
import { Clock, Check, Sparkles, ArrowRight, BookOpen, CalendarDays, Gift } from "lucide-react";
import { COURSES, CourseData } from "../data/courseData";
import { SCHEDULE_SHORT, useScheduleDays, FREE_TRIAL, useNextStartLabel } from "../data/siteInfo";

interface Props {
  onSelectCourse: (course: CourseData) => void;
  onOpenQuiz: () => void;
}

export const CourseSection: React.FC<Props> = ({ onSelectCourse, onOpenQuiz }) => {
  const [activeTab, setActiveTab] = useState<"all" | "n5" | "n4" | "n3">("all");

  const startLabel = useNextStartLabel();
  const scheduleDays = useScheduleDays();

  const displayedCourses =
    activeTab === "all" ? COURSES : COURSES.filter((c) => c.id === activeTab);

  return (
    <section id="courses" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 mb-3">
          <BookOpen size={13} />
          <span>Chương trình đào tạo</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Các khóa học tiếng Nhật tuyển sinh
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-3 max-w-lg mx-auto">
          Học phí minh bạch 900.000 VNĐ/tháng, đào tạo chuẩn JLPT ngay tại Quy Nhơn.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-medium">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 text-slate-700">
            <CalendarDays size={13} className="text-primary-600" />
            {SCHEDULE_SHORT} ・ {scheduleDays}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-50 border border-success-200 text-success-800">
            <Gift size={13} />
            {FREE_TRIAL}
          </span>
          {startLabel && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning-50 border border-warning-200 text-warning-800">
              Khai giảng: {startLabel}
            </span>
          )}
        </div>

        {/* Mobile Tab Switcher (Thumb-friendly on phones) */}
        <div className="md:hidden mt-6 flex items-center justify-center p-1 rounded-2xl bg-slate-200/80 max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "all"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-slate-600"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab("n5")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "n5"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-slate-600"
            }`}
          >
            N5 Cơ bản
          </button>
          <button
            onClick={() => setActiveTab("n4")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "n4"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-slate-600"
            }`}
          >
            N4 Tăng tốc
          </button>
          <button
            onClick={() => setActiveTab("n3")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "n3"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-slate-600"
            }`}
          >
            N3 Chuyên sâu
          </button>
        </div>

        {/* Level test callout for indecisive visitors */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <span>Chưa biết nên chọn khóa nào?</span>
          <button
            onClick={onOpenQuiz}
            className="text-primary-600 font-semibold underline underline-offset-2 hover:text-primary-700 flex items-center gap-1"
          >
            <Sparkles size={12} /> Làm trắc nghiệm 30s
          </button>
        </div>
      </div>

      {/* Grid of Courses */}
      <div className={`grid grid-cols-1 ${activeTab === "all" ? "md:grid-cols-3" : "max-w-md mx-auto"} gap-6 sm:gap-8 items-stretch`}>
        {displayedCourses.map((course) => (
          <div
            key={course.id}
            className={`glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative ${
              course.highlight
                ? "border-2 border-primary-500 shadow-xl bg-gradient-to-b from-white to-primary-50/40 md:-translate-y-2"
                : "border-slate-200 hover:border-primary-400"
            }`}
          >
            {course.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary-600 text-white font-semibold text-[11px] shadow-sm tracking-wide uppercase flex items-center gap-1">
                <Sparkles size={11} />
                <span>{course.tag}</span>
              </div>
            )}

            <div>
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    course.highlight
                      ? "bg-primary-100 text-primary-700"
                      : "bg-primary-100 text-primary-700"
                  }`}
                >
                  {course.tag}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock size={13} /> {course.duration}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                <a href={`/khoa-hoc/${course.id}/`} className="hover:text-primary-600">
                  {course.title}
                </a>
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                {course.targetAudience}
              </p>

              <div className="mb-6 pb-6 border-b border-slate-200">
                <span
                  className={`text-3xl font-extrabold tracking-tight ${
                    course.highlight
                      ? "text-primary-600"
                      : "text-slate-900"
                  }`}
                >
                  {course.price}
                </span>
                <span className="text-xs text-slate-500 ml-1">VNĐ / tháng</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                {course.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      className="text-primary-500 flex-shrink-0 mt-0.5"
                    />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={`/khoa-hoc/${course.id}/`}
              className="mt-6 text-center text-xs sm:text-sm font-semibold text-primary-600 hover:underline"
            >
              Xem chi tiết lộ trình {course.title.replace("Khóa ", "")} →
            </a>
            <button
              onClick={() => onSelectCourse(course)}
              className={`mt-3 w-full py-3.5 rounded-2xl font-medium text-xs sm:text-sm text-center transition flex items-center justify-center gap-2 active:scale-95 ${
                course.highlight
                  ? "bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/25"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-900"
              }`}
            >
              <span>Đăng ký học thử miễn phí</span>
              <ArrowRight size={15} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
