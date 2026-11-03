# Tiếng Nhật thầy Quang

Trang web và bài viết về học tiếng Nhật. Hosted miễn phí trên Render dạng Static Site.

## Cấu trúc

- `index.html`: trang chủ, tự động liệt kê các bài có `publish: true` trong `posts/index.json`.
- `posts/`: các bài viết dạng HTML và file `index.json` làm danh mục.
- `.github/workflows/facebook-post.yml`: khi `posts/index.json` thay đổi, workflow đăng các bài có `publish: true` và `fb_posted: false` lên Facebook Page, rồi đánh dấu `fb_posted: true`.

## Thêm một bài mới

1. Tạo file `posts/ten-bai.html`.
2. Thêm mục vào `posts/index.json` với `publish: true` và `fb_posted: false`.
3. Commit và push lên `main`.

## Cấu hình cần có

- Secrets: `FB_PAGE_ID`, `FB_PAGE_TOKEN`.
- Variables: `SITE_URL` là địa chỉ Render của trang, ví dụ `https://ten-trang.onrender.com`.
