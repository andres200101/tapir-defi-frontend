import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAccount } from "wagmi";
import GlassCard from "./GlassCard";
import RewardsChart from "./RewardsChart";
import AnimatedNumbers from "../hooks/useCountUp";
import { CONTRACTS } from "../contracts/addresses";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiActivity, 
  FiShield,
  FiAward,
  FiZap,
  FiPieChart,
  FiBarChart2
} from "react-icons/fi";

export default function Dashboard() {
  const { theme } = useTheme();
  const { address } = useAccount();

  const [balances, setBalances] = useState({
    tapir: 1200.45,
    trwd: 250.78,
    gov: 89.3,
    staked: 800,
    pendingRewards: 45.2,
    apy: 12.5,
    collateral: 1000,
    borrowed: 350,
    availableToBorrow: 650,
    ltv: 0.35,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, [address]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // INNOVATIVE: Quick Actions Data
  const quickActions = [
    { 
      label: 'Stake', 
      icon: '🥩', 
      color: 'from-green-400 to-emerald-500',
      action: () => console.log('Navigate to staking'),
      description: 'Earn rewards'
    },
    { 
      label: 'Borrow', 
      icon: '🏦', 
      color: 'from-purple-400 to-pink-500',
      action: () => console.log('Navigate to lending'),
      description: 'Access liquidity'
    },
    { 
      label: 'Claim', 
      icon: '🎁', 
      color: 'from-amber-400 to-orange-500',
      action: () => console.log('Claim rewards'),
      description: `${balances.pendingRewards} TRWD`
    },
  ];

  return (
    <div className="relative space-y-8">
      {/* Enhanced Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 50 * (i % 2 ? 1 : -1), 0],
              y: [0, -50 * (i % 2 ? 1 : -1), 0],
              scale: [1, 1.2 + i * 0.1, 1],
              rotate: [0, 360],
            }}
            transition={{ 
              duration: 15 + i * 5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 2
            }}
            className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{
              background: `radial-gradient(circle, ${
                ['#06b6d4', '#8b5cf6', '#10b981'][i]
              }40 0%, transparent 70%)`,
              top: `${20 + i * 25}%`,
              left: `${10 + i * 30}%`,
            }}
          />
        ))}
      </div>

      {/* Enhanced Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative"
      >
        {/* Animated Title with Multiple Effects */}
        <div className="relative inline-block">
          <motion.h1 
            className="text-5xl md:text-7xl font-black mb-4 relative z-10"
          >
            <motion.span
              className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundSize: '200% 100%',
              }}
            >
              Your Portfolio
            </motion.span>
          </motion.h1>
          
          {/* Text Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 blur-3xl opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg max-w-2xl mx-auto"
        >
          Track your assets, earnings, and DeFi positions in real-time
        </motion.p>

        {/* Enhanced Status Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mt-8"
        >
          {[
            { icon: FiActivity, label: 'Active', color: 'cyan', value: '3 Positions' },
            { icon: FiShield, label: 'Protected', color: 'green', value: '2.86x Health' },
            { icon: FiZap, label: 'Optimized', color: 'purple', value: '12.5% APY' },
          ].map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.1, y: -5 }}
              className={`px-6 py-3 rounded-full bg-slate-800/50 border border-${badge.color}-500/30 backdrop-blur-sm group cursor-pointer relative overflow-hidden`}
            >
              {/* Hover Glow */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r from-${badge.color}-500/0 via-${badge.color}-500/20 to-${badge.color}-500/0`}
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              
              <div className="flex items-center gap-3 relative z-10">
                <badge.icon className={`text-${badge.color}-400 w-5 h-5 group-hover:scale-125 transition-transform`} />
                <div className="text-left">
                  <p className="text-xs text-slate-400">{badge.label}</p>
                  <p className={`text-sm font-bold text-${badge.color}-400`}>{badge.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* INNOVATIVE: Floating Quick Actions Menu */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
        className="fixed bottom-8 right-8 z-40"
      >
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute bottom-20 right-0 space-y-3"
            >
              {quickActions.map((action, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.1, x: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.action}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r ${action.color} shadow-2xl backdrop-blur-xl group relative overflow-hidden`}
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <span className="text-3xl relative z-10">{action.icon}</span>
                  <div className="text-left relative z-10">
                    <p className="font-bold text-white">{action.label}</p>
                    <p className="text-xs text-white/80">{action.description}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-2xl flex items-center justify-center text-white font-bold text-2xl relative overflow-hidden group"
        >
          {/* Pulsing Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-white/50"
            animate={{
              scale: [1, 1.5],
              opacity: [0.5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <motion.span
            animate={{ rotate: showQuickActions ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            +
          </motion.span>
        </motion.button>
      </motion.div>
      {/* Hero Stats Grid */}
      {/* ENHANCED Hero Stats Grid with Advanced Interactions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Total Portfolio Value - With Live Chart Preview */}
        <motion.div 
          variants={itemVariants} 
          className="relative group cursor-pointer"
          whileHover={{ y: -8, scale: 1.02 }}
        >
          {/* Animated Gradient Border */}
          <motion.div
            className="absolute inset-0 rounded-2xl p-[2px]"
            style={{
              background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)',
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full bg-slate-950 rounded-2xl" />
          </motion.div>

          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-cyan-400"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
          
          <div className="relative p-8 rounded-2xl bg-slate-800/50 border border-cyan-500/20 backdrop-blur-xl group-hover:border-cyan-500/50 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Total Portfolio
                </span>
                <motion.div 
                  className="p-3 rounded-xl bg-cyan-500/10"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <FiPieChart className="w-5 h-5 text-cyan-400" />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="mb-2"
              >
                <h3 className="text-4xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                  <AnimatedNumbers value={balances.tapir} />
                </h3>
                <p className="text-sm text-slate-400 mt-1">TAPIR</p>
              </motion.div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FiTrendingUp className="w-4 h-4" />
                  </motion.div>
                  <span>+12.5%</span>
                </div>
                <span className="text-xs text-slate-500">this week</span>
              </div>

              {/* Mini Sparkline */}
              <div className="mt-4 flex gap-1 h-8">
                {[40, 55, 50, 65, 60, 75, 70, 85, 90, 95].map((height, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-cyan-500/50 to-cyan-400 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.8 + i * 0.05, type: 'spring' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pending Rewards - With Claim Animation */}
        <motion.div 
          variants={itemVariants} 
          className="relative group cursor-pointer"
          whileHover={{ y: -8, scale: 1.02 }}
        >
          {/* Rotating Glow */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity"
          />
          
          <div className="relative p-8 rounded-2xl bg-slate-800/50 border border-green-500/20 backdrop-blur-xl group-hover:border-green-500/50 transition-all overflow-hidden">
            {/* Floating Reward Icons */}
            {['🎁', '💎', '⭐', '🌟'].map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl opacity-20"
                style={{
                  top: `${20 + i * 20}%`,
                  right: `${-10 + i * 5}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 360],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                {emoji}
              </motion.div>
            ))}
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Pending Rewards
                </span>
                <motion.div 
                  className="p-3 rounded-xl bg-green-500/10"
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FiAward className="w-5 h-5 text-green-400" />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="mb-2"
              >
                <h3 className="text-4xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
                  <AnimatedNumbers value={balances.trwd} />
                </h3>
                <p className="text-sm text-slate-400 mt-1">TRWD</p>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-3 py-2 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-shadow relative overflow-hidden group/btn"
              >
                {/* Button Shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <FiZap className="w-4 h-4" />
                  Claim Rewards
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Health Factor - With Real-time Gauge */}
        <motion.div 
          variants={itemVariants} 
          className="relative group cursor-pointer"
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity"
          />
          
          <div className="relative p-8 rounded-2xl bg-slate-800/50 border border-purple-500/20 backdrop-blur-xl group-hover:border-purple-500/50 transition-all overflow-hidden">
            {/* Rotating Shield */}
            <motion.div
              className="absolute -top-10 -right-10 text-8xl opacity-5"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              🛡️
            </motion.div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Health Factor
                </span>
                <motion.div 
                  className="p-3 rounded-xl bg-purple-500/10"
                  animate={{
                    boxShadow: ['0 0 0 0 rgba(168, 85, 247, 0.4)', '0 0 0 20px rgba(168, 85, 247, 0)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FiShield className="w-5 h-5 text-purple-400" />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="mb-2"
              >
                <h3 className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                  {(1 / balances.ltv).toFixed(2)}x
                </h3>
                <p className="text-sm text-slate-400 mt-1">Safe Zone</p>
              </motion.div>
              
              {/* Circular Progress */}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 relative"
                    >
                      {/* Animated Shine */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  </div>
                </div>
                <motion.span 
                  className="text-xs text-green-400 font-semibold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Healthy
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      {/* Token Balances Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full" />
            <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              Token Balances
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-slate-800/50 border border-cyan-500/20 hover:border-cyan-500/40 text-sm font-semibold flex items-center gap-2 transition-all"
          >
            <FiBarChart2 className="w-4 h-4" />
            View All
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TAPIR Token */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-6 bg-slate-800/50 border border-slate-700 backdrop-blur-xl group-hover:border-cyan-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                    <FiDollarSign className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Tapir Token</p>
                    <p className="text-sm text-slate-500 font-mono">TAPIR</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <h4 className="text-3xl font-black text-cyan-400 mb-1">
                  <AnimatedNumbers value={balances.tapir} />
                </h4>
                <p className="text-sm text-slate-400">≈ ${(balances.tapir * 1.5).toFixed(2)} USD</p>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-400 flex items-center gap-1">
                  <FiTrendingUp className="w-3 h-3" />
                  +5.2%
                </span>
                <span className="text-slate-500">24h</span>
              </div>
            </div>
          </motion.div>

          {/* TRWD Token */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-6 bg-slate-800/50 border border-slate-700 backdrop-blur-xl group-hover:border-green-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <FiAward className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Reward Token</p>
                    <p className="text-sm text-slate-500 font-mono">TRWD</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <h4 className="text-3xl font-black text-green-400 mb-1">
                  <AnimatedNumbers value={balances.trwd} />
                </h4>
                <p className="text-sm text-slate-400">≈ ${(balances.trwd * 2.1).toFixed(2)} USD</p>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-400 flex items-center gap-1">
                  <FiTrendingUp className="w-3 h-3" />
                  +8.7%
                </span>
                <span className="text-slate-500">24h</span>
              </div>
            </div>
          </motion.div>

          {/* GOV Token */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-6 bg-slate-800/50 border border-slate-700 backdrop-blur-xl group-hover:border-purple-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <FiZap className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Governance</p>
                    <p className="text-sm text-slate-500 font-mono">GOV</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <h4 className="text-3xl font-black text-purple-400 mb-1">
                  <AnimatedNumbers value={balances.gov} />
                </h4>
                <p className="text-sm text-slate-400">≈ ${(balances.gov * 3.5).toFixed(2)} USD</p>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-400 flex items-center gap-1">
                  <FiTrendingUp className="w-3 h-3" />
                  +3.1%
                </span>
                <span className="text-slate-500">24h</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      {/* Staking Overview Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full" />
            <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
              Staking Overview
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Status:</span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-400"
              />
              <span className="text-xs font-semibold text-green-400">Active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Staking Stats */}
          <div className="space-y-6">
            {/* Staked Amount Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
              <div className="relative p-6 bg-slate-800/50 border border-slate-700 backdrop-blur-xl group-hover:border-cyan-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-400 uppercase tracking-wider mb-1">Total Staked</p>
                    <h3 className="text-4xl font-black text-cyan-400">
                      <AnimatedNumbers value={balances.staked} />
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">TAPIR Tokens</p>
                  </div>
                  <div className="p-4 rounded-xl bg-cyan-500/10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      🥩
                    </motion.div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-1">Your Share</p>
                    <p className="text-lg font-bold text-white">2.45%</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-1">Total Staked</p>
                    <p className="text-lg font-bold text-white">32.6K</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* APY Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10" />
              <div className="relative p-6 bg-slate-800/50 border border-slate-700 backdrop-blur-xl group-hover:border-amber-500/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-400 uppercase tracking-wider mb-1">Current APY</p>
                    <h3 className="text-4xl font-black text-amber-400">
                      <AnimatedNumbers value={balances.apy} />%
                    </h3>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/10">
                    <FiTrendingUp className="w-8 h-8 text-amber-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Base APY</span>
                    <span className="text-white font-semibold">10.0%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Boost</span>
                    <span className="text-green-400 font-semibold">+2.5%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '80%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Pending Rewards */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative group overflow-hidden rounded-2xl"
          >
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-cyan-500/20"
              style={{ backgroundSize: '200% 200%' }}
            />
            
            <div className="relative p-8 bg-slate-800/50 border border-slate-700 backdrop-blur-xl group-hover:border-green-500/50 transition-all h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-green-400">Pending Rewards</h3>
                <div className="p-3 rounded-xl bg-green-500/10">
                  <FiAward className="w-6 h-6 text-green-400" />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-7xl mb-6"
                >
                  🎁
                </motion.div>
                
                <h4 className="text-5xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-2">
                  <AnimatedNumbers value={balances.pendingRewards} />
                </h4>
                <p className="text-slate-400 mb-8">TRWD Tokens</p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <FiZap className="w-5 h-5" />
                  Claim Rewards
                </motion.button>
              </div>
              
              <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-green-500/20">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Next Reward</span>
                  <span className="text-green-400 font-semibold">in 2h 34m</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      {/* Lending Overview Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
            <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              Lending Overview
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Collateral Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
            <div className="relative p-6 bg-slate-800/50 border border-slate-700 backdrop-blur-xl group-hover:border-cyan-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Collateral</p>
                  <h4 className="text-3xl font-black text-cyan-400">
                    <AnimatedNumbers value={balances.collateral} />
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">TAPIR</p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10">
                  <FiShield className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Utilization</span>
                  <span className="text-cyan-400 font-semibold">65%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '65%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Borrowed Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10" />
            <div className="relative p-6 bg-slate-800/50 border border-slate-700 backdrop-blur-xl group-hover:border-rose-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Borrowed</p>
                  <h4 className="text-3xl font-black text-rose-400">
                    <AnimatedNumbers value={balances.borrowed} />
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">TAPIR</p>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10">
                  <FiTrendingUp className="w-6 h-6 text-rose-400" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Interest Rate</span>
                  <span className="text-rose-400 font-semibold">8.5% APR</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Available to Borrow Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
            <div className="relative p-6 bg-slate-800/50 border border-slate-700 backdrop-blur-xl group-hover:border-green-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Available</p>
                  <h4 className="text-3xl font-black text-green-400">
                    <AnimatedNumbers value={balances.availableToBorrow} />
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">TAPIR</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10">
                  <FiDollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 py-2 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all"
              >
                Borrow Now
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* LTV Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-6 rounded-2xl bg-slate-800/50 border border-purple-500/20 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold text-purple-400 mb-1">Loan-to-Value Ratio</h4>
              <p className="text-sm text-slate-400">Current: {(balances.ltv * 100).toFixed(1)}% / Max: 75%</p>
            </div>
            <div className="text-3xl font-black text-purple-400">
              {(balances.ltv * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(balances.ltv / 0.75) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.7 }}
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-rose-500"
            />
            <div className="absolute inset-0 flex items-center justify-end pr-2">
              <div className="w-1 h-6 bg-white rounded-full shadow-lg" style={{ marginRight: `${100 - ((balances.ltv / 0.75) * 100)}%` }} />
            </div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>Safe</span>
            <span>Moderate</span>
            <span>Risky</span>
          </div>
        </motion.div>
      </motion.section>

      {/* Rewards Projection Chart */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full" />
          <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
            Rewards Projection
          </h2>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
          <div className="relative p-8 bg-slate-800/50 border border-slate-700 backdrop-blur-xl">
            <RewardsChart theme={theme} />
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}

