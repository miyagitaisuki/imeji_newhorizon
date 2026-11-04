import { ChevronRight } from "lucide-react";

export interface Crumb {
  name: string;
  href?: string; // mục cuối (trang hiện tại) không có href
}

// Đường dẫn điều hướng hiển thị. Dữ liệu BreadcrumbList cho Google nằm trong src/seo.ts.
export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => (
  <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
    <ol className="flex flex-wrap items-center gap-1">
      {items.map((c, i) => (
        <li key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} />}
          {c.href ? (
            <a href={c.href} className="hover:text-primary-600">
              {c.name}
            </a>
          ) : (
            <span aria-current="page" className="text-slate-700 font-medium">
              {c.name}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);
