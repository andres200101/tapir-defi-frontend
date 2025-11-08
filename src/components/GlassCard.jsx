import React from "react";
import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", onClick, delay = 0 }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl
        bg-white/10 dark:bg-white/5
        border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        hover:shadow-[0_0_25px_rgba(6,182,212,0.4),0_0_50px_rgba(34,197,94,0.3)]
        transition-all duration-500 ${className}`}
    >
      {/* Subtle inner reflection */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
