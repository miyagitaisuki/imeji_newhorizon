import React, { useState } from "react";
import { Send, Check, Phone, Mail, MapPin, MessageCircle, Globe, Copy, CheckCheck } from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  formData: {
    fullName: string;
    phone: string;
    currentLevel: string;
    targetJlpt: string;
    notes: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      fullName: string;
      phone: string;
      currentLevel: string;
      targetJlpt: string;
      notes: string;
    }>
  >;
}

export const ContactFormSection: React.FC<Props> = ({ formData, setFormData }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // Ignore if canvas not supported
    }

    setTimeout(() => setFormSubmitted(false), 6000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("0868608647");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <section id="register" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Form */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2">
            <span>Tư vấn 1 - 1 miễn phí</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Đăng ký nhận lộ trình học
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            Điền thông tin để được ThS. Nguyễn Thanh Quang tư vấn trực tiếp lộ trình học và xếp lớp phù hợp nhất với thời gian biểu của bạn.
          </p>

          {formSubmitted ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Check size={28} />
              </div>
              <h4 className="font-bold text-emerald-900 dark:text-emerald-100 text-base sm:text-lg">
                Gửi thông tin thành công!
              </h4>
              <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 max-w-sm mx-auto">
                Cảm ơn bạn {formData.fullName || "bạn"}! Thầy Quang sẽ chủ động liên hệ qua Zalo / số điện thoại{" "}
                <span className="font-bold">{formData.phone}</span> để tư vấn lớp trong vòng 24 giờ.
              </p>
              <div className="pt-2">
                <a
                  href="https://zalo.me/0868608647"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                >
                  <MessageCircle size={14} /> Nhắn tin Zalo trực tiếp ngay
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Họ và tên của bạn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Ví dụ: Nguyễn Văn Nam"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Số điện thoại / Zalo nhận tư vấn <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  placeholder="Ví dụ: 0868 608 647"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Trình độ hiện tại
                  </label>
                  <select
                    value={formData.currentLevel}
                    onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition min-h-[44px]"
                  >
                    <option>Chưa biết gì (Người mới)</option>
                    <option>Đã thuộc bảng chữ cái</option>
                    <option>Đã hoàn thành N5</option>
                    <option>Đã hoàn thành N4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mục tiêu mong muốn
                  </label>
                  <select
                    value={formData.targetJlpt}
                    onChange={(e) => setFormData({ ...formData, targetJlpt: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition min-h-[44px]"
                  >
                    <option>JLPT N5</option>
                    <option>JLPT N4</option>
                    <option>JLPT N3</option>
                    <option>JLPT N2</option>
                    <option>Giao tiếp làm việc</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ghi chú thêm (khung giờ rảnh, thắc mắc...)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Mình rảnh tối 2-4-6, muốn hỏi lớp học có kèm tài liệu Anki không..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-3.5 sm:py-4 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition shadow-lg shadow-primary-500/25 active:scale-[0.98] flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Send size={16} />
                <span>Xác nhận gửi thông tin tư vấn</span>
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                🔒 Cam kết bảo mật thông tin cá nhân. Thầy Quang sẽ trực tiếp giải đáp mọi thắc mắc.
              </p>
            </form>
          )}
        </div>

        {/* Right Info Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-1">
                Liên hệ trực tiếp
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                ThS. Nguyễn Thanh Quang
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Giảng viên Đại học Quy Nhơn (QNU) ・ JLPT N1 Holder
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Phone */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <a
                  href="tel:0868608647"
                  className="flex items-center gap-3 group flex-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Hotline / Zalo</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition">
                      0868 608 647
                    </p>
                  </div>
                </a>
                <button
                  onClick={handleCopyPhone}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  title="Sao chép số điện thoại"
                >
                  {copiedPhone ? <CheckCheck size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Email */}
              <a
                href="mailto:nguyenthanhquang@qnu.edu.vn"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:border-primary-500 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] text-slate-400">Email công vụ</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-600 transition">
                    nguyenthanhquang@qnu.edu.vn
                  </p>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Địa chỉ lớp học</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    80 Võ Mười, Quy Nhơn, Bình Định
                  </p>
                </div>
              </div>
            </div>

            {/* Quick 1-tap mobile action buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href="tel:0868608647"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm active:scale-95"
              >
                <Phone size={15} /> Gọi điện ngay
              </a>
              <a
                href="https://zalo.me/0868608647"
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm active:scale-95"
              >
                <MessageCircle size={15} /> Nhắn Zalo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
