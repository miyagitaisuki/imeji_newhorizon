# IMEJI日本語教室 (Lớp học tiếng Nhật thầy Quang)

Website lớp tiếng Nhật tại Quy Nhơn: trang chủ, 3 trang khóa học (N5, N4, N3), trang danh sách bài viết và các bài viết. Tên miền chính thức: **https://imejiquynhon.com**. Hosted miễn phí trên Render dạng Static Site.

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
- `src/data/courseData.ts`: các khóa học, lộ trình, câu hỏi thường gặp.
- `src/`: landing page (React + Vite + Tailwind).
- `src/data/courseDetails.ts`: nội dung chi tiết từng trang khóa học (`/khoa-hoc/n5/`, `/n4/`, `/n3/`).
- `src/seo.ts`: tiêu đề, mô tả, dữ liệu có cấu trúc (JSON-LD) cho từng trang.
- `src/router.tsx` và `src/pages/`: các trang. Thêm trang mới thì thêm vào cả `router.tsx` và `PAGES` trong `seo.ts`.
- `src/data/posts.ts`: đọc `public/posts/index.json` lúc build, liệt kê các bài có `publish: true` (trang chủ hiện 4 bài mới nhất, `/posts/` hiện tất cả theo nhóm).
- `public/posts/`: các bài viết dạng HTML và file `index.json` làm danh mục. Vite copy nguyên thư mục này vào `dist/`.
- `.github/workflows/facebook-post.yml`: khi `public/posts/index.json` thay đổi, workflow đăng các bài có `publish: true` và `fb_posted: false` lên Facebook Page, rồi đánh dấu `fb_posted: true`.

## Bộ quy chuẩn thương hiệu

Màu, font, bo góc, bóng, nền chấm và thẻ kính mờ nằm trong `src/styles/imeji-brand.css`, **giống hệt nhau** ở 3 repo: imeji_newhorizon (website, giữ bản gốc), imeji_dominion (luyện tập) và eduscan (cổng học viên). Quy ước dùng ghi ở đầu file đó.

- Màu theo ý nghĩa: `primary` (thương hiệu, #2563eb), `success`, `warning`, `danger`, `accent`, cùng `slate` cho trung tính. Không dùng tên màu thô như `blue-600`, `emerald-500`, `bg-[#...]`.
- Font: Be Vietnam Pro, chữ Nhật dùng Noto Sans JP (`font-jp`).
- Muốn đổi: sửa bản gốc ở imeji_newhorizon, chép y nguyên sang 2 repo kia, rồi chạy `npm run brand:check` để so với bản gốc trên GitHub.

Khi build, bước copy luyện tập cảnh báo nếu bản trong dominion khác bản gốc.

Chỉ có giao diện sáng (đã bỏ chế độ tối) để 3 trang giống nhau. Header của website, trang luyện tập và cổng học viên đều có **thanh chuyển 3 app** (`.imeji-switch`, component `src/components/EcosystemSwitch.tsx`). Bài viết dùng `public/assets/brand/post.css`; header và chân trang của bài (`src/components/PostChrome.tsx`) được gắn lúc build.

## Thêm một bài mới

1. Tạo file `public/posts/ten-bai.html`.
2. Thêm mục vào `public/posts/index.json` với `category` (`n5`, `n4`, `n3` hoặc `phuong-phap`), `publish: true` và `fb_posted: false`. Chi tiết và khung bài viết: `docs/lich-blog-12-tuan.md`.
3. Commit và push lên `main`.

## Form đăng ký -> Google Sheet

Form gửi đăng ký vào **eduscan** (`VITE_LEADS_ENDPOINT`, VD `https://app.imejiquynhon.com/api/leads/public`; eduscan cần `CORS_ORIGIN=https://imejiquynhon.com`). Nếu eduscan lỗi mạng/máy chủ hoặc chưa cấu hình, form ghi vào **Google Sheet** (`VITE_SHEET_ENDPOINT`) để không mất đăng ký; xem [google-apps-script/README.md](google-apps-script/README.md). Lỗi dữ liệu (số điện thoại sai…) thì hiện thông báo của eduscan, không ghi sang Sheet. Cần ít nhất một trong hai biến khi build.

## Cập nhật ngày khai giảng và ngày học

Nguồn chính là **eduscan**: khi mở trang, trình duyệt đọc `GET /api/public/classes` (địa chỉ suy ra từ `VITE_LEADS_ENDPOINT`, hoặc đặt riêng `VITE_SCHEDULE_ENDPOINT`) và hiển thị ngày khai giảng gần nhất cùng các thứ học của các lớp sắp khai giảng. Chỉ cần đặt **Ngày bắt đầu** và lịch lặp cho lớp trong eduscan. Kết quả được nhớ 10 phút trong trình duyệt; chờ quá 8 giây hoặc eduscan lỗi thì giữ giá trị mặc định.

Giá trị mặc định (dùng cho HTML dựng sẵn cho Google, và khi eduscan không trả được dữ liệu): sửa `NEXT_START_DATE` (dạng `YYYY-MM-DD`) và `SCHEDULE_DAYS` trong `src/data/siteInfo.ts`. Sau ngày khai giảng, trang tự ẩn dòng "Khai giảng …" cho đến khi có ngày mới. Phần câu hỏi thường gặp và dữ liệu có cấu trúc cho Google luôn dùng giá trị mặc định.

## SEO

- Favicon (`public/favicon.ico`, `favicon-32x32.png`, `apple-touch-icon.png`) và ảnh chia sẻ `public/assets/brand/og-image.jpg` (1200×630).
- Mỗi trang có canonical, Open Graph và JSON-LD (EducationalOrganization, Course, BreadcrumbList, CollectionPage). Bài viết được thêm Article + BreadcrumbList, đường dẫn điều hướng và mục "Đọc tiếp" khi build. Bài `publish: false` được gắn `noindex`.
- `sitemap.xml` và `robots.txt` được sinh tự động khi build.
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
