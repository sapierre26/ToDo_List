// src/utils/theme.js

export const themeColors = {
  "gold-blue": ["#D2B48C", "#50708F", "#B8B8C4", "#CEA98A", "#AEA98B"],
  "vintage": ["#7C6A6A", "#C9A66B", "#F0E1C6", "#A57F60", "#5E5343"],
  "pastel-purple": ["#C9B6E4", "#E8DAEF", "#F6E9FF", "#D3C0EB", "#BFA2DB"],
  "forest-green": ["#608986", "#9AD7A7", "#B3D5C9", "#74AD9B", "#53778B"],
  "light": ["#ffffff", "#f0f0f0", "#cccccc", "#999999", "#666666"],
  "dark": ["#121212", "#1e1e1e", "#2c2c2c", "#404040", "#eeeeee"],
};

export const applyTheme = (themeName) => {
  const colors = themeColors[themeName];
  if (colors) {
    document.documentElement.style.setProperty("--color-1", colors[0]);
    document.documentElement.style.setProperty("--color-2", colors[1]);
    document.documentElement.style.setProperty("--color-3", colors[2]);
    document.documentElement.style.setProperty("--color-4", colors[3]);
    document.documentElement.style.setProperty("--color-5", colors[4]);
  }
};
