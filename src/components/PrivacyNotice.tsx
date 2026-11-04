import React, { useEffect } from "react";
import { X, ShieldCheck } from "lucide-react";
import { EMAIL, PHONE_DISPLAY, ADDRESS_FULL } from "../data/siteInfo";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Thông báo xử lý dữ liệu cá nhân hiển thị khi người dùng bấm vào liên kết trong form đăng ký.
export const PrivacyNotice: React.FC<Props> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-slate-200 bg-white text-sm text-slate-700"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          aria-label="Đóng"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-primary-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck size={16} />
          <span>Bảo vệ dữ liệu cá nhân</span>
        </div>
        <h3 id="privacy-title" className="text-xl font-bold text-slate-900 mb-4">
          Chính sách xử lý dữ liệu cá nhân
        </h3>

        <div className="space-y-4 leading-relaxed">
          <section>
            <h4 className="font-semibold text-slate-900">1. Bên xử lý dữ liệu</h4>
            <p>
              IMEJI日本語教室 (Lớp học tiếng Nhật thầy Quang, ThS. Nguyễn Thanh Quang), {ADDRESS_FULL}. Liên hệ: {EMAIL} ・ {PHONE_DISPLAY}.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">2. Dữ liệu thu thập</h4>
            <p>
              Họ tên, số điện thoại/Zalo, trình độ hiện tại, mục tiêu học, ghi chú bạn tự nhập, thời điểm gửi và nguồn truy
              cập (ví dụ: bạn đến từ bài đăng Facebook nào).
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">3. Mục đích sử dụng</h4>
            <p>
              Chỉ dùng để liên hệ tư vấn, xếp buổi học thử, xếp lớp và thông báo lịch học cho bạn. Không dùng cho mục đích
              khác nếu chưa có sự đồng ý của bạn.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">4. Lưu trữ và chia sẻ</h4>
            <p>
              Dữ liệu được lưu trên Google Sheet riêng của lớp, chỉ giảng viên phụ trách được truy cập. Lớp không bán và
              không chia sẻ dữ liệu của bạn cho bên thứ ba. Dữ liệu được giữ trong thời gian cần thiết cho việc tư vấn và
              quản lý lớp, và sẽ được xóa khi bạn yêu cầu.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">5. Đo lường truy cập</h4>
            <p>
              Trang có thể dùng Google Analytics và Meta Pixel để thống kê lượt truy cập và hiệu quả quảng cáo (ví dụ: số
              người bấm nút Zalo). Các công cụ này không nhận họ tên hay số điện thoại bạn nhập vào form.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900">6. Quyền của bạn</h4>
            <p>
              Bạn có quyền xem, chỉnh sửa, yêu cầu xóa dữ liệu hoặc rút lại sự đồng ý bất cứ lúc nào bằng cách gửi email tới{" "}
              <a href={`mailto:${EMAIL}`} className="text-primary-600 underline">
                {EMAIL}
              </a>{" "}
              hoặc nhắn Zalo {PHONE_DISPLAY}. Yêu cầu sẽ được xử lý theo quy định pháp luật Việt Nam về bảo vệ dữ liệu cá
              nhân.
            </p>
          </section>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition"
        >
          Đã hiểu
        </button>
      </div>
    </div>
  );
};
