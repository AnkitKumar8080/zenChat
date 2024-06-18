import React, { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import { PiSunLight, IoIosMoon } from "../assets";

export default function ThemeSwitchButton() {
  const { currentTheme, changeCurrentTheme } = useContext(ThemeContext);

  const handleButtonClick = () => {
    changeCurrentTheme(currentTheme === "light" ? "dark" : "light");
  };

  return (
    <button className="cursor-pointer" onClick={handleButtonClick}>
      {currentTheme === "light" ? <IoIosMoon /> : <PiSunLight />}
    </button>
  );
}
