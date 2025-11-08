// src/components/RewardsChart.jsx
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart, // 🚨 NEW: Switched to AreaChart for the gradient fill
  Area,      // 🚨 NEW: Import Area component
} from "recharts";
import { motion } from "framer-motion";
import { FiTrendingUp, FiClock, FiDollarSign } from "react-icons/fi"; // 🚨 NEW: Icons for the title and tooltip
import { useReadContract, useAccount } from "wagmi";
import { STAKING_ABI } from "../config/abis";
import { CONTRACTS } from "../contracts/addresses";

// -----------------------------------------------------------------------------
// 🚨 NEW: Custom Animated Tooltip Component for a cleaner look
// -----------------------------------------------------------------------------
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = parseFloat(data.projected);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl shadow-2xl bg-slate-900/90 backdrop-blur-md border border-purple-500/50"
      >
        <p className="text-sm font-semibold text-purple-400 mb-1 flex items-center gap-2">
          <FiClock className="w-4 h-4" />
          {label} (Projection)
        </p>
        <p className="text-2xl font-black text-white flex items-center gap-2">
          <FiDollarSign className="w-5 h-5 text-green-400" />
          {`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Accumulated Value
        </p>
      </motion.div>
    );
  }
  return null;
};

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------
export default function RewardsChart({ theme }) {
  const { address } = useAccount();

  // --- Wagmi Data Fetching ---
  const { data: stakedBalance } = useReadContract({
    address: CONTRACTS.sepolia.staking,
    abi: STAKING_ABI,
    functionName: "stakedBalances",
    args: [address],
    watch: true,
  });

  const { data: pendingReward } = useReadContract({
    address: CONTRACTS.sepolia.staking,
    abi: STAKING_ABI,
    functionName: "getPendingReward",
    args: [address],
    watch: true,
  });

  const apy = 0.12; // 12% APY example 

  // --- Dynamic Projection Data ---
  const data = useMemo(() => {
    const base = Number(stakedBalance || 0) + Number(pendingReward || 0);
    // Use a default value if wallet is not connected or stakedBalance is 0 for visual purposes
    const initialInvestment = base > 0 ? base : 1000; 

    const points = [];
    let current = initialInvestment;
    for (let i = 0; i < 13; i++) { // Project 1 year (12 points + start point)
      const monthly = current * (1 + apy / 12);
      points.push({
        month: i === 0 ? "Now" : `${i} Month${i > 1 ? 's' : ''}`,
        projected: current,
      });
      current = monthly;
    }
    return points;
  }, [stakedBalance, pendingReward, apy]);

  const isDark = theme === "dark";
  const lineColor = isDark ? "#8b5cf6" : "#4f46e5"; // Purple/Indigo
  const axisColor = isDark ? "#475569" : "#cbd5e1"; // Slate 500/300

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 md:p-10 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 shadow-2xl space-y-6"
    >
      {/* Premium Title with Animation */}
      <motion.div
        animate={{ scale: [1, 1.01, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3 relative">
          <FiTrendingUp className="text-purple-400 w-7 h-7" />
          Live Rewards Projection
          {/* Glowing Underline Effect */}
          <span className="absolute left-0 -bottom-2 h-0.5 w-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-50 blur-md" />
        </h2>
        <span className="text-sm font-semibold text-green-400 border border-green-500/30 px-3 py-1 rounded-full bg-green-900/30">
          APY: {(apy * 100).toFixed(1)}%
        </span>
      </motion.div>

      {/* Recharts Component with AreaChart for fill effect */}
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          {/* Switched to AreaChart for the premium filled-area look */}
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              {/* Define the gradient for the AREA FILL */}
              <linearGradient id="colorProjectedArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
              </linearGradient>
              {/* Define the gradient for the LINE STROKE (for multi-color/premium effect) */}
              <linearGradient id="colorProjectedLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                <stop offset="100%" stopColor="#ec4899" stopOpacity={1}/>
              </linearGradient>
            </defs>

            {/* Custom Grid for minimal design */}
            <CartesianGrid 
              stroke={axisColor} 
              strokeDasharray="3 3" 
              opacity={0.3}
              vertical={false} // Only horizontal lines for a cleaner look
            />
            
            <XAxis 
              dataKey="month" 
              stroke={axisColor} 
              tickLine={false}
              padding={{ left: 10, right: 10 }}
              style={{ fontSize: '12px' }}
            />
            
            <YAxis 
              stroke={axisColor} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`} // Use 'k' for large numbers
              style={{ fontSize: '12px' }}
              domain={['auto', 'auto']}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="projected"
              stroke="url(#colorProjectedLine)" // Use the gradient for the line
              strokeWidth={4} // Thicker line for emphasis
              fill="url(#colorProjectedArea)" // Use the gradient for the fill
              dot={false} // Remove dots for a smoother, premium feel
              activeDot={{ r: 6, fill: 'white', stroke: '#8b5cf6', strokeWidth: 3 }} // Enhanced active dot
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
    </motion.div>
  );
}