import { motion } from "framer-motion";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  delay = 0,
  color = "cyan"
}) => {
  const colorClasses = {
    cyan: "from-tapir-cyan-500/20 to-tapir-cyan-600/10 border-tapir-cyan-500/30 text-tapir-cyan-400",
    green: "from-tapir-green-500/20 to-tapir-green-600/10 border-tapir-green-500/30 text-tapir-green-400",
    gold: "from-tapir-gold-500/20 to-tapir-gold-600/10 border-tapir-gold-500/30 text-tapir-gold-400",
    purple: "from-tapir-purple-500/20 to-tapir-purple-600/10 border-tapir-purple-500/30 text-tapir-purple-400"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className={`
        p-5 rounded-2xl border backdrop-blur-md shadow-lg
        bg-gradient-to-br ${colorClasses[color]}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        {Icon && <Icon className="w-5 h-5 opacity-80" />}
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend === "up" ? "text-tapir-green-400" : "text-red-400"
            }`}
          >
            {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />}
            {trendValue}
          </div>
        )}
      </div>

      {/* title label */}
      <p className="text-sm theme-text/60 font-medium">{title}</p>

      {/* main value */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
        className="text-3xl font-bold theme-text"
      >
        {value}
      </motion.p>
    </motion.div>
  );
};

export default StatCard;
