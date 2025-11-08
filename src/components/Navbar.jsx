// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSun, FiMoon, FiVolume2, FiVolumeX, FiMenu } from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";
import { playClick, toggleSound, isSoundEnabled } from "../utils/sounds";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Shrink on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const linkBase =
    "relative px-3 py-2 font-semibold transition-all duration-200";
  const activeUnderline =
    "after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-cyan-400 after:rounded-full";

  // Auto logo swap
  const logoSrc = theme === "light" ? "/logo_light.svg" : "/logo_circ.png";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/10 dark:bg-black/20
      border-b border-white/10 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={playClick}>
          <img
            src={logoSrc}
            alt="Tapir Logo"
            className="w-10 h-10 drop-shadow-lg transition-all"
          />
          <span className="theme-text font-orbitron text-xl tracking-wide">
            TAPIR
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 ml-10">
          {[
            { name: "Dashboard", path: "/" },
            { name: "Staking", path: "/staking" },
            { name: "Lending", path: "/lending" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={playClick}
              className={`${linkBase} ${
                location.pathname === item.path
                  ? `text-cyan-400 ${activeUnderline}`
                  : "theme-text opacity-80 hover:opacity-100"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={() => {
              playClick();
              toggleTheme();
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
          >
            {theme === "dark" ? (
              <FiSun className="text-yellow-300 text-xl" />
            ) : (
              <FiMoon className="text-slate-700 text-xl" />
            )}
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => {
              playClick();
              toggleSound();
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
          >
            {isSoundEnabled() ? (
              <FiVolume2 className="text-cyan-400 text-xl" />
            ) : (
              <FiVolumeX className="text-slate-400 text-xl" />
            )}
          </button>

          {/* Wallet Button */}
          <button
            onClick={playClick}
            className="hidden md:block px-5 py-2 rounded-xl font-semibold
            bg-gradient-to-r from-cyan-400 to-emerald-400 text-black
            shadow-[0_0_15px_rgba(0,255,200,0.4)]
            hover:shadow-[0_0_25px_rgba(0,255,200,0.7)]
            transition-all"
          >
            Connect Wallet
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg bg-white/10"
            onClick={() => {
              playClick();
              setMobileOpen(true);
            }}
          >
            <FiMenu className="text-2xl theme-text" />
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} setOpen={setMobileOpen} />
    </nav>
  );
}
