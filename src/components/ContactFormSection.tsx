import React, { useState } from "react";
import { Send, Check, Phone, Mail, MapPin, MessageCircle, Copy, CheckCheck } from "lucide-react";
import { getSource, trackEvent, trackCall, trackZalo } from "../lib/analytics";
import { PHONE, PHONE_DISPLAY, ZALO_URL, EMAIL, ADDRESS_FULL, FREE_TRIAL, SCHEDULE_SHORT, useScheduleDays, useNextStartLabel } from "../data/siteInfo";
import { PrivacyNotice } from "./PrivacyNotice";

// Nơi nhận đăng ký chính: API của eduscan (VD https://app.imejiquynhon.com/api/leads/public)
const LEADS_ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined;
// Dự phòng: URL web app của Google Apps Script (xem google-apps-script/README.md)
const SHEET_ENDPOINT = import.meta.env.VITE_SHEET_ENDPOINT as string | undefined;

type SendResult = "ok" | "retry" | { error: string };

// Gửi lên eduscan. Lỗi mạng hoặc máy chủ (5xx) thì "retry" để dùng đường dự phòng;
// lỗi do dữ liệu (4xx) thì trả thông báo của máy chủ, không ghi sang đường dự phòng.
async function sendToEduscan(url: string, payload: Record<string, unknown>): Promise<SendResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (res.ok && result?.ok) return "ok";
    if (res.status >= 400 && res.status < 500 && result?.error) return { error: result.error };
    return "retry";
  } catch {
    return "retry";
  }
}

// Gửi text/plain để là "simple request" (không cần preflight). Apps Script trả JSON
// {ok: true} khi ghi Sheet thành công, nên ta đọc phản hồi để biết chắc đã lưu.
async function sendToSheet(url: string, payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    const result = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    return res.ok && !!result?.ok;
  } catch {
    return false;
  }
}

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
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [consent, setConsent] = useState(false);
  // Ô bẫy bot: người thật không thấy nên để trống
  const [website, setWebsite] = useState("");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const startLabel = useNextStartLabel();
  const scheduleDays = useScheduleDays();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!LEADS_ENDPOINT && !SHEET_ENDPOINT) {
      setSubmitError(`Chưa cấu hình nơi nhận thông tin. Vui lòng gọi trực tiếp ${PHONE}.`);
      return;
    }
    if (!consent) {
      setSubmitError("Vui lòng đồng ý với chính sách bảo vệ dữ liệu cá nhân để gửi đăng ký.");
      return;
    }

    setSending(true);
    setSubmitError("");
    const payload = {
      ...formData,
      consent: true,
      source: getSource(),
      submittedAt: new Date().toISOString(),
    };

    let saved = false;
    if (LEADS_ENDPOINT) {
      const r = await sendToEduscan(LEADS_ENDPOINT, { ...payload, website });
      if (r === "ok") saved = true;
      else if (r !== "retry") {
        setSubmitError(r.error);
        setSending(false);
        return;
      }
    }
    // Chưa lưu được vào eduscan (hoặc chưa cấu hình): ghi vào Google Sheet để không mất đăng ký
    if (!saved && SHEET_ENDPOINT) saved = await sendToSheet(SHEET_ENDPOINT, payload);
    if (!saved) {
      setSubmitError(
        `Chưa gửi được thông tin. Vui lòng thử lại, hoặc gọi/nhắn Zalo ${PHONE_DISPLAY} để được tư vấn ngay.`
      );
      setSending(false);
      return;
    }
    setSending(false);
    setFormSubmitted(true);
    trackEvent("generate_lead", { target_jlpt: formData.targetJlpt });

    // Pháo giấy chúc mừng (nạp khi cần để trang ban đầu nhẹ hơn)
    import("canvas-confetti")
      .then(({ default: confetti }) => confetti({ particleCount: 70, spread: 60, origin: { y: 0.8 } }))
      .catch(() => {
        // trình duyệt không hỗ trợ canvas thì bỏ qua
      });
  };

  const handleNewSubmission = () => {
    setFormData((prev) => ({ ...prev, fullName: "", phone: "", notes: "" }));
    setConsent(false);
    setFormSubmitted(false);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(PHONE);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <section id="register" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Form */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">
            <span>{FREE_TRIAL} ・ Tư vấn 1 - 1</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Đăng ký học thử miễn phí
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-4">
            Điền thông tin để được ThS. Nguyễn Thanh Quang tư vấn lộ trình và xếp 2 buổi học thử miễn phí, phù hợp với thời gian biểu của bạn.
          </p>
          <ul className="mb-6 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <Check size={15} className="text-success-500 flex-shrink-0 mt-0.5" />
              <span>Lịch học: {SCHEDULE_SHORT}, vào {scheduleDays}</span>
            </li>
            {startLabel && (
              <li className="flex items-start gap-2">
                <Check size={15} className="text-success-500 flex-shrink-0 mt-0.5" />
                <span>
                  Khai giảng lớp tiếp theo: <strong className="text-slate-900">{startLabel}</strong>
                </span>
              </li>
            )}
          </ul>

          {formSubmitted ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-success-50 border border-success-200 text-center space-y-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-success-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Check size={28} />
              </div>
              <h4 className="font-bold text-success-900 text-base sm:text-lg">
                Gửi thông tin thành công!
              </h4>
              <p className="text-xs sm:text-sm text-success-700 max-w-sm mx-auto">
                Cảm ơn bạn {formData.fullName || "bạn"}! Quang Sensei sẽ chủ động liên hệ qua Zalo / số điện thoại{" "}
                <span className="font-bold">{formData.phone}</span> để tư vấn lớp trong vòng 24 giờ.
              </p>
              <div className="pt-2">
                <a
                  href={ZALO_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackZalo("form_success")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-success-600 text-white text-xs font-semibold hover:bg-success-700 transition"
                >
                  <MessageCircle size={14} /> Nhắn tin Zalo trực tiếp ngay
                </a>
                <button
                  type="button"
                  onClick={handleNewSubmission}
                  className="block mx-auto mt-3 text-xs text-success-800 underline underline-offset-2"
                >
                  Đăng ký cho người khác
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </label>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Họ và tên của bạn <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Ví dụ: Nguyễn Văn Nam"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Số điện thoại / Zalo nhận tư vấn <span className="text-danger-500">*</span>
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  placeholder="Ví dụ: 09xx xxx xxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Trình độ hiện tại
                  </label>
                  <select
                    value={formData.currentLevel}
                    onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition min-h-[44px]"
                  >
                    <option>Chưa biết gì (Người mới)</option>
                    <option>Đã thuộc bảng chữ cái</option>
                    <option>Đã hoàn thành N5</option>
                    <option>Đã hoàn thành N4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mục tiêu mong muốn
                  </label>
                  <select
                    value={formData.targetJlpt}
                    onChange={(e) => setFormData({ ...formData, targetJlpt: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition min-h-[44px]"
                  >
                    <option>JLPT N5</option>
                    <option>JLPT N4</option>
                    <option>JLPT N3</option>
                    <option>Giao tiếp làm việc</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ghi chú thêm (khung giờ rảnh, thắc mắc...)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Mình rảnh tối thứ 2-4-6, muốn hỏi lớp học có kèm tài liệu Anki không..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition resize-none"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="consent"
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 flex-shrink-0"
                />
                <label htmlFor="consent" className="text-xs text-slate-600 leading-relaxed">
                  Tôi đồng ý cho IMEJI日本語教室 sử dụng thông tin trên để liên hệ tư vấn và xếp lớp, theo{" "}
                  <button
                    type="button"
                    onClick={() => setPrivacyOpen(true)}
                    className="text-primary-600 font-semibold underline underline-offset-2"
                  >
                    chính sách bảo vệ dữ liệu cá nhân
                  </button>
                  . <span className="text-danger-500">*</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full mt-3 py-3.5 sm:py-4 rounded-2xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold text-sm transition shadow-lg shadow-primary-500/25 active:scale-[0.98] flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Send size={16} />
                <span>{sending ? "Đang gửi..." : "Gửi đăng ký học thử miễn phí"}</span>
              </button>

              {submitError && (
                <p role="alert" className="text-xs text-danger-600 text-center">
                  {submitError}
                </p>
              )}

              <p className="text-[11px] text-slate-400 text-center">
                🔒 Thông tin chỉ dùng để tư vấn và xếp lớp, không chia sẻ cho bên thứ ba.
              </p>
            </form>
          )}
        </div>

        {/* Right Info Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-1">
                Liên hệ trực tiếp
              </p>
              <h3 className="text-2xl font-bold text-slate-900">
                ThS. Nguyễn Thanh Quang
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Giảng viên Trường Đại học Quy Nhơn (QNU) ・ JLPT N1 Holder
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Phone */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/50 border border-slate-200/80">
                <a
                  href={`tel:${PHONE}`}
                  onClick={() => trackCall("contact_card")}
                  className="flex items-center gap-3 group flex-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-success-500/10 text-success-600 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Hotline / Zalo</p>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition">
                      {PHONE_DISPLAY}
                    </p>
                  </div>
                </a>
                <button
                  onClick={handleCopyPhone}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                  title="Sao chép số điện thoại"
                >
                  {copiedPhone ? <CheckCheck size={16} className="text-success-500" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Email */}
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/50 border border-slate-200/80 hover:border-primary-500 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] text-slate-400">Email</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-primary-600 transition">
                    {EMAIL}
                  </p>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-warning-500/10 text-warning-600 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Địa chỉ lớp học</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {ADDRESS_FULL}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick 1-tap mobile action buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`tel:${PHONE}`}
                onClick={() => trackCall("contact_button")}
                className="py-3 px-4 rounded-xl bg-success-600 hover:bg-success-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm active:scale-95"
              >
                <Phone size={15} /> Gọi điện ngay
              </a>
              <a
                href={ZALO_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackZalo("contact_button")}
                className="py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm active:scale-95"
              >
                <MessageCircle size={15} /> Nhắn Zalo
              </a>
            </div>
          </div>
        </div>
      </div>
      <PrivacyNotice isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </section>
  );
};
