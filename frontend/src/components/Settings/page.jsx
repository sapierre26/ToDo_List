import { useEffect, useState } from "react";
import { useCallback } from "react";
import style from "./settings.module.css";

const Settings = () => {
  const [theme, setTheme] = useState("light");
  const [font, setFont] = useState("Monospace");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    // Remove old theme classes
    root.classList.remove("theme-gold-blue", "theme-forest-green", "theme-lavendar", "theme-red");

    if (themeName !== "light") {
      root.classList.add(`theme-${themeName}`);
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
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

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
          // Only update state once, not DOM
          setTheme(data.theme || "light");
          setFont(data.font || "Arial");
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
            <option value="gold-blue">Gold-Blue</option>
            <option value="forest-green">Forest Green</option>
            <option value="lavendar">Lavendar</option>
            <option value="red">Red</option>
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
};

export default Settings;
