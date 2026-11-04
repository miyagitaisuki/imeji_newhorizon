# Tiếng Nhật thầy Quang

Website lớp tiếng Nhật tại Quy Nhơn: trang chủ, 3 trang khóa học (N5, N4, N3), trang giảng viên (`/giang-vien/`), trang danh sách bài viết và các bài viết. Tên miền chính thức: **https://imejiquynhon.com**. Hosted miễn phí trên Render dạng Static Site.

Tài liệu vận hành trong thư mục `docs/`:
- `docs/cau-hinh-ten-mien.md`: DNS cho website và email, Search Console
- `docs/google-business-profile.md`: nội dung soạn sẵn cho Google Maps
- `docs/lich-blog-12-tuan.md`: lịch bài viết theo từ khóa và quy trình đăng
- `docs/quy-trinh-xin-danh-gia.md`: xin đánh giá Google từ học viên

## Phát triển

- Cài đặt: `npm install`.
- Chạy local: `npm run dev`.
- Build: `npm run build` ra thư mục `dist/`. Build gồm 3 bước: bản cho trình duyệt, bản dựng HTML trên máy build, và `scripts/prerender.mjs` tạo **HTML dựng sẵn** cho từng trang (Google, Zalo, Facebook đọc được nội dung ngay, không cần chạy JavaScript), bổ sung SEO cho bài viết và sinh `sitemap.xml`, `robots.txt`.

## Cấu trúc

- `src/data/siteInfo.ts`: **thông tin hay thay đổi** — số điện thoại, Zalo, email, địa chỉ, bản đồ, lịch học, ngày khai giảng, nội dung cam kết đầu ra. Sửa ở đây là cập nhật toàn trang.
- `src/data/courseData.ts`: các khóa học, lộ trình, câu hỏi thường gặp của trang chủ (`FAQS`).
- `src/data/teacher.ts`: thông tin giảng viên cho trang `/giang-vien/` và dữ liệu Person. Thêm link hồ sơ (trang trường, Facebook…) vào `sameAs`.
- `src/`: landing page (React + Vite + Tailwind).
- `src/data/courseDetails.ts`: nội dung chi tiết từng trang khóa học (`/khoa-hoc/n5/`, `/n4/`, `/n3/`).
- `src/seo.ts`: tiêu đề, mô tả, dữ liệu có cấu trúc (JSON-LD) cho từng trang.
- `src/router.tsx` và `src/pages/`: các trang. Thêm trang mới thì thêm vào cả `router.tsx` và `PAGES` trong `seo.ts`.
- `src/data/posts.ts`: đọc `public/posts/index.json` lúc build, liệt kê các bài có `publish: true` (trang chủ hiện 4 bài mới nhất, `/posts/` hiện tất cả theo nhóm).
- `public/posts/`: các bài viết dạng HTML và file `index.json` làm danh mục. Vite copy nguyên thư mục này vào `dist/`.
- `.github/workflows/facebook-post.yml`: khi `public/posts/index.json` thay đổi, workflow đăng các bài có `publish: true` và `fb_posted: false` lên Facebook Page, rồi đánh dấu `fb_posted: true`.

## Thêm một bài mới

1. Tạo file `public/posts/ten-bai.html`.
2. Thêm mục vào `public/posts/index.json` với `category` (`n5`, `n4`, `n3` hoặc `phuong-phap`), `publish: true` và `fb_posted: false`. Chi tiết và khung bài viết: `docs/lich-blog-12-tuan.md`.
3. Commit và push lên `main`.

## Form đăng ký -> Google Sheet

Xem [google-apps-script/README.md](google-apps-script/README.md). Cần biến môi trường `VITE_SHEET_ENDPOINT` (URL web app Apps Script) khi build.

## Cập nhật ngày khai giảng

Sửa `NEXT_START_DATE` trong `src/data/siteInfo.ts` (dạng `YYYY-MM-DD`). Sau ngày đó, trang tự ẩn dòng "Khai giảng …" cho đến khi bạn đặt ngày mới.

## SEO

- Favicon (`public/favicon.ico`, `favicon-32x32.png`, `apple-touch-icon.png`) và ảnh chia sẻ `public/assets/brand/og-image.jpg` (1200×630).
- Mỗi trang có canonical, Open Graph và JSON-LD (EducationalOrganization, Course, FAQPage, ProfilePage/Person, BreadcrumbList, CollectionPage). Bài viết được thêm Article (tác giả trỏ tới `/giang-vien/`) + BreadcrumbList, đường dẫn điều hướng và mục "Đọc tiếp" khi build. Bài `publish: false` được gắn `noindex`.
- FAQPage lấy đúng nội dung câu hỏi hiển thị trên trang (`FAQS` và `courseFaqs()` trong `src/data/courseDetails.ts`, gồm 2 câu học phí và lịch học tự sinh). Câu trả lời luôn có sẵn trong HTML, chỉ ẩn bằng CSS khi đóng.
- Tiêu đề bài viết: khi build, đuôi " - Tiếng Nhật thầy Quang" được bỏ; đuôi ngắn " | Thầy Quang" chỉ được thêm khi tiêu đề vẫn ≤ 60 ký tự.
- `sitemap.xml` (có `lastmod`: ngày build cho các trang, ngày `updated`/`date` cho bài viết) và `robots.txt` được sinh tự động khi build.
- Đổi tên miền: sửa `SITE_URL` trong `src/data/siteInfo.ts`.

## Cấu hình Render

- Build command: `npm install && npm run build`
- Publish directory: `dist`

## Cấu hình cần có

- Secrets: `FB_PAGE_ID`, `FB_PAGE_TOKEN`.
- Variables: `SITE_URL` là địa chỉ chính thức của trang: `https://imejiquynhon.com`.


## Đo lường (tùy chọn)

Đặt các biến sau trên Render (hoặc `.env.local` khi chạy local). Thiếu biến nào thì phần đó tự tắt:

- `VITE_GA_ID`: ID Google Analytics 4 (dạng `G-XXXXXXX`).
- `VITE_META_PIXEL_ID`: ID Meta Pixel.

Các sự kiện được gửi (GA4 / Meta Pixel):

| Sự kiện GA4 | Meta Pixel | Khi nào |
|---|---|---|
| `generate_lead` | Lead | Gửi form đăng ký thành công |
| `click_zalo` | Contact | Bấm Zalo (tham số `location` cho biết nút nào) |
| `click_call` | Contact | Bấm gọi điện |
| `quiz_start` | QuizStart (custom) | Mở trắc nghiệm chọn lớp |
| `quiz_complete` | QuizComplete (custom) | Xem kết quả trắc nghiệm |

Trong GA4, đánh dấu `generate_lead`, `click_zalo`, `click_call` là **sự kiện chính (key event)** để theo dõi chuyển đổi.

Form đăng ký gửi kèm nguồn truy cập (UTM và trang giới thiệu) về cột **Nguồn** trong Sheet. Khi chia sẻ link, hãy thêm UTM, ví dụ `https://imejiquynhon.com/?utm_source=facebook&utm_medium=post&utm_campaign=hiragana`.

## Bài viết Facebook

- Bài mới để `publish: false` cho đến khi bạn duyệt xong. Khi đổi thành `true` và đưa lên `main`, workflow sẽ đăng.
- Nếu bài có `image`, workflow chờ đến khi ảnh truy cập được (tối đa 10 phút) rồi mới đăng, vì Render cần thời gian deploy.
