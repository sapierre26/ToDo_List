import { applyTheme } from "./utils/theme";

const savedTheme = localStorage.getItem("theme") || "light";
const savedFont = localStorage.getItem("font") || "Arial";

applyTheme(savedTheme);
document.body.style.fontFamily = savedFont;
