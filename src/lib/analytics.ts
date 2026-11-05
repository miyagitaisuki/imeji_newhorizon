// Đo lường: Google Analytics 4 và Meta Pixel, chỉ nạp khi có ID trong biến môi trường.
// Thiếu ID thì mọi hàm ở đây là no-op, trang vẫn chạy bình thường.

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

// Cho scripts/prerender.mjs dùng lại đúng ID đã build vào bundle, để bài viết tĩnh
// và các trang React gửi dữ liệu về cùng một GA4/Meta Pixel.
export { GA_ID, META_PIXEL_ID };

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const STORE_KEY = "thayquang_utm";

type Dict = Record<string, string>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

let initialized = false;

// Lưu UTM của lượt truy cập đầu tiên trong phiên, để form gửi kèm nguồn về Sheet.
export function captureUtm(): Dict {
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Dict = {};
    UTM_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) found[k] = v.slice(0, 100);
    });
    if (Object.keys(found).length > 0) {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(found));
    }
    const stored = sessionStorage.getItem(STORE_KEY);
    return stored ? (JSON.parse(stored) as Dict) : {};
  } catch {
    return {};
  }
}

export function getSource(): string {
  const utm = captureUtm();
  const parts = Object.entries(utm).map(([k, v]) => `${k}=${v}`);
  try {
    if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host && host !== window.location.hostname) parts.push(`referrer=${host}`);
    }
  } catch {
    // referrer không hợp lệ thì bỏ qua
  }
  return parts.join("; ");
}

function loadScript(src: string) {
  const el = document.createElement("script");
  el.async = true;
  el.src = src;
  document.head.appendChild(el);
}

export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  captureUtm();

  if (GA_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`);
  }

  if (META_PIXEL_ID) {
    // Đoạn mã Meta Pixel chuẩn, viết lại dạng hàm để không dùng innerHTML.
    const n: any = (window.fbq = function (...args: unknown[]) {
      n.queue.push(args);
    });
    n.queue = [];
    n.loaded = true;
    n.version = "2.0";
    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");
    loadScript("https://connect.facebook.net/en_US/fbevents.js");
  }
}

// Sự kiện GA4 → sự kiện Meta Pixel tương ứng.
// Sự kiện chuẩn của Meta dùng "track", sự kiện tự đặt dùng "trackCustom".
const META_STANDARD: Record<string, string> = {
  generate_lead: "Lead",
  click_zalo: "Contact",
  click_call: "Contact",
};
const META_CUSTOM: Record<string, string> = {
  quiz_start: "QuizStart",
  quiz_complete: "QuizComplete",
};

// Gửi sự kiện tới GA4 và Meta Pixel. Lỗi thì bỏ qua để không ảnh hưởng người dùng.
// Các sự kiện đang dùng:
//   generate_lead  – gửi form đăng ký thành công
//   click_zalo     – bấm nút/đường dẫn Zalo (params.location: vị trí nút)
//   click_call     – bấm gọi điện (params.location)
//   quiz_start     – mở trắc nghiệm chọn lớp
//   quiz_complete  – xem kết quả trắc nghiệm (params.course, params.target_jlpt)
export function trackEvent(name: string, params: Dict = {}) {
  try {
    window.gtag?.("event", name, params);
  } catch {
    // ignore
  }
  try {
    if (META_STANDARD[name]) {
      window.fbq?.("track", META_STANDARD[name], params);
    } else if (META_CUSTOM[name]) {
      window.fbq?.("trackCustom", META_CUSTOM[name], params);
    }
  } catch {
    // ignore
  }
}

export const trackZalo = (location: string) => trackEvent("click_zalo", { location });
export const trackEcosystem = (target: "practice" | "portal", location: string) =>
  trackEvent("click_ecosystem", { target, location });
export const trackCall = (location: string) => trackEvent("click_call", { location });
