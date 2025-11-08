import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAccount } from "wagmi";
import { useReadContract, useWriteContract } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiLayers,
  FiShield,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiPercent,
  FiActivity,
  FiClock,
  FiZap,
  FiTarget,
  FiBarChart2,
  FiPieChart
} from "react-icons/fi";
import { LENDING_ABI } from "../config/abis";
import { CONTRACTS } from "../contracts/addresses";
import GlassCard from "./GlassCard";
import AnimatedNumbers from "../hooks/useCountUp";
import { toast } from "react-hot-toast";
import { playClick, playSuccess, playError } from "../utils/sounds";

export default function Lending() {
  const { theme } = useTheme();
  const { address } = useAccount();
  
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("deposit"); // deposit, borrow, repay
  const [showRiskAnalysis, setShowRiskAnalysis] = useState(false);
  const [showLiquidationWarning, setShowLiquidationWarning] = useState(false);
  
  const [stats, setStats] = useState({
    collateral: 1250,
    borrowed: 450,
    available: 800,
    ltv: 36,
    healthFactor: 2.78,
    liquidationPrice: 0.65,
    interestRate: 8.5,
    totalSupplied: 2500000,
    totalBorrowed: 1750000,
    utilizationRate: 70,
    walletBalance: 5000,
  });

  // Risk levels based on health factor
  const getRiskLevel = (healthFactor) => {
    if (healthFactor >= 2) return { 
      level: "Safe", 
      color: "green", 
      icon: FiCheckCircle,
      description: "Your position is healthy"
    };
    if (healthFactor >= 1.5) return { 
      level: "Moderate", 
      color: "amber", 
      icon: FiAlertTriangle,
      description: "Monitor your position"
    };
    if (healthFactor >= 1.2) return { 
      level: "Risky", 
      color: "orange", 
      icon: FiAlertTriangle,
      description: "Consider adding collateral"
    };
    return { 
      level: "Critical", 
      color: "red", 
      icon: FiXCircle,
      description: "High liquidation risk!"
    };
  };

  const riskLevel = getRiskLevel(stats.healthFactor);

  // Live contract data
  const { data: accountInfo } = useReadContract({
    address: CONTRACTS.sepolia.lendingPool,
    abi: LENDING_ABI,
    functionName: "getAccountInfo",
    args: [address],
    watch: true,
  });

  useEffect(() => {
    if (accountInfo && Array.isArray(accountInfo)) {
      const collateral = Number(accountInfo[0]) / 1e18;
      const borrowed = Number(accountInfo[1]) / 1e18;
      const ltv = borrowed > 0 ? (borrowed / collateral) * 100 : 0;
      const healthFactor = borrowed > 0 ? (collateral * 0.75) / borrowed : 999;
      
      setStats(prev => ({
        ...prev,
        collateral,
        borrowed,
        available: Number(accountInfo[3]) / 1e18,
        ltv: ltv.toFixed(2),
        healthFactor: healthFactor.toFixed(2),
      }));

      // Show liquidation warning if health factor is low
      setShowLiquidationWarning(healthFactor < 1.3 && borrowed > 0);
    }
  }, [accountInfo]);

  const { writeContractAsync } = useWriteContract();

  // Calculate how much user can safely borrow
  const maxSafeBorrow = (stats.collateral * 0.75) - stats.borrowed;
  
  // Calculate projected health factor after action
  const calculateProjectedHealth = (action, amt) => {
    let newCollateral = stats.collateral;
    let newBorrowed = stats.borrowed;
    
    if (action === 'deposit') newCollateral += parseFloat(amt || 0);
    if (action === 'borrow') newBorrowed += parseFloat(amt || 0);
    if (action === 'repay') newBorrowed -= parseFloat(amt || 0);
    
    if (newBorrowed === 0) return 999;
    return ((newCollateral * 0.75) / newBorrowed).toFixed(2);
  };

  const projectedHealth = amount && !isNaN(amount) 
    ? calculateProjectedHealth(activeTab, amount) 
    : stats.healthFactor;

  const handleDeposit = async () => {
    playClick();
    if (!amount || isNaN(amount) || amount <= 0) {
      playError();
      toast.error("Enter a valid deposit amount.");
      return;
    }
    try {
      toast.loading("Depositing collateral...");
      await writeContractAsync({
        address: CONTRACTS.sepolia.lendingPool,
        abi: LENDING_ABI,
        functionName: "depositCollateral",
        args: [BigInt(Math.floor(amount * 1e18))],
      });
      toast.dismiss();
      playSuccess();
      toast.success(`Deposited ${amount} TAPIR successfully! 🎉`);
      setAmount("");
    } catch (err) {
      toast.dismiss();
      playError();
      toast.error("Deposit failed.");
      console.error(err);
    }
  };

  const handleBorrow = async () => {
    playClick();
    if (!amount || isNaN(amount) || amount <= 0) {
      playError();
      toast.error("Enter a valid borrow amount.");
      return;
    }
    if (parseFloat(amount) > maxSafeBorrow) {
      playError();
      toast.error("Amount exceeds safe borrowing limit!");
      return;
    }
    try {
      toast.loading("Borrowing TAPIR...");
      await writeContractAsync({
        address: CONTRACTS.sepolia.lendingPool,
        abi: LENDING_ABI,
        functionName: "borrow",
        args: [BigInt(Math.floor(amount * 1e18))],
      });
      toast.dismiss();
      playSuccess();
      toast.success(`Borrowed ${amount} TAPIR successfully! 💰`);
      setAmount("");
    } catch (err) {
      toast.dismiss();
      playError();
      toast.error("Borrow failed.");
      console.error(err);
    }
  };

  const handleRepay = async () => {
    playClick();
    if (!amount || isNaN(amount) || amount <= 0) {
      playError();
      toast.error("Enter a valid repay amount.");
      return;
    }
    try {
      toast.loading("Repaying loan...");
      await writeContractAsync({
        address: CONTRACTS.sepolia.lendingPool,
        abi: LENDING_ABI,
        functionName: "repay",
        args: [BigInt(Math.floor(amount * 1e18))],
      });
      toast.dismiss();
      playSuccess();
      toast.success(`Repaid ${amount} TAPIR successfully! ✨`);
      setAmount("");
    } catch (err) {
      toast.dismiss();
      playError();
      toast.error("Repayment failed.");
      console.error(err);
    }
  };

  const handleMaxAmount = () => {
    if (activeTab === 'deposit') {
      setAmount(stats.walletBalance.toString());
    } else if (activeTab === 'borrow') {
      setAmount(Math.max(0, maxSafeBorrow * 0.9).toFixed(2)); // 90% of max for safety
    } else if (activeTab === 'repay') {
      setAmount(stats.borrowed.toString());
    }
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
            x: [0, 80, 0],
            y: [0, -80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Liquidation Warning Banner */}
      <AnimatePresence>
        {showLiquidationWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent"
            />
            <div className="relative p-6 bg-red-500/10 border-2 border-red-500/50 backdrop-blur-xl flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FiAlertTriangle className="w-8 h-8 text-red-400" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-400 mb-1">⚠️ Liquidation Risk Warning</h3>
                <p className="text-sm text-red-300">
                  Your health factor is below 1.3. Add more collateral or repay debt to avoid liquidation!
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('deposit')}
                className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/30"
              >
                Add Collateral Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-8xl mb-6 inline-block"
        >
          🏦
        </motion.div>
        
        <h1 className="text-6xl md:text-7xl font-black mb-4">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Lending Protocol
          </span>
        </h1>
        
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
          Deposit collateral, borrow assets, and maximize your capital efficiency with dynamic interest rates
        </p>

        {/* Protocol Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <div className="px-6 py-3 rounded-full bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm flex items-center gap-3">
            <FiDollarSign className="text-purple-400 w-5 h-5" />
            <div className="text-left">
              <p className="text-xs text-slate-400">Total Supplied</p>
              <p className="text-sm font-bold text-white">
                $<AnimatedNumbers value={stats.totalSupplied} />
              </p>
            </div>
          </div>
          
          <div className="px-6 py-3 rounded-full bg-slate-800/50 border border-cyan-500/20 backdrop-blur-sm flex items-center gap-3">
            <FiBarChart2 className="text-cyan-400 w-5 h-5" />
            <div className="text-left">
              <p className="text-xs text-slate-400">Total Borrowed</p>
              <p className="text-sm font-bold text-white">
                $<AnimatedNumbers value={stats.totalBorrowed} />
              </p>
            </div>
          </div>
          
          <div className="px-6 py-3 rounded-full bg-slate-800/50 border border-green-500/20 backdrop-blur-sm flex items-center gap-3">
            <FiActivity className="text-green-400 w-5 h-5" />
            <div className="text-left">
              <p className="text-xs text-slate-400">Utilization</p>
              <p className="text-sm font-bold text-white">{stats.utilizationRate}%</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* INNOVATIVE: Health Factor Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
          className={`absolute inset-0 bg-gradient-to-br from-${riskLevel.color}-500/20 to-${riskLevel.color}-500/5`}
          style={{ backgroundSize: '200% 200%' }}
        />
        
        <div className="relative p-8 bg-slate-800/60 backdrop-blur-xl border border-slate-700">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Health Factor Gauge */}
            <div className="md:col-span-1 flex flex-col items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64 opacity-10"
              >
                <div className={`w-full h-full rounded-full bg-gradient-to-r from-${riskLevel.color}-500 to-${riskLevel.color}-300 blur-3xl`} />
              </motion.div>
              
              <div className="relative z-10 text-center">
                <riskLevel.icon className={`w-16 h-16 text-${riskLevel.color}-400 mx-auto mb-4`} />
                <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">Health Factor</p>
                <motion.h2
                  key={stats.healthFactor}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-7xl font-black text-${riskLevel.color}-400 mb-2`}
                >
                  {stats.healthFactor}
                </motion.h2>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${riskLevel.color}-500/20 border border-${riskLevel.color}-500/50`}>
                  <span className={`text-sm font-bold text-${riskLevel.color}-400`}>{riskLevel.level}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{riskLevel.description}</p>
              </div>
            </div>

            {/* Position Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Collateral */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-cyan-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-cyan-500/10">
                      <FiShield className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Total Collateral</p>
                      <h3 className="text-3xl font-black text-cyan-400">
                        <AnimatedNumbers value={stats.collateral} />
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">USD Value</p>
                    <p className="text-lg font-bold text-white">
                      ${(stats.collateral * 1.5).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Borrowed */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-purple-500/10">
                      <FiTrendingDown className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Total Borrowed</p>
                      <h3 className="text-3xl font-black text-purple-400">
                        <AnimatedNumbers value={stats.borrowed} />
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Interest Rate</p>
                    <p className="text-lg font-bold text-amber-400">
                      {stats.interestRate}% APR
                    </p>
                  </div>
                </div>
              </div>

              {/* LTV Ratio Bar */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-amber-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Loan-to-Value Ratio</p>
                    <p className="text-2xl font-black text-amber-400">{stats.ltv}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Max LTV</p>
                    <p className="text-lg font-bold text-white">75%</p>
                  </div>
                </div>
                
                <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.ltv / 75) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full bg-gradient-to-r ${
                      stats.ltv < 50 ? 'from-green-500 to-emerald-500' :
                      stats.ltv < 65 ? 'from-amber-500 to-orange-500' :
                      'from-red-500 to-rose-500'
                    }`}
                  />
                  <div className="absolute inset-0 flex items-center justify-end pr-2">
                    <motion.div
                      animate={{ x: [-2, 2, -2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1 h-6 bg-white rounded-full shadow-lg"
                      style={{ marginRight: `${100 - ((stats.ltv / 75) * 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between mt-2 text-xs text-slate-400">
                  <span>Safe</span>
                  <span>Moderate</span>
                  <span>Risky</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Action Selection & Form */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-2 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm gap-2">
            {[
              { id: 'deposit', label: 'Deposit', icon: FiTrendingUp, color: 'cyan' },
              { id: 'borrow', label: 'Borrow', icon: FiLayers, color: 'purple' },
              { id: 'repay', label: 'Repay', icon: FiTrendingDown, color: 'green' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const colorMap = {
                cyan: 'from-cyan-500 to-blue-500',
                purple: 'from-purple-500 to-pink-500',
                green: 'from-green-500 to-emerald-500',
              };
              
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setAmount("");
                    playClick();
                  }}
                  className={`relative px-8 py-4 rounded-xl font-semibold transition-all ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-r ${colorMap[tab.color]} rounded-xl`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Action Form */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            className={`absolute inset-0 ${
              activeTab === 'deposit' ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/10' :
              activeTab === 'borrow' ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/10' :
              'bg-gradient-to-br from-green-500/20 to-emerald-500/10'
            }`}
            style={{ backgroundSize: '200% 200%' }}
          />
          
          <div className="relative p-8 bg-slate-800/60 backdrop-blur-xl border border-slate-700">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-black mb-2 ${
                activeTab === 'deposit' ? 'text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text' :
                activeTab === 'borrow' ? 'text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text' :
                'text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text'
              }`}>
                {activeTab === 'deposit' && 'Supply Collateral'}
                {activeTab === 'borrow' && 'Borrow Assets'}
                {activeTab === 'repay' && 'Repay Loan'}
              </h2>
              <p className="text-slate-400 text-sm">
                {activeTab === 'deposit' && 'Add TAPIR tokens as collateral to increase borrowing power'}
                {activeTab === 'borrow' && 'Borrow against your collateral at competitive rates'}
                {activeTab === 'repay' && 'Pay back your loan to unlock collateral'}
              </p>
            </div>

            {/* Available Balance */}
            <div className="mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="text-slate-400" />
                  <span className="text-sm text-slate-400">
                    {activeTab === 'deposit' && 'Wallet Balance:'}
                    {activeTab === 'borrow' && 'Available to Borrow:'}
                    {activeTab === 'repay' && 'Total Debt:'}
                  </span>
                </div>
                <span className="text-lg font-bold text-white">
                  {activeTab === 'deposit' && <AnimatedNumbers value={stats.walletBalance} />}
                  {activeTab === 'borrow' && <AnimatedNumbers value={Math.max(0, maxSafeBorrow)} />}
                  {activeTab === 'repay' && <AnimatedNumbers value={stats.borrowed} />}
                  {' TAPIR'}
                </span>
              </div>
              
              {activeTab === 'borrow' && (
                <div className="mt-2 pt-2 border-t border-slate-700 flex items-center gap-2 text-xs text-amber-400">
                  <FiAlertTriangle className="w-3 h-3" />
                  <span>Borrowing affects your health factor. Borrow responsibly!</span>
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Amount
              </label>
              
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full px-6 py-5 pr-24 rounded-xl bg-slate-900/50 border-2 ${
                    activeTab === 'deposit' ? 'border-cyan-500/30 focus:border-cyan-500' :
                    activeTab === 'borrow' ? 'border-purple-500/30 focus:border-purple-500' :
                    'border-green-500/30 focus:border-green-500'
                  } text-white text-3xl font-bold placeholder:text-slate-600 focus:outline-none transition-all`}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMaxAmount}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-lg bg-gradient-to-r ${
                    activeTab === 'deposit' ? 'from-cyan-500 to-blue-500' :
                    activeTab === 'borrow' ? 'from-purple-500 to-pink-500' :
                    'from-green-500 to-emerald-500'
                  } text-white text-sm font-bold shadow-lg`}
                >
                  MAX
                </motion.button>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2 mt-3">
                {[25, 50, 75].map((percentage) => (
                  <motion.button
                    key={percentage}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      let maxAmount = 0;
                      if (activeTab === 'deposit') maxAmount = stats.walletBalance;
                      else if (activeTab === 'borrow') maxAmount = Math.max(0, maxSafeBorrow);
                      else if (activeTab === 'repay') maxAmount = stats.borrowed;
                      
                      setAmount((maxAmount * (percentage / 100)).toFixed(2));
                      playClick();
                    }}
                    className={`flex-1 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 border border-slate-600 ${
                      activeTab === 'deposit' ? 'hover:border-cyan-500/50' :
                      activeTab === 'borrow' ? 'hover:border-purple-500/50' :
                      'hover:border-green-500/50'
                    } text-xs font-semibold text-slate-300 hover:text-white transition-all`}
                  >
                    {percentage}%
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Projected Health Factor Display */}
            {amount && !isNaN(amount) && amount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-6 rounded-xl bg-slate-900/50 border border-amber-500/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FiTarget className="text-amber-400" />
                    <h4 className="font-bold text-amber-400">After Transaction</h4>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Current Health Factor</p>
                    <p className={`text-2xl font-black text-${getRiskLevel(stats.healthFactor).color}-400`}>
                      {stats.healthFactor}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Projected Health Factor</p>
                    <motion.p
                      key={projectedHealth}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className={`text-2xl font-black text-${getRiskLevel(projectedHealth).color}-400`}
                    >
                      {projectedHealth} 
                      {projectedHealth > stats.healthFactor && <FiTrendingUp className="inline ml-2 text-green-400" />}
                      {projectedHealth < stats.healthFactor && <FiTrendingDown className="inline ml-2 text-red-400" />}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={
                activeTab === 'deposit' ? handleDeposit :
                activeTab === 'borrow' ? handleBorrow :
                handleRepay
              }
              disabled={!amount || isNaN(amount) || amount <= 0}
              className={`w-full py-6 rounded-xl bg-gradient-to-r ${
                activeTab === 'deposit' ? 'from-cyan-500 to-blue-500 shadow-cyan-500/30 hover:shadow-cyan-500/50' :
                activeTab === 'borrow' ? 'from-purple-500 to-pink-500 shadow-purple-500/30 hover:shadow-purple-500/50' :
                'from-green-500 to-emerald-500 shadow-green-500/30 hover:shadow-green-500/50'
              } text-white text-lg font-bold shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
            >
              {activeTab === 'deposit' && <FiTrendingUp className="w-6 h-6" />}
              {activeTab === 'borrow' && <FiLayers className="w-6 h-6" />}
              {activeTab === 'repay' && <FiTrendingDown className="w-6 h-6" />}
              
              {activeTab === 'deposit' && `Deposit ${amount || '0'} TAPIR`}
              {activeTab === 'borrow' && `Borrow ${amount || '0'} TAPIR`}
              {activeTab === 'repay' && `Repay ${amount || '0'} TAPIR`}
            </motion.button>

            {/* Info Footer */}
            <div className="mt-6 pt-6 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <FiShield className="w-4 h-4" />
                <span>Secured by smart contract</span>
              </div>
              <div className="flex items-center gap-2">
                <FiZap className="w-4 h-4" />
                <span>Instant execution</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>
      {/* INNOVATIVE: Risk Analysis & Simulator */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setShowRiskAnalysis(!showRiskAnalysis);
            playClick();
          }}
          className="w-full p-6 rounded-2xl bg-slate-800/50 border border-amber-500/30 hover:border-amber-500/50 backdrop-blur-xl transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
              <FiPieChart className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-1">Risk Analysis & Position Simulator</h3>
              <p className="text-sm text-slate-400">Visualize liquidation scenarios and optimize your position</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: showRiskAnalysis ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiTrendingDown className="w-6 h-6 text-amber-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {showRiskAnalysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="p-8 rounded-2xl bg-slate-800/50 border border-amber-500/20 backdrop-blur-xl space-y-8">
                
                {/* Liquidation Price Calculator */}
                <div>
                  <h3 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                    <FiAlertTriangle />
                    Liquidation Analysis
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Liquidation Threshold */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-red-500/20">
                          <FiXCircle className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Liquidation Threshold</p>
                          <p className="text-xs text-slate-500">When health factor drops to 1.0</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-400">Max LTV</span>
                          <span className="text-sm font-bold text-white">75%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-400">Current LTV</span>
                          <span className="text-sm font-bold text-amber-400">{stats.ltv}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-400">Buffer</span>
                          <span className="text-sm font-bold text-green-400">
                            {(75 - stats.ltv).toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                        <p className="text-xs text-slate-400 mb-1">Liquidation Price</p>
                        <p className="text-2xl font-black text-red-400">
                          ${stats.liquidationPrice.toFixed(4)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">per TAPIR token</p>
                      </div>
                    </div>

                    {/* Safety Recommendations */}
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                        <div className="flex items-start gap-3">
                          <FiCheckCircle className="w-5 h-5 text-green-400 mt-1" />
                          <div>
                            <h4 className="font-bold text-green-400 mb-1">Safe Zone</h4>
                            <p className="text-sm text-slate-300">
                              Keep health factor above <span className="font-bold">2.0</span> for maximum safety
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                        <div className="flex items-start gap-3">
                          <FiAlertTriangle className="w-5 h-5 text-amber-400 mt-1" />
                          <div>
                            <h4 className="font-bold text-amber-400 mb-1">Warning Zone</h4>
                            <p className="text-sm text-slate-300">
                              Health factor between <span className="font-bold">1.2-2.0</span> requires monitoring
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                        <div className="flex items-start gap-3">
                          <FiXCircle className="w-5 h-5 text-red-400 mt-1" />
                          <div>
                            <h4 className="font-bold text-red-400 mb-1">Danger Zone</h4>
                            <p className="text-sm text-slate-300">
                              Health factor below <span className="font-bold">1.2</span> risks immediate liquidation
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Impact Scenarios */}
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <FiBarChart2 />
                    Price Impact Scenarios
                  </h3>
                  
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { change: -10, label: '-10%', color: 'red' },
                      { change: -5, label: '-5%', color: 'orange' },
                      { change: 5, label: '+5%', color: 'green' },
                      { change: 10, label: '+10%', color: 'emerald' },
                    ].map((scenario) => {
                      // Simulate price change impact on health factor
                      const newCollateralValue = stats.collateral * (1 + scenario.change / 100);
                      const newHealth = stats.borrowed > 0 
                        ? ((newCollateralValue * 0.75) / stats.borrowed).toFixed(2)
                        : 999;
                      const healthRisk = getRiskLevel(newHealth);

                      return (
                        <motion.div
                          key={scenario.change}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className={`p-6 rounded-xl bg-${scenario.color}-500/10 border border-${scenario.color}-500/30 text-center`}
                        >
                          <p className="text-xs text-slate-400 mb-2">Price {scenario.label}</p>
                          <p className={`text-3xl font-black text-${scenario.color}-400 mb-2`}>
                            {newHealth}
                          </p>
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-${healthRisk.color}-500/20 border border-${healthRisk.color}-500/50`}>
                            <span className={`text-xs font-bold text-${healthRisk.color}-400`}>
                              {healthRisk.level}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Interest Accrual Projection */}
                <div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <FiClock />
                    Interest Accrual Over Time
                  </h3>
                  
                  <div className="p-6 rounded-xl bg-slate-900/50 border border-purple-500/20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { period: '1 Week', days: 7 },
                        { period: '1 Month', days: 30 },
                        { period: '3 Months', days: 90 },
                        { period: '1 Year', days: 365 },
                      ].map((timeframe) => {
                        const interest = (stats.borrowed * (stats.interestRate / 100) * (timeframe.days / 365));
                        return (
                          <div key={timeframe.period} className="text-center">
                            <p className="text-xs text-slate-400 mb-2">{timeframe.period}</p>
                            <p className="text-2xl font-black text-purple-400 mb-1">
                              +{interest.toFixed(2)}
                            </p>
                            <p className="text-xs text-slate-500">TAPIR interest</p>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">Current Interest Rate</p>
                        <p className="text-lg font-bold text-purple-400">{stats.interestRate}% APR</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Daily Interest</p>
                        <p className="text-lg font-bold text-white">
                          {(stats.borrowed * (stats.interestRate / 100 / 365)).toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optimization Tips */}
                <div className="p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <FiZap />
                    Position Optimization Tips
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-500/20 mt-1">
                        <FiTrendingUp className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">Increase Collateral</h4>
                        <p className="text-sm text-slate-400">
                          Add ${((stats.borrowed * 2) - stats.collateral).toFixed(2)} TAPIR to reach 2x health factor
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/20 mt-1">
                        <FiTrendingDown className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">Reduce Debt</h4>
                        <p className="text-sm text-slate-400">
                          Repay {(stats.borrowed * 0.3).toFixed(2)} TAPIR to improve position safety
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
      {/* Position Summary Cards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full" />
          <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
            Your Positions
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Collateral Position */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
            <div className="relative p-8 bg-slate-800/50 border border-cyan-500/20 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">
                    Collateral Position
                  </p>
                  <h3 className="text-4xl font-black text-cyan-400">
                    <AnimatedNumbers value={stats.collateral} />
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">TAPIR Tokens</p>
                </div>
                <div className="p-4 rounded-xl bg-cyan-500/10">
                  <FiShield className="w-8 h-8 text-cyan-400" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">USD Value</span>
                  <span className="text-lg font-bold text-white">
                    ${(stats.collateral * 1.5).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Borrowing Power</span>
                  <span className="text-lg font-bold text-green-400">
                    {(stats.collateral * 0.75).toFixed(2)} TAPIR
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Used</span>
                  <span className="text-lg font-bold text-amber-400">
                    {stats.borrowed > 0 ? ((stats.borrowed / (stats.collateral * 0.75)) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>

              <div className="mt-6 h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${stats.borrowed > 0 ? (stats.borrowed / (stats.collateral * 0.75)) * 100 : 0}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Borrow Position */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
            <div className="relative p-8 bg-slate-800/50 border border-purple-500/20 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">
                    Borrow Position
                  </p>
                  <h3 className="text-4xl font-black text-purple-400">
                    <AnimatedNumbers value={stats.borrowed} />
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">TAPIR Tokens</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/10">
                  <FiLayers className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Debt Value</span>
                  <span className="text-lg font-bold text-white">
                    ${(stats.borrowed * 1.5).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Interest Rate</span>
                  <span className="text-lg font-bold text-amber-400">
                    {stats.interestRate}% APR
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Daily Interest</span>
                  <span className="text-lg font-bold text-rose-400">
                    {(stats.borrowed * (stats.interestRate / 100 / 365)).toFixed(4)} TAPIR
                  </span>
                </div>
              </div>

              {stats.borrowed > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveTab('repay');
                    playClick();
                  }}
                  className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg shadow-purple-500/30"
                >
                  Repay Debt
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Market Information */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full" />
          <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
            Market Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Supply */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-green-500/20 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <FiTrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Total Supply</p>
            </div>
            <h4 className="text-2xl font-black text-green-400 mb-1">
              $<AnimatedNumbers value={stats.totalSupplied} />
            </h4>
            <p className="text-xs text-slate-500">Available liquidity</p>
          </motion.div>

          {/* Total Borrowed */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-purple-500/20 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <FiTrendingDown className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Total Borrowed</p>
            </div>
            <h4 className="text-2xl font-black text-purple-400 mb-1">
              $<AnimatedNumbers value={stats.totalBorrowed} />
            </h4>
            <p className="text-xs text-slate-500">Outstanding loans</p>
          </motion.div>

          {/* Utilization Rate */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-amber-500/20 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <FiPercent className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Utilization</p>
            </div>
            <h4 className="text-2xl font-black text-amber-400 mb-1">
              {stats.utilizationRate}%
            </h4>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${stats.utilizationRate}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-green-500 to-amber-500"
              />
            </div>
          </motion.div>

          {/* Current APR */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-cyan-500/20 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <FiActivity className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Borrow APR</p>
            </div>
            <h4 className="text-2xl font-black text-cyan-400 mb-1">
              {stats.interestRate}%
            </h4>
            <p className="text-xs text-slate-500">Variable rate</p>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50" />
        <div className="relative p-8 border border-slate-700 backdrop-blur-xl">
          <h2 className="text-3xl font-black text-center text-white mb-8">
            How Lending Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                icon: FiTrendingUp,
                title: 'Deposit Collateral',
                description: 'Supply TAPIR tokens as collateral to secure your borrowing position',
                color: 'cyan'
              },
              {
                step: '2',
                icon: FiLayers,
                title: 'Borrow Assets',
                description: 'Borrow up to 75% of your collateral value at competitive interest rates',
                color: 'purple'
              },
              {
                step: '3',
                icon: FiShield,
                title: 'Stay Safe',
                description: 'Monitor your health factor and add collateral or repay to avoid liquidation',
                color: 'green'
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * index }}
                className="relative"
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-${item.color}-500/10 border border-${item.color}-500/30 mb-4`}>
                    <item.icon className={`w-8 h-8 text-${item.color}-400`} />
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full bg-${item.color}-500/20 text-${item.color}-400 text-xs font-bold mb-3`}>
                    STEP {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-12 w-24">
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="h-0.5 bg-gradient-to-r from-slate-600 to-transparent" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}