import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiArrowUpCircle, 
  FiArrowDownCircle, 
  FiGift,
  FiTrendingUp,
  FiClock,
  FiZap,
  FiDollarSign,
  FiTarget,
  FiAward,
  FiLock,
  FiUnlock,
  FiPercent,
  FiActivity
} from "react-icons/fi";
import { useWriteContract, useReadContract } from "wagmi";
import { STAKING_ABI, REWARD_TOKEN_ABI } from "../config/abis";
import { CONTRACTS } from "../contracts/addresses";
import AnimatedNumbers from "../hooks/useCountUp";
import GlassCard from "./GlassCard";
import { toast } from "react-hot-toast";
import { playClick, playSuccess, playError } from "../utils/sounds";

export default function Staking() {
  const { theme } = useTheme();
  const { address } = useAccount();
  
  const [amount, setAmount] = useState("");
  const [selectedLockPeriod, setSelectedLockPeriod] = useState(0); // 0, 30, 90, 180 days
  const [showCalculator, setShowCalculator] = useState(false);
  const [projectionAmount, setProjectionAmount] = useState("1000");
  const [projectionPeriod, setProjectionPeriod] = useState(365);
  
  const [balances, setBalances] = useState({
    staked: 0,
    rewards: 0,
    apy: 12.5,
    walletBalance: 5000,
    totalStakers: 1247,
    totalValueLocked: 3250000,
  });

  // Lock period tiers with boosted APY
  const lockPeriods = [
    { days: 0, label: "Flexible", apy: 12.5, boost: 1.0, icon: "🔓", color: "cyan" },
    { days: 30, label: "1 Month", apy: 15.0, boost: 1.2, icon: "⏱️", color: "green" },
    { days: 90, label: "3 Months", apy: 18.5, boost: 1.48, icon: "🔒", color: "amber" },
    { days: 180, label: "6 Months", apy: 25.0, boost: 2.0, icon: "💎", color: "purple" },
  ];

  // Live contract data
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

  useEffect(() => {
    setBalances(prev => ({
      ...prev,
      staked: Number(stakedBalance || 0) / 1e18,
      rewards: Number(pendingReward || 0) / 1e18,
    }));
  }, [stakedBalance, pendingReward]);

  const { writeContractAsync } = useWriteContract();

  // Calculate projected earnings
  const calculateProjection = (principal, apy, days) => {
    const dailyRate = apy / 365 / 100;
    return principal * (Math.pow(1 + dailyRate, days) - 1);
  };

  const selectedTier = lockPeriods[selectedLockPeriod];
  const boostedAPY = balances.apy * selectedTier.boost;

  const handleStake = async () => {
    playClick();
    if (!amount || isNaN(amount) || amount <= 0) {
      playError();
      toast.error("Enter a valid staking amount.");
      return;
    }

    try {
      toast.loading("Staking in progress...");
      await writeContractAsync({
        address: CONTRACTS.sepolia.staking,
        abi: STAKING_ABI,
        functionName: "stake",
        args: [BigInt(Math.floor(amount * 1e18)), selectedTier.days],
      });
      toast.dismiss();
      playSuccess();
      toast.success(`Successfully staked ${amount} TAPIR!`);
      setAmount("");
    } catch (err) {
      toast.dismiss();
      playError();
      toast.error("Transaction failed.");
      console.error(err);
    }
  };

  const handleClaim = async () => {
    playClick();
    try {
      toast.loading("Claiming rewards...");
      await writeContractAsync({
        address: CONTRACTS.sepolia.staking,
        abi: STAKING_ABI,
        functionName: "claimReward",
      });
      toast.dismiss();
      playSuccess();
      toast.success("Rewards claimed successfully! 🎉");
    } catch (err) {
      toast.dismiss();
      playError();
      toast.error("Claim failed.");
      console.error(err);
    }
  };

  const handleMaxAmount = () => {
    setAmount(balances.walletBalance.toString());
    playClick();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  return (
    <div className="relative space-y-8">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-8xl mb-6 inline-block"
        >
          🥩
        </motion.div>
        
        <h1 className="text-6xl md:text-7xl font-black mb-4">
          <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Stake & Earn
          </span>
        </h1>
        
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
          Lock your TAPIR tokens and earn juicy TRWD rewards. The longer you stake, the higher your APY!
        </p>

        {/* Live Stats Ticker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <div className="px-6 py-3 rounded-full bg-slate-800/50 border border-green-500/20 backdrop-blur-sm flex items-center gap-3">
            <FiActivity className="text-green-400 w-5 h-5" />
            <div className="text-left">
              <p className="text-xs text-slate-400">Total Stakers</p>
              <p className="text-sm font-bold text-white">
                <AnimatedNumbers value={balances.totalStakers} />
              </p>
            </div>
          </div>
          
          <div className="px-6 py-3 rounded-full bg-slate-800/50 border border-cyan-500/20 backdrop-blur-sm flex items-center gap-3">
            <FiDollarSign className="text-cyan-400 w-5 h-5" />
            <div className="text-left">
              <p className="text-xs text-slate-400">TVL</p>
              <p className="text-sm font-bold text-white">
                $<AnimatedNumbers value={balances.totalValueLocked} />
              </p>
            </div>
          </div>
          
          <div className="px-6 py-3 rounded-full bg-slate-800/50 border border-amber-500/20 backdrop-blur-sm flex items-center gap-3">
            <FiTrendingUp className="text-amber-400 w-5 h-5" />
            <div className="text-left">
              <p className="text-xs text-slate-400">Base APY</p>
              <p className="text-sm font-bold text-white">{balances.apy}%</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Global Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Your Staked Balance */}
        <motion.div variants={itemVariants} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
          <div className="relative p-8 rounded-2xl bg-slate-800/50 border border-cyan-500/20 backdrop-blur-xl group-hover:border-cyan-500/50 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Your Staked
                </span>
                <div className="p-3 rounded-xl bg-cyan-500/10">
                  <FiLock className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              
              <h3 className="text-4xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-1">
                <AnimatedNumbers value={balances.staked} />
              </h3>
              <p className="text-sm text-slate-400">TAPIR Tokens</p>
            </div>
          </div>
        </motion.div>

        {/* Pending Rewards */}
        <motion.div variants={itemVariants} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
          <div className="relative p-8 rounded-2xl bg-slate-800/50 border border-green-500/20 backdrop-blur-xl group-hover:border-green-500/50 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Claimable Rewards
                </span>
                <div className="p-3 rounded-xl bg-green-500/10">
                  <FiGift className="w-5 h-5 text-green-400" />
                </div>
              </div>
              
              <h3 className="text-4xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-1">
                <AnimatedNumbers value={balances.rewards} />
              </h3>
              <p className="text-sm text-slate-400">TRWD Tokens</p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClaim}
                disabled={balances.rewards === 0}
                className="w-full mt-4 py-2 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiZap className="inline mr-2" />
                Claim Now
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Current APY */}
        <motion.div variants={itemVariants} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
          <div className="relative p-8 rounded-2xl bg-slate-800/50 border border-amber-500/20 backdrop-blur-xl group-hover:border-amber-500/50 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Your APY
                </span>
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <FiPercent className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              
              <h3 className="text-4xl font-black text-transparent bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text mb-1">
                <AnimatedNumbers value={boostedAPY} />%
              </h3>
              <p className="text-sm text-slate-400">Annual Percentage Yield</p>
              
              {selectedTier.boost > 1 && (
                <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
                  <FiTrendingUp />
                  <span>+{((selectedTier.boost - 1) * 100).toFixed(0)}% Lock Boost</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
      {/* INNOVATIVE: Lock Period Tier Selector */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-2">
            Choose Your Lock Period
          </h2>
          <p className="text-slate-400">Longer locks = Higher rewards! 🚀</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {lockPeriods.map((period, index) => {
            const isSelected = selectedLockPeriod === index;
            const colorMap = {
              cyan: { border: 'border-cyan-500', bg: 'bg-cyan-500', text: 'text-cyan-400', glow: 'shadow-cyan-500' },
              green: { border: 'border-green-500', bg: 'bg-green-500', text: 'text-green-400', glow: 'shadow-green-500' },
              amber: { border: 'border-amber-500', bg: 'bg-amber-500', text: 'text-amber-400', glow: 'shadow-amber-500' },
              purple: { border: 'border-purple-500', bg: 'bg-purple-500', text: 'text-purple-400', glow: 'shadow-purple-500' },
            };
            const colors = colorMap[period.color];

            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedLockPeriod(index);
                  playClick();
                }}
                className={`relative p-6 rounded-2xl transition-all ${
                  isSelected
                    ? `bg-slate-800/80 border-2 ${colors.border} shadow-xl ${colors.glow}/50`
                    : 'bg-slate-800/30 border border-slate-700 hover:border-slate-600'
                }`}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="selectedTier"
                    className={`absolute inset-0 rounded-2xl ${colors.bg}/10`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Selected Badge */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute -top-3 -right-3 w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center shadow-lg`}
                  >
                    <FiTarget className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    animate={isSelected ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-5xl mb-3"
                  >
                    {period.icon}
                  </motion.div>

                  {/* Label */}
                  <h3 className={`text-lg font-bold mb-1 ${isSelected ? colors.text : 'text-white'}`}>
                    {period.label}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">
                    {period.days === 0 ? 'No lock' : `${period.days} days`}
                  </p>

                  {/* APY Display */}
                  <div className={`p-3 rounded-xl ${isSelected ? `${colors.bg}/20` : 'bg-slate-700/50'}`}>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">APY</p>
                    <p className={`text-2xl font-black ${colors.text}`}>
                      {period.apy}%
                    </p>
                  </div>

                  {/* Boost Badge */}
                  {period.boost > 1 && (
                    <div className={`mt-3 px-3 py-1 rounded-full ${colors.bg}/20 inline-flex items-center gap-1`}>
                      <FiZap className={`w-3 h-3 ${colors.text}`} />
                      <span className={`text-xs font-bold ${colors.text}`}>
                        {period.boost}x Boost
                      </span>
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Tier Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{selectedTier.icon}</div>
              <div>
                <p className="text-sm text-slate-400">Selected Plan</p>
                <p className="text-xl font-bold text-white">{selectedTier.label}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div>
                <p className="text-xs text-slate-400 mb-1">Lock Period</p>
                <p className="text-lg font-bold text-cyan-400">
                  {selectedTier.days === 0 ? 'Flexible' : `${selectedTier.days} Days`}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Your APY</p>
                <p className="text-lg font-bold text-green-400">
                  {boostedAPY.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Boost Multiplier</p>
                <p className="text-lg font-bold text-amber-400">
                  {selectedTier.boost}x
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>
      {/* Staking Form */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative overflow-hidden rounded-3xl">
          {/* Animated Gradient Background */}
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-cyan-500/20"
            style={{ backgroundSize: '200% 200%' }}
          />
          
          <div className="relative p-8 bg-slate-800/60 backdrop-blur-xl border border-green-500/30">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-2">
                Stake Your TAPIR
              </h2>
              <p className="text-slate-400 text-sm">
                Enter amount and start earning rewards instantly
              </p>
            </div>

            {/* Wallet Balance Display */}
            <div className="mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="text-cyan-400" />
                  <span className="text-sm text-slate-400">Wallet Balance:</span>
                </div>
                <span className="text-lg font-bold text-white">
                  <AnimatedNumbers value={balances.walletBalance} /> TAPIR
                </span>
              </div>
            </div>

            {/* Amount Input with Quick Select */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Stake Amount
              </label>
              
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-6 py-4 pr-24 rounded-xl bg-slate-900/50 border-2 border-slate-700 focus:border-green-500 text-white text-2xl font-bold placeholder:text-slate-600 focus:outline-none transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMaxAmount}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold shadow-lg"
                >
                  MAX
                </motion.button>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2 mt-3">
                {[25, 50, 75, 100].map((percentage) => (
                  <motion.button
                    key={percentage}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setAmount((balances.walletBalance * (percentage / 100)).toFixed(2));
                      playClick();
                    }}
                    className="flex-1 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-green-500/50 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                  >
                    {percentage}%
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Projected Earnings Display */}
            {amount && !isNaN(amount) && amount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FiTrendingUp className="text-green-400" />
                  <h4 className="font-bold text-green-400">Projected Earnings</h4>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { period: '1 Month', days: 30 },
                    { period: '3 Months', days: 90 },
                    { period: '1 Year', days: 365 },
                  ].map((proj) => {
                    const earnings = calculateProjection(parseFloat(amount), boostedAPY, proj.days);
                    return (
                      <div key={proj.period} className="text-center">
                        <p className="text-xs text-slate-400 mb-1">{proj.period}</p>
                        <p className="text-lg font-bold text-green-400">
                          +{earnings.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500">TRWD</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Lock Period Warning */}
            {selectedTier.days > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3"
              >
                <FiClock className="text-amber-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-400 mb-1">Lock Period Active</p>
                  <p className="text-slate-300">
                    Your tokens will be locked for <span className="font-bold">{selectedTier.days} days</span>.
                    Early withdrawal may result in penalties.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Stake Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStake}
              disabled={!amount || isNaN(amount) || amount <= 0}
              className="w-full py-5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg font-bold shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <FiArrowUpCircle className="w-6 h-6" />
              Stake {amount || '0'} TAPIR
              {selectedTier.boost > 1 && (
                <span className="px-2 py-1 rounded-full bg-white/20 text-xs">
                  {selectedTier.boost}x Boost
                </span>
              )}
            </motion.button>

            {/* Info Footer */}
            <div className="mt-6 pt-6 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <FiActivity className="w-4 h-4" />
                <span>Auto-compound enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <FiAward className="w-4 h-4" />
                <span>Instant rewards</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      {/* INNOVATIVE: Interactive Rewards Calculator */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setShowCalculator(!showCalculator);
            playClick();
          }}
          className="w-full p-6 rounded-2xl bg-slate-800/50 border border-purple-500/30 hover:border-purple-500/50 backdrop-blur-xl transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
              <FiTarget className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-1">Rewards Calculator</h3>
              <p className="text-sm text-slate-400">Plan your staking strategy</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: showCalculator ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiArrowDownCircle className="w-6 h-6 text-purple-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {showCalculator && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="p-8 rounded-2xl bg-slate-800/50 border border-purple-500/20 backdrop-blur-xl">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Calculator Inputs */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Investment Amount
                      </label>
                      <input
                        type="number"
                        value={projectionAmount}
                        onChange={(e) => setProjectionAmount(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 focus:border-purple-500 text-white font-bold focus:outline-none transition-all"
                        placeholder="1000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Time Period (Days)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="365"
                        value={projectionPeriod}
                        onChange={(e) => setProjectionPeriod(e.target.value)}
                        className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-5
                          [&::-webkit-slider-thumb]:h-5
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-gradient-to-r
                          [&::-webkit-slider-thumb]:from-purple-400
                          [&::-webkit-slider-thumb]:to-pink-400
                          [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex justify-between mt-2 text-sm text-slate-400">
                        <span>1 day</span>
                        <span className="font-bold text-purple-400">{projectionPeriod} days</span>
                        <span>365 days</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                      <p className="text-xs text-slate-400 mb-1">Using APY</p>
                      <p className="text-2xl font-black text-purple-400">{boostedAPY.toFixed(2)}%</p>
                    </div>
                  </div>

                  {/* Results Display */}
                  <div className="space-y-4">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                      <p className="text-sm text-slate-400 mb-2">Total Earnings</p>
                      <motion.h3
                        key={projectionAmount + projectionPeriod}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2"
                      >
                        {calculateProjection(
                          parseFloat(projectionAmount) || 0,
                          boostedAPY,
                          projectionPeriod
                        ).toFixed(2)}
                      </motion.h3>
                      <p className="text-sm text-slate-400">TRWD Tokens</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                        <p className="text-xs text-slate-400 mb-1">Principal</p>
                        <p className="text-xl font-bold text-cyan-400">
                          {parseFloat(projectionAmount) || 0}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                        <p className="text-xs text-slate-400 mb-1">Final Value</p>
                        <p className="text-xl font-bold text-green-400">
                          {(parseFloat(projectionAmount) || 0) + 
                            calculateProjection(
                              parseFloat(projectionAmount) || 0,
                              boostedAPY,
                              projectionPeriod
                            )}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3">
                      <FiTrendingUp className="text-green-400 w-5 h-5" />
                      <div className="text-sm">
                        <p className="font-semibold text-green-400">
                          {(
                            (calculateProjection(
                              parseFloat(projectionAmount) || 0,
                              boostedAPY,
                              projectionPeriod
                            ) / (parseFloat(projectionAmount) || 1)) * 100
                          ).toFixed(2)}% ROI
                        </p>
                        <p className="text-slate-400 text-xs">Return on Investment</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Active Stakes Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-green-400 rounded-full" />
          <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text">
            Your Active Stakes
          </h2>
        </div>

        <div className="grid gap-4">
          {/* Example Stake - Replace with actual data */}
          {balances.staked > 0 ? (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-xl hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-cyan-500/10">
                    <FiLock className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">
                      <AnimatedNumbers value={balances.staked} /> TAPIR
                    </h4>
                    <p className="text-sm text-slate-400">
                      {selectedTier.label} • {boostedAPY.toFixed(2)}% APY
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1">Earned</p>
                    <p className="text-lg font-bold text-green-400">
                      <AnimatedNumbers value={balances.rewards} /> TRWD
                    </p>
                  </div>
                  
                  {selectedTier.days > 0 && (
                    <div className="text-right">
                      <p className="text-xs text-slate-400 mb-1">Unlocks in</p>
                      <p className="text-lg font-bold text-amber-400">
                        {selectedTier.days} days
                      </p>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:border-rose-500/50 text-rose-400 font-semibold text-sm transition-all"
                  >
                    <FiUnlock className="inline mr-2" />
                    Unstake
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-800/30 border border-slate-700 text-center">
              <div className="text-6xl mb-4">🥩</div>
              <p className="text-slate-400 mb-2">No active stakes yet</p>
              <p className="text-sm text-slate-500">Stake your TAPIR tokens above to start earning!</p>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}