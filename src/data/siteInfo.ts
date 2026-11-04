// Thông tin liên hệ, lịch học và khai giảng dùng chung cho toàn trang.
// Sửa ở đây là cập nhật mọi nơi hiển thị.
import { useEffect, useState, useSyncExternalStore } from "react";

// Địa chỉ chính thức của website (không có dấu / ở cuối)
export const SITE_URL = "https://imejiquynhon.com";
export const SITE_NAME = "IMEJI日本語教室";
export const SITE_TAGLINE = "Lớp học tiếng Nhật thầy Quang";

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

export function nextStartLabel(today: Date = new Date(), startDate: string = NEXT_START_DATE): string | null {
  const [y, m, d] = startDate.split("-").map(Number);
  const start = new Date(y, m - 1, d, 23, 59, 59);
  if (today > start) return null;
  const weekday = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][start.getDay()];
  return `${weekday}, ${d}/${m}/${y}`;
}

// ---- Lịch khai giảng lấy từ eduscan ----
// Trang đọc GET /api/public/classes của eduscan (ngày khai giảng gần nhất và các thứ học của lớp sắp khai giảng).
// Chưa cấu hình, eduscan chậm/lỗi hoặc chưa có lớp sắp khai giảng thì giữ giá trị mặc định ở trên.
// HTML dựng sẵn luôn dùng giá trị mặc định; dữ liệu từ eduscan chỉ thay khi người xem mở trang.
const LEADS_ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined;
const SCHEDULE_ENDPOINT =
  (import.meta.env.VITE_SCHEDULE_ENDPOINT as string | undefined) ||
  (LEADS_ENDPOINT ? LEADS_ENDPOINT.replace(/\/leads\/public\/?$/, "/public/classes") : undefined);

const SCHEDULE_CACHE_KEY = "nh_schedule_v1";
const SCHEDULE_CACHE_MS = 10 * 60 * 1000;
const SCHEDULE_TIMEOUT_MS = 8000;
const DAY_NAMES = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

interface LiveSchedule {
  nextStart: string | null;
  days: string | null;
}
const EMPTY_SCHEDULE: LiveSchedule = { nextStart: null, days: null };

/** "Thứ 2, Thứ 4 hoặc Thứ 6" từ danh sách thứ (0 = Chủ nhật ... 6 = Thứ 7); null nếu rỗng. Thứ 2 đứng đầu, Chủ nhật cuối. */
export function formatWeekdays(weekdays: number[]): string | null {
  const days = [...new Set(weekdays)].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
  const names = days.map((d) => DAY_NAMES[d]);
  if (names.length === 0) return null;
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} hoặc ${names[names.length - 1]}`;
}

/** Kiểm tra dữ liệu từ eduscan; sai định dạng thì bỏ qua (không bao giờ ném lỗi). */
export function parseSchedule(data: unknown): LiveSchedule {
  const d = (data ?? {}) as { next_start_date?: unknown; weekdays?: unknown };
  const nextStart = typeof d.next_start_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d.next_start_date) ? d.next_start_date : null;
  const wd = Array.isArray(d.weekdays) ? d.weekdays.filter((n): n is number => Number.isInteger(n) && n >= 0 && n <= 6) : [];
  return { nextStart, days: formatWeekdays(wd) };
}

let liveSchedule: LiveSchedule = EMPTY_SCHEDULE;
let scheduleRequested = false;
const scheduleListeners = new Set<() => void>();
const setLiveSchedule = (next: LiveSchedule) => {
  liveSchedule = next;
  scheduleListeners.forEach((l) => l());
};

function requestSchedule() {
  if (scheduleRequested || !SCHEDULE_ENDPOINT) return;
  scheduleRequested = true;
  try {
    const cached = JSON.parse(localStorage.getItem(SCHEDULE_CACHE_KEY) ?? "null") as { t: number; data: unknown } | null;
    if (cached && Date.now() - cached.t < SCHEDULE_CACHE_MS) {
      setLiveSchedule(parseSchedule(cached.data));
      return;
    }
  } catch {
    // không đọc được bộ nhớ trình duyệt thì gọi eduscan như bình thường
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), SCHEDULE_TIMEOUT_MS);
  fetch(SCHEDULE_ENDPOINT, { signal: ctrl.signal })
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
    .then((data) => {
      setLiveSchedule(parseSchedule(data));
      try {
        localStorage.setItem(SCHEDULE_CACHE_KEY, JSON.stringify({ t: Date.now(), data }));
      } catch {
        // bỏ qua
      }
    })
    .catch(() => {
      // eduscan chậm hoặc lỗi: giữ giá trị mặc định
    })
    .finally(() => clearTimeout(timer));
}

function useLiveSchedule(): LiveSchedule {
  const live = useSyncExternalStore(
    (cb) => {
      scheduleListeners.add(cb);
      return () => scheduleListeners.delete(cb);
    },
    () => liveSchedule,
    () => EMPTY_SCHEDULE,
  );
  useEffect(requestSchedule, []);
  return live;
}

// Nhãn ngày khai giảng dùng trong giao diện: lần hiển thị đầu theo ngày build (khớp HTML dựng sẵn),
// sau đó cập nhật theo ngày hiện tại của người xem và ngày khai giảng từ eduscan (nếu có).
// Tự ẩn khi đã qua ngày khai giảng.
export function useNextStartLabel(): string | null {
  const live = useLiveSchedule();
  const startDate = live.nextStart ?? NEXT_START_DATE;
  const [label, setLabel] = useState(() => nextStartLabel(BUILD_DATE));
  useEffect(() => setLabel(nextStartLabel(new Date(), startDate)), [startDate]);
  return label;
}

// Các ngày học dùng trong giao diện: mặc định SCHEDULE_DAYS, thay bằng các thứ học của lớp sắp khai giảng khi eduscan có dữ liệu.
export function useScheduleDays(): string {
  return useLiveSchedule().days ?? SCHEDULE_DAYS;
}

// Chính sách cam kết đầu ra (dùng thống nhất ở mọi chỗ trên trang)
export const COMMITMENT_TITLE = "Cam kết chuẩn đầu ra JLPT";
export const COMMITMENT_DETAIL =
  "Đi học từ 90% số buổi trở lên và làm đủ các bài thi thử → được học lại miễn phí 1 khóa nếu chưa thi đỗ.";
