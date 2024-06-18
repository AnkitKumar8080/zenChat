import { createContext } from "react";

const defaultValue = {
  currentTheme: "light",
  changeCurrentTheme: (newTheme) => {},
};

const ThemeContext = createContext(defaultValue);

export default ThemeContext;
