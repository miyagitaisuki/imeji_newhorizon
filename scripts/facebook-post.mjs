// Đăng lên Facebook Page các bài có publish: true và fb_posted: false, rồi đánh dấu fb_posted: true
// ngay trong file content/posts/<slug>.md. Chạy bởi .github/workflows/facebook-post.yml.
// Biến môi trường: FB_PAGE_ID, FB_PAGE_TOKEN, SITE_URL.
import fs from "node:fs";
import path from "node:path";
import { loadPosts, POSTS_DIR } from "./posts-lib.mjs";

const { FB_PAGE_ID, FB_PAGE_TOKEN } = process.env;
const SITE_URL = (process.env.SITE_URL || "https://imejiquynhon.com").replace(/\/+$/, "");
const GRAPH = "https://graph.facebook.com/v26.0";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const todo = loadPosts().filter((p) => p.publish && !p.fb_posted);
if (todo.length === 0) {
  console.log("Không có bài mới cần đăng.");
  process.exit(0);
}
if (!FB_PAGE_ID || !FB_PAGE_TOKEN) throw new Error("Thiếu FB_PAGE_ID hoặc FB_PAGE_TOKEN");

// Render cần vài phút để deploy commit mới: chờ đến khi URL trả về 200 (tối đa 10 phút)
async function waitFor(url) {
  for (let i = 1; i <= 20; i++) {
    const code = await fetch(url, { redirect: "follow" }).then((r) => r.status, () => 0);
    if (code === 200) return;
    console.log(`Chưa sẵn sàng (${code}), thử lại sau 30s (${i}/20): ${url}`);
    await sleep(30_000);
  }
  throw new Error(`Không truy cập được sau 10 phút: ${url}`);
}

async function graph(endpoint, params) {
  const r = await fetch(`${GRAPH}/${FB_PAGE_ID}/${endpoint}`, {
    method: "POST",
    body: new URLSearchParams({ ...params, access_token: FB_PAGE_TOKEN }),
  });
  const data = await r.json();
  if (!data.id) throw new Error(data.error?.message || "không rõ");
  return data;
}

function markPosted(slug) {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  const raw = fs.readFileSync(file, "utf-8");
  const end = raw.indexOf("\n---", 3);
  let head = raw.slice(0, end);
  head = /^fb_posted:.*$/m.test(head) ? head.replace(/^fb_posted:.*$/m, "fb_posted: true") : `${head}\nfb_posted: true`;
  fs.writeFileSync(file, head + raw.slice(end));
}

for (const post of todo) {
  const link = `${SITE_URL}/posts/${post.slug}.html`;
  try {
    await waitFor(link);
    if (post.image) {
      const img = `${SITE_URL}${post.image}`;
      await waitFor(img);
      await graph("photos", { url: img, caption: `${post.title}\n\n${post.summary}\n\n${link}`, published: "true" });
    } else {
      await graph("feed", { message: `${post.title}\n\n${post.summary}`, link });
    }
  } catch (e) {
    console.error(`Lỗi khi đăng bài ${post.slug}: ${e.message}`);
    process.exit(1);
  }
  markPosted(post.slug);
  console.log(`Đã đăng: ${post.slug}`);
}
