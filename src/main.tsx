import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import iconLight from "./assets/quill-ui-icon.png";
import iconDark from "./assets/quill-ui-icon-dark.png";

const icon = document.createElement("link");
icon.rel = "icon";
icon.type = "image/png";
icon.href = document.documentElement.classList.contains("dark") ? iconDark : iconLight;
document.head.appendChild(icon);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
