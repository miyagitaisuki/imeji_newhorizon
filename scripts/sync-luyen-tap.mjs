// Lấy repo imeji_dominion (game luyện tập Minna no Nihongo), build CSS rồi copy vào dist/luyen-tap/.
// Chạy sau `vite build`. Đổi nguồn bằng DOMINION_REPO / DOMINION_REF; DOMINION_DIR trỏ tới bản đã clone sẵn (bỏ qua clone).
// Nếu không lấy được dominion thì build vẫn xong (cảnh báo), trừ khi đặt LUYEN_TAP_REQUIRED=1.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "dist", "luyen-tap");
const repo = process.env.DOMINION_REPO ?? "https://github.com/miyagitaisuki/imeji_dominion";
const ref = process.env.DOMINION_REF ?? "main";
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: "inherit" });

let tmp;
try {
  let src = process.env.DOMINION_DIR;
  if (!src) {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dominion-"));
    src = path.join(tmp, "repo");
    run("git", ["clone", "--depth", "1", "--branch", ref, repo, src]);
  }

  // Build CSS Tailwind; nếu lỗi thì dùng file tailwind.css đã commit sẵn trong repo.
  try {
    run("npm", ["ci", "--no-audit", "--no-fund"], src);
    run("npm", ["run", "build:css"], src);
  } catch {
    console.warn("Cảnh báo: không build được CSS dominion, dùng assets/css/tailwind.css có sẵn.");
  }

  // Bộ quy chuẩn thương hiệu phải giống hệt bản gốc ở repo này (src/styles/imeji-brand.css).
  const brandHere = fs.readFileSync(path.join(root, "src", "styles", "imeji-brand.css"), "utf-8");
  const brandDominion = path.join(src, "assets", "css", "imeji-brand.css");
  if (!fs.existsSync(brandDominion) || fs.readFileSync(brandDominion, "utf-8") !== brandHere) {
    console.warn("Cảnh báo: assets/css/imeji-brand.css của dominion khác src/styles/imeji-brand.css. Chép bản gốc sang dominion.");
  }

  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  for (const item of ["index.html", "minna", "nhap-mon", "n2", "data", "assets"]) {
    fs.cpSync(path.join(src, item), path.join(out, item), {
      recursive: true,
      filter: (p) => !p.endsWith("tailwind.input.css"),
    });
  }
  // Thêm /luyen-tap/ vào sitemap.xml (prerender.mjs đã sinh file này trước đó).
  const sitemap = path.join(root, "dist", "sitemap.xml");
  const siteUrl = process.env.SITE_URL ?? "https://imejiquynhon.com";
  if (fs.existsSync(sitemap)) {
    const xml = fs.readFileSync(sitemap, "utf-8");
    const entry = `  <url><loc>${siteUrl}/luyen-tap/</loc></url>`;
    if (!xml.includes("/luyen-tap/")) fs.writeFileSync(sitemap, xml.replace("</urlset>", `${entry}\n</urlset>`));
  }
  console.log(`Đã copy luyện tập vào ${path.relative(root, out)}/`);
} catch (err) {
  if (process.env.LUYEN_TAP_REQUIRED === "1") throw err;
  console.warn(`Cảnh báo: bỏ qua /luyen-tap/ (${err.message}). Trang chính vẫn build bình thường.`);
} finally {
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
}
