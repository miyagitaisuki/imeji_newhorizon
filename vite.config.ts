import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// Build gồm 3 bước (xem "build" trong package.json):
// 1. vite build: bản cho trình duyệt (dist/)
// 2. vite build --ssr: bản dựng HTML trên máy build (dist-ssr/)
// 3. scripts/prerender.mjs: tạo HTML dựng sẵn cho từng trang, xử lý bài viết, sinh sitemap.xml
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    define: {
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },
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
