import { useEffect, useState } from "react";
import style from "./settings.module.css";

const Settings = () => {
  const [theme, setTheme] = useState("light");
  const [font, setFont] = useState("Arial");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const themeColors = {
    "gold-blue": ["#D2B48C", "#50708F", "#B8B8C4", "#CEA98A", "#AEA98B"],
    "vintage": ["#7C6A6A", "#C9A66B", "#F0E1C6", "#A57F60", "#5E5343"],
    "pastel-purple": ["#C9B6E4", "#E8DAEF", "#F6E9FF", "#D3C0EB", "#BFA2DB"],
    "forest-green": ["#608986", "#9AD7A7", "#B3D5C9", "#74AD9B", "#53778B"],
    "light": ["#ffffff", "#f0f0f0", "#cccccc", "#999999", "#666666"],
    "dark": ["#121212", "#1e1e1e", "#2c2c2c", "#404040", "#eeeeee"],
  };

  const applyTheme = (themeName) => {
    const colors = themeColors[themeName];
    if (colors) {
      document.documentElement.style.setProperty("--color-1", colors[0]);
      document.documentElement.style.setProperty("--color-2", colors[1]);
      document.documentElement.style.setProperty("--color-3", colors[2]);
      document.documentElement.style.setProperty("--color-4", colors[3]);
      document.documentElement.style.setProperty("--color-5", colors[4]);
    }
  };

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
    applyTheme(selectedTheme);
  };

  const handleFontChange = (e) => {
    const selectedFont = e.target.value;
    setFont(selectedFont);
    localStorage.setItem("font", selectedFont);
    document.body.style.fontFamily = selectedFont;
  };

  const handleSaveSettings = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/api/auth/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme, font }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setMessage("Settings saved!");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setMessage(data.message || "Failed to save settings");
        setSuccess(false);
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage("Failed to save settings");
      setSuccess(false);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setTheme(data.theme || "light");
          setFont(data.font || "Arial");
          applyTheme(data.theme || "light");
          document.body.style.fontFamily = data.font || "Arial";
        }
      } catch (err) {
        console.error("Failed to load user settings", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);
  if (isLoading) return null; // You can replace this with a spinner if you'd like

  return (
  <div className={style.settingsContainer}>
    <div className={style.preferencesSection}>
      <div className={style.selectGroup}>
        <label htmlFor="theme">Theme</label>
        <select id="theme" value={theme} onChange={handleThemeChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="gold-blue">Gold-Blue</option>
          <option value="vintage">Vintage</option>
          <option value="pastel-purple">Pastel Purple</option>
          <option value="forest-green">Forest Green</option>
        </select>
      </div>

      <div className={style.selectGroup}>
        <label htmlFor="font">Font</label>
        <select id="font" value={font} onChange={handleFontChange}>
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="monospace">Monospace</option>
        </select>
      </div>
    </div>

    <div className={style.settingsActions}>
      <button onClick={handleSaveSettings}>Save Settings</button>
      
      {message && (
        <div className={success ? style.successMessage : style.errorMessage}>
          {message}
        </div>
      )}
    </div>
  </div>
);
}


export default Settings;
