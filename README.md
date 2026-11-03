# Tiếng Nhật thầy Quang

Trang landing page và danh sách bài viết học tiếng Nhật. Hosted miễn phí trên Render dạng Static Site.

## Phát triển

- Cài đặt: `npm install` (đã có `.npmrc` với `legacy-peer-deps=true`).
- Chạy local: `npm run dev`.
- Build: `npm run build` ra thư mục `dist/`.

## Cấu trúc

- `src/`: landing page (React + Vite + Tailwind).
- `src/components/PostsSection.tsx`: đọc `public/posts/index.json` và liệt kê các bài có `publish: true`.
- `public/posts/`: các bài viết dạng HTML và file `index.json` làm danh mục. Vite copy nguyên thư mục này vào `dist/`.
- `.github/workflows/facebook-post.yml`: khi `public/posts/index.json` thay đổi, workflow đăng các bài có `publish: true` và `fb_posted: false` lên Facebook Page, rồi đánh dấu `fb_posted: true`.

## Thêm một bài mới

1. Tạo file `public/posts/ten-bai.html`.
2. Thêm mục vào `public/posts/index.json` với `publish: true` và `fb_posted: false`.
3. Commit và push lên `main`.

## Cấu hình Render

- Build command: `npm install && npm run build`
- Publish directory: `dist`

## Cấu hình cần có

- Secrets: `FB_PAGE_ID`, `FB_PAGE_TOKEN`.
- Variables: `SITE_URL` là địa chỉ Render của trang, ví dụ `https://ten-trang.onrender.com`.
