# Gửi form đăng ký vào Google Sheet

1. Mở một Google Sheet mới (hoặc sheet có sẵn để nhận đăng ký).
2. Vào **Tiện ích mở rộng → Apps Script**.
3. Xóa nội dung mặc định, dán toàn bộ file `Code.gs` vào, rồi lưu.
4. Bấm **Triển khai → Triển khai mới**:
   - Loại: **Ứng dụng web**
   - Thực thi với tư cách: **Tôi**
   - Ai có quyền truy cập: **Bất kỳ ai**
5. Bấm **Triển khai**, cấp quyền khi Google hỏi, rồi sao chép **URL ứng dụng web** (kết thúc bằng `/exec`).
6. Trên Render, vào service của trang → **Environment**, thêm biến:
   - `VITE_SHEET_ENDPOINT` = URL vừa sao chép
7. Deploy lại trang (Render build lại thì biến mới có hiệu lực).

Khi học viên gửi form, một dòng mới sẽ xuất hiện trong sheet **Đăng ký** (tự tạo nếu chưa có).

Khi test local, tạo file `.env.local` ở thư mục gốc với cùng biến trên.

Lưu ý: nếu sửa `Code.gs` sau này, phải **Triển khai → Quản lý triển khai → Sửa → Phiên bản mới** thì URL mới có code mới. URL không đổi.

## Thông báo email khi có đăng ký mới (tùy chọn)

1. Trong Apps Script, vào **Project Settings (biểu tượng bánh răng) → Script properties → Add script property**.
2. Tên: `NOTIFY_EMAIL`, giá trị: địa chỉ email nhận thông báo.
3. Sau khi sửa `Code.gs`, phải **Triển khai → Quản lý triển khai → Sửa → Phiên bản mới**.

## Cột "Nguồn" và "Đồng ý xử lý dữ liệu"

- **Nguồn**: UTM và trang giới thiệu của lượt đăng ký.
- **Đồng ý xử lý dữ liệu**: ghi "Đồng ý" khi người đăng ký đã tick ô đồng ý chính sách bảo vệ dữ liệu cá nhân (bắt buộc trên form). Giữ cột này làm bằng chứng đã có sự đồng ý.

Với sheet đã có sẵn, script tự bổ sung tiêu đề các cột mới ở dòng 1 trong lần ghi tiếp theo.

## Form biết chắc đã lưu thành công

Trang đọc phản hồi `{"ok": true}` từ script. Nếu script lỗi hoặc chưa triển khai bản mới, form báo lỗi và hướng người dùng gọi/nhắn Zalo thay vì báo "thành công" giả. **Sau khi cập nhật `Code.gs`, nhớ triển khai Phiên bản mới**, rồi gửi thử một đăng ký trên trang thật để kiểm tra.
