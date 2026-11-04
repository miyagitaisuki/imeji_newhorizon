import HomePage from "./pages/HomePage";
import CoursePage from "./pages/CoursePage";
import PostsPage from "./pages/PostsPage";
import TeacherPage from "./pages/TeacherPage";

// Chuẩn hóa đường dẫn: luôn kết thúc bằng "/" (bỏ index.html)
export function normalizePath(pathname: string): string {
  let p = pathname.replace(/index\.html$/, "");
  if (!p.endsWith("/")) p += "/";
  return p;
}

// Chọn trang theo đường dẫn. Trang không khớp thì hiện trang chủ.
export function Page({ path }: { path: string }) {
  const p = normalizePath(path);
  if (p === "/khoa-hoc/n5/") return <CoursePage courseId="n5" />;
  if (p === "/khoa-hoc/n4/") return <CoursePage courseId="n4" />;
  if (p === "/khoa-hoc/n3/") return <CoursePage courseId="n3" />;
  if (p === "/posts/") return <PostsPage />;
  if (p === "/giang-vien/") return <TeacherPage />;
  return <HomePage />;
}
