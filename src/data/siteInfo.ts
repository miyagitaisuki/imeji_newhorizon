// Thông tin liên hệ, lịch học và khai giảng dùng chung cho toàn trang.
// Sửa ở đây là cập nhật mọi nơi hiển thị.
import { useEffect, useState } from "react";

// Địa chỉ chính thức của website (không có dấu / ở cuối)
export const SITE_URL = "https://imejiquynhon.com";
export const SITE_NAME = "Tiếng Nhật Thầy Quang Quy Nhơn";

// Ngày build trang (vite.config.ts gán). Dùng để HTML dựng sẵn và lần hiển thị đầu trên trình duyệt khớp nhau.
const BUILD_DATE = new Date(__BUILD_DATE__);
export const BUILD_YEAR = BUILD_DATE.getFullYear();

export const PHONE = "0868608647";
export const PHONE_DISPLAY = "086 860 8647";
export const ZALO_URL = `https://zalo.me/${PHONE}`;
export const EMAIL = "lienhe@imejiquynhon.com";

// Hệ sinh thái học tập: game luyện tập (imeji_dominion) và cổng học viên (eduscan)
export const PRACTICE_URL = "/luyen-tap/";
export const PORTAL_URL = "https://app.imejiquynhon.com/";

export const ADDRESS_STREET = "80 Võ Mười";
export const ADDRESS_WARD = "P. Quy Nhơn Nam";
export const ADDRESS_PROVINCE = "Gia Lai";
export const ADDRESS_FULL = `${ADDRESS_STREET}, ${ADDRESS_WARD}, ${ADDRESS_PROVINCE}`;

// Chuỗi tìm kiếm cho Google Maps. Dùng tên đường + "Quy Nhơn" vì Google vẫn nhận diện tốt
// địa danh này; tên phường mới sau sáp nhập có thể chưa được bản đồ cập nhật.
const MAP_QUERY = "80 Võ Mười, Quy Nhơn, Gia Lai, Việt Nam";
export const MAP_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;
export const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&hl=vi&z=17&output=embed`;

export const SCHEDULE_SHORT = "2–3 buổi/tuần ・ 90 phút/buổi";
export const SCHEDULE_DAYS = "Thứ 2, Thứ 4 hoặc Thứ 6";
export const FREE_TRIAL = "Học thử miễn phí 2 buổi";

// Ngày khai giảng lớp tiếp theo (YYYY-MM-DD). Sau ngày này trang tự chuyển sang
// "Liên hệ để biết lịch khai giảng", nên nhớ cập nhật khi mở lớp mới.
export const NEXT_START_DATE = "2026-11-16";

export function nextStartLabel(today: Date = new Date()): string | null {
  const [y, m, d] = NEXT_START_DATE.split("-").map(Number);
  const start = new Date(y, m - 1, d, 23, 59, 59);
  if (today > start) return null;
  const weekday = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][start.getDay()];
  return `${weekday}, ${d}/${m}/${y}`;
}

// Nhãn ngày khai giảng dùng trong giao diện: lần hiển thị đầu theo ngày build (khớp HTML dựng sẵn),
// sau đó cập nhật theo ngày hiện tại của người xem (tự ẩn khi đã qua ngày khai giảng).
export function useNextStartLabel(): string | null {
  const [label, setLabel] = useState(() => nextStartLabel(BUILD_DATE));
  useEffect(() => setLabel(nextStartLabel()), []);
  return label;
}

// Chính sách cam kết đầu ra (dùng thống nhất ở mọi chỗ trên trang)
export const COMMITMENT_TITLE = "Cam kết chuẩn đầu ra JLPT";
export const COMMITMENT_DETAIL =
  "Đi học từ 90% số buổi trở lên và làm đủ các bài thi thử → được học lại miễn phí 1 khóa nếu chưa thi đỗ.";
