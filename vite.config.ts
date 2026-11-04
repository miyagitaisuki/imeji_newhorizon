import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

// Địa chỉ công khai của trang. Khi có tên miền riêng, đặt biến SITE_URL trên Render
// (và sửa các link trong index.html, public/robots.txt) cho khớp.
const SITE_URL = (process.env.SITE_URL || 'https://imeji-newhorizon-1.onrender.com').replace(/\/$/, '');

// Sinh dist/sitemap.xml khi build: trang chủ + các bài viết có publish: true trong public/posts/index.json.
function sitemapPlugin(): Plugin {
  return {
    name: 'sitemap',
    apply: 'build',
    closeBundle() {
      const indexPath = path.resolve(import.meta.dirname, 'public/posts/index.json');
      const outDir = path.resolve(import.meta.dirname, 'dist');
      let posts: {slug: string; date?: string; publish?: boolean}[] = [];
      try {
        posts = JSON.parse(fs.readFileSync(indexPath, 'utf-8')).posts ?? [];
      } catch {
        // Không đọc được danh mục bài viết thì sitemap chỉ có trang chủ
      }
      const urls = [
        `  <url><loc>${SITE_URL}/</loc></url>`,
        ...posts
          .filter((p) => p.publish)
          .map(
            (p) =>
              `  <url><loc>${SITE_URL}/posts/${p.slug}.html</loc>${p.date ? `<lastmod>${p.date}</lastmod>` : ''}</url>`,
          ),
      ];
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
      fs.mkdirSync(outDir, {recursive: true});
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), sitemapPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // Khi chỉnh sửa trong AI Studio (DISABLE_HMR=true): tắt HMR và theo dõi file để tránh nhấp nháy.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
