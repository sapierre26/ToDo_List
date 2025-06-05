// src/utils/theme.js

export const themeColors = {
  "gold-blue": ["#D2B48C", "#50708F", "#B8B8C4", "#CEA98A", "#AEA98B"],
  "forest-green": ["#608986", "#9AD7A7", "#B3D5C9", "#74AD9B", "#53778B"],
  lavendar: ["#D6C6E1", "#E9D7EC", "#F7EDF9", "#CAB7E5", "#B99BD6"],
  red: ["#D46A6A", "#F0A6A6", "#F7C9C9", "#E18585", "#C45151"],
  light: ["#ffffff", "#f0f0f0", "#cccccc", "#999999", "#666666"],
};

export const applyTheme = (themeName) => {
  const colors = themeColors[themeName];
  if (!colors) return;

  const root = document.documentElement;
  root.style.setProperty("--color-1", colors[0]);
  root.style.setProperty("--color-2", colors[1]);
  root.style.setProperty("--color-3", colors[2]);
  root.style.setProperty("--color-4", colors[3]);
  root.style.setProperty("--color-5", colors[4]);
};
