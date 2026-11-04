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

  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  for (const item of ["index.html", "minna", "nhap-mon", "data", "assets"]) {
    fs.cpSync(path.join(src, item), path.join(out, item), {
      recursive: true,
      filter: (p) => !p.endsWith("tailwind.input.css"),
    });
  }
  console.log(`Đã copy luyện tập vào ${path.relative(root, out)}/`);
} catch (err) {
  if (process.env.LUYEN_TAP_REQUIRED === "1") throw err;
  console.warn(`Cảnh báo: bỏ qua /luyen-tap/ (${err.message}). Trang chính vẫn build bình thường.`);
} finally {
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
}
