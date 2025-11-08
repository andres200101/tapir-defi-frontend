import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { playClick } from "../utils/sounds";
import { useTheme } from "../contexts/ThemeContext";

export default function MobileMenu({ open, setOpen, activeTab, setActiveTab }) {
  const { theme } = useTheme();

  const links = [
    { name: "Dashboard", id: "dashboard" },
    { name: "Staking", id: "staking" },
    { name: "Lending", id: "lending" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className={`absolute top-0 right-0 w-64 h-full ${
              theme === "light" ? "bg-white/90" : "bg-[#0b0b0b]/90"
            } border-l border-white/10 p-5 flex flex-col gap-6`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="theme-text text-xl font-bold">Menu</h2>
              <button
                onClick={() => {
                  playClick();
                  setOpen(false);
                }}
                className="p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <FiX className="text-2xl theme-text" />
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              {links.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    playClick();
                    setActiveTab(item.id);
                    setOpen(false);
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all text-left ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-black"
                      : "theme-text hover:bg-white/10"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}