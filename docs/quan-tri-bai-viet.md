# Trang quản trị bài viết (/admin/)

Thầy viết, sửa bài, chèn ảnh, chèn ký tự và định dạng chữ ngay trên trình duyệt tại **https://imejiquynhon.com/admin/**, không cần sửa code. Mỗi lần bấm **Công bố**, bài được lưu vào GitHub, Render tự cập nhật website sau 1–3 phút, và bài mới được tự đăng lên Facebook Page.

- Phần mềm quản trị: Decap CMS (miễn phí, mã nguồn mở), cấu hình ở `public/admin/config.yml`.
- Bài viết là các file Markdown trong `content/posts/`. Ảnh tải lên nằm ở `public/assets/posts/`.

## Phần 1. Cài đặt (làm một lần)

Decap đăng nhập bằng tài khoản GitHub, nên cần một máy chủ đăng nhập nhỏ (thư mục `oauth/`, chạy miễn phí trên Render).

### Bước 1. Tạo GitHub OAuth App

1. Đăng nhập GitHub bằng tài khoản sở hữu kho `miyagitaisuki/imeji_newhorizon`.
2. Vào **Settings → Developer settings → OAuth Apps → New OAuth App**.
3. Điền:
   | Ô | Giá trị |
   |---|---|
   | Application name | `Quản trị Tiếng Nhật Thầy Quang` |
   | Homepage URL | `https://imejiquynhon.com` |
   | Authorization callback URL | `https://imeji-cms-auth.onrender.com/callback` |
4. Bấm **Register application**. Ghi lại **Client ID**, bấm **Generate a new client secret** và ghi lại **Client secret** (chỉ hiện một lần, không gửi cho ai).

### Bước 2. Tạo máy chủ đăng nhập trên Render

1. Render → **New → Web Service** → chọn kho `imeji_newhorizon`.
2. Điền:
   | Ô | Giá trị |
   |---|---|
   | Name | `imeji-cms-auth` |
   | Branch | `main` |
   | Root Directory | `oauth` |
   | Runtime | Node |
   | Build Command | `echo ok` |
   | Start Command | `node server.mjs` |
   | Instance Type | Free |
3. Mục **Environment Variables**, thêm:
   - `GITHUB_CLIENT_ID` = Client ID ở bước 1
   - `GITHUB_CLIENT_SECRET` = Client secret ở bước 1
   - (tùy chọn) `GITHUB_SCOPE` = `public_repo` nếu kho để công khai. Mặc định là `repo`, dùng được cho cả kho riêng tư.
4. Bấm **Create Web Service**. Khi chạy xong, mở `https://imeji-cms-auth.onrender.com` phải thấy chữ `ok`.

> Nếu Render đặt địa chỉ khác (ví dụ tên đã có người dùng), hãy:
> - sửa `base_url` trong `public/admin/config.yml` thành địa chỉ đó,
> - sửa **Authorization callback URL** trong OAuth App thành `<địa chỉ đó>/callback`.

> Gói Free của Render "ngủ" sau 15 phút không dùng. Lần đăng nhập đầu tiên trong ngày có thể chờ khoảng 1 phút, các lần sau nhanh.

### Bước 3. Quyền sửa kho

Người đăng nhập vào `/admin/` phải có quyền ghi vào kho GitHub. Nếu thầy dùng tài khoản GitHub khác tài khoản chủ kho: vào kho → **Settings → Collaborators → Add people**, mời tài khoản đó.

## Phần 2. Sử dụng

### Đăng nhập
Mở **https://imejiquynhon.com/admin/** → **Đăng nhập bằng GitHub** → cho phép ứng dụng (chỉ lần đầu).

### Viết bài mới
1. Bấm **+ bài viết**.
2. Điền **Tiêu đề** (có từ khóa, dưới 60 ký tự). Đường dẫn bài được tạo từ tiêu đề, bỏ dấu (ví dụ `kinh-nghiem-thi-jlpt-n5`), và **không đổi sau khi tạo**.
3. Chọn **Ngày đăng**, **Nhóm**, điền **Tóm tắt** (120–155 ký tự). **Mô tả cho Google** có thể để trống.
4. **Ảnh đại diện**: bấm chọn hình → **Tải lên** → chọn ảnh → **Chọn**. Nên dùng ảnh ngang khoảng 1200×630, dung lượng dưới 300 KB.
5. Viết **Nội dung** (xem phần định dạng bên dưới). Khung bên phải xem trước bài như trên web.
6. Để **Hiển thị trên web** tắt nếu còn là bản nháp. Bật lên khi muốn đăng.
7. Bấm **Công bố → Công bố ngay**.

### Định dạng trong khung Nội dung
| Muốn làm | Cách làm |
|---|---|
| In đậm, nghiêng, gạch ngang | Bôi đen chữ → bấm **B**, *I*, ~~S~~ trên thanh công cụ (hoặc Ctrl+B, Ctrl+I) |
| Tiêu đề mục | Nút **H** → chọn Heading 2 (mục lớn) hoặc Heading 3 (mục nhỏ) |
| Danh sách | Nút danh sách chấm hoặc danh sách số |
| Liên kết | Bôi đen chữ → nút hình mắt xích → dán địa chỉ (ví dụ `/khoa-hoc/n5/`) |
| Trích dẫn | Nút dấu ngoặc kép |
| **Ví dụ tiếng Nhật** (câu Nhật + nghĩa Việt) | Nút **+** → **Ví dụ tiếng Nhật** → điền 2 ô |
| **Ghi chú khung xanh** | Nút **+** → **Ghi chú (khung xanh)**. Trong ô: `**chữ**` để in đậm, để một dòng trống giữa hai đoạn |
| **Chèn ảnh trong bài** | Nút **+** → **Image** → **Chọn một hình** → **Tải lên** → chọn ảnh → **Lấy những cái đã chọn**. Nhớ điền mô tả ảnh (Alt) |
| **Chèn ký tự** (〜「」★①…) | Bấm nút **あ Ký tự** góc dưới phải → bấm ký tự để chép → đặt con trỏ vào bài → Ctrl+V |
| Bảng | Bảng có sẵn trong bài sửa trực tiếp được. Muốn tạo bảng mới: chuyển công tắc sang **Markdown** và gõ theo mẫu `\| Cột 1 \| Cột 2 \|` như các bài có sẵn |

Gõ tiếng Nhật trực tiếp bằng bộ gõ của máy (Windows: thêm bàn phím Japanese; điện thoại: thêm bàn phím 日本語) như bình thường.

Khung **mời đăng ký học thử**, đường dẫn điều hướng, mục **Đọc tiếp**, tên tác giả và dữ liệu cho Google được **tự thêm** khi dựng trang. Không cần viết vào bài.

### Sửa bài đã đăng
Mở bài trong danh sách → sửa → **Công bố ngay**. Nếu sửa nội dung đáng kể, điền **Ngày cập nhật** để Google biết bài mới được cập nhật. Sửa bài đã đăng **không** đăng lại lên Facebook (ô **Đã đăng Facebook** đang bật). Muốn đăng lại, tắt ô này rồi lưu.

### Xóa bài
Mở bài → **Xoá mục này**. Bài sẽ biến mất khỏi web sau khi Render cập nhật.

### Đăng Facebook tự động
Khi lưu một bài có **Hiển thị trên web** bật và **Đã đăng Facebook** tắt, GitHub Actions chờ Render cập nhật xong rồi đăng bài lên Facebook Page (kèm ảnh đại diện nếu có), sau đó tự bật **Đã đăng Facebook**.

## Chạy thử trên máy (cho người kỹ thuật)

```bash
npm run cms
```

```bash
npm run dev
```

Mở `http://localhost:3000/admin/index.html` → **Đăng nhập**. Mọi thay đổi được ghi thẳng vào thư mục `content/posts/` trên máy, không qua GitHub (chế độ `local_backend`, chỉ hoạt động trên localhost).
