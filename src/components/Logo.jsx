import React from "react";
import { useTheme } from "../ThemeContext";

const Logo = ({ className = "", height = 40, animated = true }) => {
  const { theme } = useTheme();

  // File paths stored in /public/
  const darkLogo = "/logo_circ.svg";     // existing dark mode logo
  const lightLogo = "/logo_light.svg";   // new light mode logo

  const src = theme === "dark" ? darkLogo : lightLogo;

  return (
    <img
      src={src}
      alt="Tapir Logo"
      height={height}
      style={{ height }}
      className={`
        select-none
        ${animated ? "transition-all duration-300 ease-in-out" : ""}
        ${className}
      `}
    />
  );
};

export default Logo;
