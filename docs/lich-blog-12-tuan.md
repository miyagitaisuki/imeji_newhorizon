# Lịch blog 12 tuần (11/2026 – 01/2027)

Nhịp đăng: **1 bài/tuần**, gợi ý đăng **thứ 2**. Mỗi bài nhắm **một từ khóa chính** mà người học hay gõ lên Google và luôn có liên kết về trang khóa học tương ứng.

## Lịch

| Tuần | Ngày đăng | Từ khóa chính | Tiêu đề đề xuất | Nhóm (`category`) | Liên kết tới |
|---|---|---|---|---|---|
| 1 | 09/11/2026 | học tiếng nhật cho người mới bắt đầu | Học tiếng Nhật cho người mới bắt đầu: lộ trình 6 tháng từ con số 0 đến N5 | `n5` | /khoa-hoc/n5/ |
| 2 | 16/11/2026 | kinh nghiệm thi jlpt n5 | Kinh nghiệm thi JLPT N5: cấu trúc đề, điểm đỗ và cách phân bổ thời gian | `n5` | /khoa-hoc/n5/ |
| 3 | 23/11/2026 | chuẩn bị thi jlpt tháng 12 | Còn 2 tuần thi JLPT tháng 12: ôn gì và mang gì vào phòng thi | `phuong-phap` | /khoa-hoc/n5/, /khoa-hoc/n4/ |
| 4 | 30/11/2026 | ngữ pháp n5 | Tổng hợp ngữ pháp N5 quan trọng nhất (kèm ví dụ dễ nhớ) | `n5` | /khoa-hoc/n5/ |
| 5 | 07/12/2026 | học tiếng nhật n5 mất bao lâu | Học tiếng Nhật N5 mất bao lâu? Tính toán thực tế theo số giờ học | `n5` | /khoa-hoc/n5/ |
| 6 | 14/12/2026 | cách học kanji hiệu quả | Cách học Kanji hiệu quả cho người mới: bộ thủ, âm Hán Việt và Anki | `phuong-phap` | /khoa-hoc/n4/ |
| 7 | 21/12/2026 | flashcard anki tiếng nhật | Cách dùng Anki học từ vựng tiếng Nhật mỗi ngày 20 phút | `phuong-phap` | /khoa-hoc/n5/ |
| 8 | 28/12/2026 | kế hoạch học tiếng nhật năm mới | Kế hoạch học tiếng Nhật năm 2027: đặt mục tiêu N5, N4 hay N3? | `phuong-phap` | /#courses |
| 9 | 04/01/2027 | ngữ pháp n4 | Ngữ pháp N4: thể bị động, sai khiến và cách không bị nhầm | `n4` | /khoa-hoc/n4/ |
| 10 | 11/01/2027 | n4 khác n5 thế nào | Từ N5 lên N4: khác biệt gì và nên học tiếp ngay hay nghỉ? | `n4` | /khoa-hoc/n4/ |
| 11 | 18/01/2027 | n3 tiếng nhật xin việc | Có N3 tiếng Nhật xin được việc gì? Những điều cần biết trước khi học | `n3` | /khoa-hoc/n3/ |
| 12 | 25/01/2027 | lịch thi jlpt 2027 | Lịch thi JLPT 2027 tại Việt Nam và thời điểm nên bắt đầu ôn | `phuong-phap` | /khoa-hoc/n3/, /#register |

Ghi chú theo mùa:
- Kỳ thi JLPT tháng 12/2026 dự kiến vào **Chủ nhật 06/12/2026**. Các bài tuần 2–3 nên đăng trước ngày thi.
- Bài tuần 12: kiểm tra lại lịch chính thức trên trang của đơn vị tổ chức JLPT tại Việt Nam trước khi đăng. Không đoán ngày đăng ký hay ngày thi.
- Cuối tháng 1 thường có kết quả kỳ thi tháng 12. Có thể thêm bài "Cách tra kết quả JLPT" nếu còn sức.

## Khung mỗi bài viết

1. **Tiêu đề** chứa từ khóa chính, dưới 65 ký tự nếu được.
2. **Mô tả** (`summary` trong `index.json`) 120–155 ký tự, có từ khóa, nói rõ người đọc sẽ nhận được gì.
3. **Mở bài** 2–3 câu trả lời thẳng câu hỏi của người tìm kiếm.
4. **Thân bài** 800–1.200 chữ, chia mục bằng thẻ `<h2>`, có ví dụ tiếng Nhật kèm nghĩa (kiểu `.jp` / `.vi` như các bài hiện có).
5. **Liên kết nội bộ**: ít nhất 1 liên kết tới trang khóa học trong cột "Liên kết tới" và 1 liên kết tới bài viết cũ liên quan.
6. Khung **mời đăng ký** (`<div class="cta">`) ở cuối bài, chép từ bài hiện có.
7. **Ảnh** (nếu có): JPG ngang, tỉ lệ khoảng 1200×630, để trong `public/assets/fb/`.

Phần `<head>` chép từ bài hiện có: bài không viết CSS riêng mà dùng `/assets/brand/imeji-brand.css` và `/assets/brand/post.css` (font, màu, khung `.cta`, `.note`, `.jp`, `.vi` theo bộ quy chuẩn thương hiệu).

Khi build, hệ thống **tự thêm**: header có logo và thanh chuyển 3 app (Trang chủ · Luyện tập · Học viên), chân trang chung, canonical, dữ liệu Article và Breadcrumb cho Google, đường dẫn điều hướng, mục "Đọc tiếp" (bài liên quan cùng nhóm và trang khóa học), và đưa bài vào `sitemap.xml`.

## Quy trình đăng

1. Tạo `public/posts/<slug>.html`. Slug viết không dấu, có từ khóa, ví dụ `kinh-nghiem-thi-jlpt-n5`.
2. Thêm vào `public/posts/index.json`:
   ```json
   {
     "slug": "kinh-nghiem-thi-jlpt-n5",
     "title": "Kinh nghiệm thi JLPT N5: cấu trúc đề, điểm đỗ và cách phân bổ thời gian",
     "summary": "…",
     "date": "2026-11-16",
     "category": "n5",
     "publish": false,
     "fb_posted": false,
     "image": "assets/fb/ten-anh.jpg"
   }
   ```
   `category` là một trong: `n5`, `n4`, `n3`, `phuong-phap`.
3. Thầy Quang duyệt nội dung, rồi đổi `publish` thành `true` và đưa lên `main`. Website cập nhật, và workflow tự đăng Facebook.
4. Sau khi đăng: vào Google Search Console → **Kiểm tra URL** → dán link bài → **Yêu cầu lập chỉ mục**. Đăng thêm một "Cập nhật" trên Google Business Profile có link tới bài.

## Đo hiệu quả (mỗi tháng)

Trong Google Search Console → **Hiệu suất**: xem từ khóa nào đã có lượt hiển thị. Bài nào sau 6–8 tuần có hiển thị nhưng ít lượt nhấp thì viết lại tiêu đề và mô tả. Bài nào đã ở trang 2 thì bổ sung nội dung và thêm liên kết từ bài khác.
