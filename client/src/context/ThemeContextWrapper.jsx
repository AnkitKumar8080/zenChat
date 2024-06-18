import React, { useEffect, useState } from "react";
import ThemeContext from "./ThemeContext";

export default function ThemeContextWrapper({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const changeCurrentTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (theme === "light") document.body.classList.remove("dark");
    else document.body.classList.add("dark");
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ currentTheme: theme, changeCurrentTheme: changeCurrentTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
