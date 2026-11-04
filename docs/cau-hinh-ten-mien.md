# Cấu hình tên miền imejiquynhon.com

Website và email dùng **chung một bảng DNS** tại nơi anh/chị mua tên miền. Cần thêm cả hai nhóm bản ghi bên dưới. Hai nhóm không xung đột nhau.

## 1. Bản ghi cho website (Render)

Trước tiên, vào Render → service của trang → **Settings → Custom Domains → Add Custom Domain**. Thêm lần lượt:

- `imejiquynhon.com` (địa chỉ chính)
- `www.imejiquynhon.com` (Render tự chuyển về địa chỉ chính)

Render sẽ hiện các bản ghi cần tạo. Thông thường là:

| Host | Loại | Giá trị |
|---|---|---|
| `@` | A | `216.24.57.1` |
| `www` | CNAME | `imeji-newhorizon-1.onrender.com` |

> Đối chiếu lại với giá trị Render hiện trên màn hình. Nếu khác, dùng giá trị của Render.
> Nếu nhà cung cấp tên miền tạo sẵn bản ghi `A` hoặc `AAAA` cho `@` hay `www` (trang "đang xây dựng"), hãy **xóa chúng** trước, nếu không website sẽ chạy chập chờn.

Sau khi DNS cập nhật (vài phút đến vài giờ), quay lại Render bấm **Verify**. Render tự cấp chứng chỉ HTTPS miễn phí.

## 2. Bản ghi cho email (maychuemail)

Theo hướng dẫn của nhà cung cấp email:

| Host | Loại | Giá trị | Priority |
|---|---|---|---|
| `@` | MX | `mail9234.maychuemail.com` | 5 |
| `@` | MX | `mx9234.maychuemail.net` | 10 |
| `mail` | CNAME | `mail9234.maychuemail.com` | |
| `mx` | CNAME | `mx9234.maychuemail.net` | |
| `@` | TXT | `v=spf1 include:spf.maychuemail.com ~all` | |

Nên làm thêm để email gửi đi không vào hộp thư rác:

- **DKIM**: liên hệ kỹ thuật maychuemail để lấy bản ghi rồi thêm vào DNS.
- **DMARC** (thêm sau khi DKIM chạy được):

  | Host | Loại | Giá trị |
  |---|---|---|
  | `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:lienhe@imejiquynhon.com` |

Lưu ý:
- Chỉ được có **một** bản ghi TXT bắt đầu bằng `v=spf1` cho `@`. Nếu sau này dùng thêm dịch vụ gửi mail khác, gộp vào cùng bản ghi, đừng tạo bản ghi thứ hai.
- Khi cài email trên điện thoại hoặc Outlook, dùng **kết nối có mã hóa SSL**: IMAPS `mail9234.maychuemail.com` cổng 993, SMTPS cổng 465 (hoặc 587 STARTTLS). Không dùng các cổng 110/143/25 không mã hóa, vì mật khẩu sẽ bị gửi đi dạng rõ.

## 3. Hộp thư hiển thị trên website

Website đang hiển thị **lienhe@imejiquynhon.com** (form, chính sách dữ liệu, footer, thông tin cho Google). Hãy tạo hộp thư này trong trang quản trị email. Nếu muốn dùng địa chỉ khác, sửa `EMAIL` trong `src/data/siteInfo.ts`.

Nên đặt luôn `NOTIFY_EMAIL` của Apps Script (xem `google-apps-script/README.md`) thành hộp thư này để nhận thông báo đăng ký mới.

## 4. Việc cần làm sau khi tên miền chạy

1. **GitHub → Settings → Secrets and variables → Actions → Variables**: đổi `SITE_URL` thành `https://imejiquynhon.com`. Bài đăng Facebook tự động sẽ dẫn về tên miền mới.
2. **Google Search Console** (search.google.com/search-console):
   - Thêm thuộc tính loại **Miền (Domain)**: `imejiquynhon.com`.
   - Google đưa một bản ghi TXT dạng `google-site-verification=...`. Thêm vào DNS với Host `@`. Bản ghi này nằm riêng, không đụng tới bản ghi SPF.
   - Sau khi xác minh: vào **Sơ đồ trang web** và gửi `https://imejiquynhon.com/sitemap.xml`.
   - Vào **Kiểm tra URL**, lần lượt yêu cầu lập chỉ mục cho trang chủ và 3 trang khóa học.
3. Cập nhật link website trên Facebook Page, Zalo và Google Business Profile.
4. Địa chỉ cũ `imeji-newhorizon-1.onrender.com` vẫn chạy. Mọi trang đã khai báo canonical về tên miền mới, nên Google sẽ dần chuyển sang tên miền mới.
