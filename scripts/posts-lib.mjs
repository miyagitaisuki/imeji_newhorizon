// Đọc bài viết từ content/posts/*.md (file Markdown có phần thông tin ở đầu, do trang quản trị /admin/ tạo).
import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";

export const ROOT = path.resolve(import.meta.dirname, "..");
export const POSTS_DIR = path.join(ROOT, "content/posts");

export const CATEGORIES = {
  n5: "Tiếng Nhật N5",
  n4: "Tiếng Nhật N4",
  n3: "Tiếng Nhật N3",
  "phuong-phap": "Phương pháp học",
};

// Ngày có thể là chuỗi "2026-11-03" hoặc ngày giờ đầy đủ; chỉ giữ YYYY-MM-DD
const day = (v) => (v ? String(v instanceof Date ? v.toISOString() : v).slice(0, 10) : undefined);

export function parsePostFile(file) {
  const raw = fs.readFileSync(file, "utf-8").replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`Bài ${file} thiếu phần thông tin (---) ở đầu file`);
  const fm = yaml.load(m[1], { schema: yaml.CORE_SCHEMA }) ?? {};
  const slug = path.basename(file, ".md");
  if (!fm.title) throw new Error(`Bài ${slug} thiếu tiêu đề`);
  if (!fm.date) throw new Error(`Bài ${slug} thiếu ngày đăng`);
  return {
    slug,
    title: String(fm.title),
    summary: String(fm.summary ?? ""),
    description: fm.description ? String(fm.description) : undefined,
    date: day(fm.date),
    updated: day(fm.updated),
    category: fm.category in CATEGORIES ? fm.category : "phuong-phap",
    // Đường dẫn ảnh luôn bắt đầu bằng "/" (ví dụ /assets/posts/anh.jpg)
    image: fm.image ? "/" + String(fm.image).replace(/^\/+/, "") : undefined,
    publish: fm.publish === true,
    fb_posted: fm.fb_posted === true,
    body: m[2],
  };
}

export function loadPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parsePostFile(path.join(POSTS_DIR, f)))
    .sort((a, b) => b.date.localeCompare(a.date));
}

// Danh mục bài (không có nội dung) cho các trang React: src/generated/posts.json
export function writePostsIndex() {
  const posts = loadPosts().map(({ body, ...meta }) => meta);
  const out = path.join(ROOT, "src/generated/posts.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ categories: CATEGORIES, posts }, null, 2) + "\n");
  return posts;
}

if (process.argv[1] === import.meta.filename) {
  const posts = writePostsIndex();
  console.log(`Đã tạo danh mục ${posts.length} bài viết (src/generated/posts.json)`);
}
