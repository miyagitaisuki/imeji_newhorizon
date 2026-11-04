// Máy chủ đăng nhập GitHub cho trang quản trị bài viết (Decap CMS).
// Chỉ làm một việc: đổi mã đăng nhập GitHub lấy token rồi trả về cho trang /admin/.
// Không cần thư viện ngoài. Chạy: node server.mjs. Triển khai: docs/quan-tri-bai-viet.md
//
// Biến môi trường:
//   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET  – từ GitHub OAuth App
//   ALLOWED_ORIGINS  – địa chỉ trang quản trị, cách nhau dấu phẩy (mặc định https://imejiquynhon.com)
//   GITHUB_SCOPE     – quyền xin GitHub (mặc định "repo"; dùng "public_repo" nếu kho công khai)
//   PORT             – Render tự đặt
import http from "node:http";
import crypto from "node:crypto";

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
const ALLOWED = (process.env.ALLOWED_ORIGINS || "https://imejiquynhon.com,https://www.imejiquynhon.com")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const SCOPE = process.env.GITHUB_SCOPE || "repo";
const PORT = Number(process.env.PORT || 8787);

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.error("Thiếu GITHUB_CLIENT_ID hoặc GITHUB_CLIENT_SECRET");
  process.exit(1);
}

const html = (res, status, body) => {
  res.writeHead(status, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline'",
  });
  res.end(`<!doctype html><meta charset="utf-8"><title>Đăng nhập</title><body>${body}</body>`);
};

// Trang trả kết quả cho cửa sổ /admin/ theo giao thức của Decap CMS:
// 1. báo "authorizing:github"; 2. khi trang quản trị trả lời, gửi token đúng về địa chỉ đó (chỉ địa chỉ được phép).
function reply(res, status, content) {
  const msg = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`).replace(/</g, "\\u003c");
  const allowed = JSON.stringify(ALLOWED);
  html(
    res,
    200,
    `<p>${status === "success" ? "Đăng nhập thành công, cửa sổ này sẽ tự đóng." : "Đăng nhập không thành công. Hãy đóng cửa sổ và thử lại."}</p>
<script>
(function () {
  var allowed = ${allowed};
  function receive(e) {
    if (allowed.indexOf(e.origin) === -1) return;
    window.opener.postMessage(${msg}, e.origin);
    window.removeEventListener("message", receive);
    ${status === "success" ? "setTimeout(function () { window.close(); }, 500);" : ""}
  }
  window.addEventListener("message", receive, false);
  if (window.opener) window.opener.postMessage("authorizing:github", "*");
})();
</script>`,
  );
}

const cookie = (req, name) =>
  (req.headers.cookie || "")
    .split(";")
    .map((c) => c.trim().split("="))
    .find(([k]) => k === name)?.[1];

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const origin = `https://${req.headers.host}`;

  if (url.pathname === "/" || url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("ok");
  }

  if (url.pathname === "/auth") {
    const state = crypto.randomBytes(16).toString("hex");
    const target = new URL("https://github.com/login/oauth/authorize");
    target.searchParams.set("client_id", GITHUB_CLIENT_ID);
    target.searchParams.set("redirect_uri", `${origin}/callback`);
    target.searchParams.set("scope", SCOPE);
    target.searchParams.set("state", state);
    res.writeHead(302, {
      Location: target.toString(),
      "Set-Cookie": `oauth_state=${state}; Path=/callback; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    });
    return res.end();
  }

  if (url.pathname === "/callback") {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const saved = cookie(req, "oauth_state");
    if (!code || !state || !saved || state !== saved) {
      return reply(res, "error", { message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn" });
    }
    try {
      const r = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${origin}/callback`,
        }),
      });
      const data = await r.json();
      if (!data.access_token) {
        return reply(res, "error", { message: data.error_description || "GitHub không trả về token" });
      }
      return reply(res, "success", { token: data.access_token, provider: "github" });
    } catch (e) {
      console.error(e);
      return reply(res, "error", { message: "Không kết nối được GitHub" });
    }
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Không tìm thấy");
});

server.listen(PORT, () => console.log(`Máy chủ đăng nhập chạy ở cổng ${PORT}`));
