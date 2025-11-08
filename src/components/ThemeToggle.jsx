import React from "react";
import { useTheme } from "../ThemeContext";
import { motion } from "framer-motion";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        p-2 rounded-full backdrop-blur-md border transition-all duration-300
        shadow-md hover:shadow-lg
        ${theme === "dark"
          ? "bg-white/10 border-white/20 hover:bg-white/20 text-white"
          : "bg-black/5 border-black/10 hover:bg-black/10 text-black"}
      `}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
