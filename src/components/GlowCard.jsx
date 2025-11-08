// src/components/GlowCard.jsx
import { motion } from "framer-motion";

export default function GlowCard({
  children,
  title,
  icon: Icon,
  delay = 0,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className={`relative rounded-2xl p-6 backdrop-blur-xl bg-white/10 dark:bg-white/5 
        border border-white/10 shadow-[0_0_20px_rgba(0,255,200,0.08)] 
        hover:shadow-[0_0_25px_rgba(0,255,200,0.25)] hover:-translate-y-1 
        transition-all duration-300 ${className}`}
    >
      {/* Neon border glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-cyan-400/20" />

      {/* Optional Title + Icon */}
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon className="text-cyan-400 text-2xl drop-shadow-glow" />}
          {title && (
            <h3 className="theme-text font-orbitron text-lg tracking-wide">
              {title}
            </h3>
          )}
        </div>
      )}

      {/* Content */}
      <div className="theme-text text-base">{children}</div>
    </motion.div>
  );
}
