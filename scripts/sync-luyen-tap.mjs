// Lấy repo imeji_dominion (game luyện tập Minna no Nihongo), build CSS rồi copy vào dist/luyen-tap/.
// Chạy sau `vite build`. Đổi nguồn bằng DOMINION_REPO / DOMINION_REF; DOMINION_DIR trỏ tới bản đã clone sẵn (bỏ qua clone).
// Nếu không lấy được dominion thì build vẫn xong (cảnh báo), trừ khi đặt LUYEN_TAP_REQUIRED=1.
// Riêng lỗi build CSS dominion là lỗi nghiêm trọng để tránh deploy CSS cũ; đặt ALLOW_STALE_PRACTICE_CSS=1 để bỏ qua.
import { execFileSync, execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "dist", "luyen-tap");
const repo = process.env.DOMINION_REPO ?? "https://github.com/miyagitaisuki/imeji_dominion";
const ref = process.env.DOMINION_REF ?? "main";
// Trên Windows npm là npm.cmd, và Node không cho spawn .cmd/.bat trực tiếp nếu không qua shell.
const NPM = process.platform === "win32" ? "npm.cmd" : "npm";
const run = (cmd, args, cwd) => {
  if (process.platform === "win32" && cmd.endsWith(".cmd")) {
    // execSync nhận cả chuỗi lệnh nên tránh được cảnh báo DEP0190 của execFileSync + shell.
    const command = [cmd, ...args.map((arg) => (/\s/.test(arg) ? `"${arg}"` : arg))].join(" ");
    execSync(command, { cwd, stdio: "inherit" });
    return;
  }
  execFileSync(cmd, args, { cwd, stdio: "inherit" });
};

const fatal = (message, cause) => {
  const err = new Error(message, { cause });
  err.fatal = true;
  return err;
};

let tmp;
try {
  let src = process.env.DOMINION_DIR;
  if (!src) {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dominion-"));
    src = path.join(tmp, "repo");
    run("git", ["clone", "--depth", "1", "--branch", ref, repo, src]);
  }

  // Build CSS Tailwind; mặc định lỗi ở bước này sẽ dừng build để không deploy CSS cũ.
  try {
    run(NPM, ["ci", "--no-audit", "--no-fund"], src);
    run(NPM, ["run", "build:css"], src);
  } catch (err) {
    if (process.env.ALLOW_STALE_PRACTICE_CSS === "1") {
      console.warn(
        "Cảnh báo: không build được CSS dominion, dùng assets/css/tailwind.css có sẵn (ALLOW_STALE_PRACTICE_CSS=1)."
      );
      console.warn(`  Lỗi gốc: ${err.message}`);
    } else {
      throw fatal(
        `Không build được CSS của dominion: ${err.message}. ` +
          "Dừng build để không deploy /luyen-tap/ với CSS cũ. " +
          "Sửa lỗi npm ở trên, hoặc đặt ALLOW_STALE_PRACTICE_CSS=1 nếu chấp nhận dùng CSS đã commit.",
        err
      );
    }
  }

  // Bộ quy chuẩn thương hiệu phải giống hệt bản gốc ở repo này (src/styles/imeji-brand.css).
  const brandHere = fs.readFileSync(path.join(root, "src", "styles", "imeji-brand.css"), "utf-8");
  const brandDominion = path.join(src, "assets", "css", "imeji-brand.css");
  if (!fs.existsSync(brandDominion) || fs.readFileSync(brandDominion, "utf-8") !== brandHere) {
    console.warn("Cảnh báo: assets/css/imeji-brand.css của dominion khác src/styles/imeji-brand.css. Chép bản gốc sang dominion.");
  }

  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  // Danh sách thư mục cần chép. Thêm thư mục mới của dominion vào đây, nếu không site sẽ 404.
  // "slides" và "flashcards" có thể chưa tồn tại: bỏ qua nếu thiếu, kiểm tra tham chiếu ở bước dưới.
  const items = ["index.html", "minna", "nhap-mon", "n2", "data", "assets", "slides", "flashcards", "games"];
  for (const item of items) {
    const from = path.join(src, item);
    if (!fs.existsSync(from)) {
      if (["slides", "flashcards"].includes(item)) continue;
      throw new Error(`thiếu ${item} trong dominion`);
    }
    fs.cpSync(from, path.join(out, item), {
      recursive: true,
      filter: (p) => !p.endsWith("tailwind.input.css"),
    });
  }

  // Mọi slide/flashcard được bật trong data/resources.json phải có file trong bản build, nếu không báo lỗi ngay.
  const resources = JSON.parse(fs.readFileSync(path.join(src, "data", "resources.json"), "utf-8"));
  const missing = [];
  for (const kind of ["slide", "flashcard"]) {
    const dir = kind === "slide" ? "slides" : "flashcards";
    for (const [group, ids] of Object.entries(resources[kind] ?? {})) {
      for (const id of ids) {
        const rel = path.join(dir, group, `${id}.html`);
        if (!fs.existsSync(path.join(out, rel))) missing.push(rel);
      }
    }
  }
  if (missing.length) throw new Error(`thiếu file trong /luyen-tap/: ${missing.join(", ")}`);
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
  if (err.fatal || process.env.LUYEN_TAP_REQUIRED === "1") throw err;
  console.warn(`Cảnh báo: bỏ qua /luyen-tap/ (${err.message}). Trang chính vẫn build bình thường.`);
} finally {
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
}
