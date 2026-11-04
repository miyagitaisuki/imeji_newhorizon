import { createRoot, hydrateRoot } from "react-dom/client";
import { Page } from "./router";
import { initAnalytics } from "./lib/analytics";
import "./index.css";

const root = document.getElementById("root")!;
const app = <Page path={window.location.pathname} />;

// Bản build đã có HTML dựng sẵn → gắn tương tác lên HTML đó; khi chạy dev thì dựng từ đầu.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);

initAnalytics();
