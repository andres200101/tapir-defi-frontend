import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import Staking from './components/Staking';
import Lending from './components/Lending';
import { useTheme } from './contexts/ThemeContext';
import AnimatedBackground from './components/AnimatedBackground';
import { toggleSound, isSoundEnabled, playClick, setSoundVolume, playWelcome } from './utils/sounds';
import { FiSun, FiMoon, FiVolume2, FiVolumeX, FiMenu, FiX, FiZap, FiShield, FiTrendingUp } from 'react-icons/fi';

function App() {
  const { isConnected } = useAccount();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Detect scroll for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundEnabled(newState);
    playClick();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    playClick();
  };

  useEffect(() => {
    if (isConnected && !hasPlayedWelcome) {
      setTimeout(() => {
        playWelcome();
        setHasPlayedWelcome(true);
      }, 500);
    } else if (!isConnected) {
      setHasPlayedWelcome(false);
    }
  }, [isConnected, hasPlayedWelcome]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', gradient: 'from-cyan-400 to-blue-500' },
    { id: 'staking', label: 'Staking', icon: '🥩', gradient: 'from-green-400 to-emerald-500' },
    { id: 'lending', label: 'Lending', icon: '🏦', gradient: 'from-purple-400 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* INNOVATIVE: Interactive Mouse Follower Gradient */}
      <motion.div
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />
      
      {/* Enhanced Floating Orbs with 3D Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 100 * (i % 2 ? 1 : -1), 0],
              y: [0, -100 * (i % 2 ? 1 : -1), 0],
              scale: [1, 1.2 + i * 0.1, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
            className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
            style={{
              background: `radial-gradient(circle, ${
                ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][i]
              }40 0%, transparent 70%)`,
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Premium Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-slate-900/90 backdrop-blur-2xl border-b border-cyan-500/30 shadow-2xl shadow-cyan-500/20' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with Enhanced Glow */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4 group cursor-pointer"
            >
              <div className="relative">
                <motion.img
                  src={theme === 'light' ? '/logo_light.png' : '/logo_circ.png'}
                  alt="Tapir DeFi"
                  className="h-14 w-14 relative z-10 transition-transform duration-300"
                  whileHover={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1.1, 1.1, 1]
                  }}
                  transition={{ duration: 0.6 }}
                />
                {/* Multi-layered Glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.9, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-xl"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 via-cyan-500 to-purple-500 rounded-full blur-2xl"
                />
              </div>
              <div>
                <motion.h1 
                  className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{
                    backgroundSize: '200% 100%',
                  }}
                >
                  TAPIR
                </motion.h1>
                <p className="text-xs text-cyan-400/60 font-medium tracking-wider">DeFi Protocol</p>
              </div>
            </motion.div>

            {/* Desktop Controls with Enhanced Design */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="relative p-3 rounded-xl bg-slate-800/50 border border-cyan-500/20 hover:border-cyan-500/40 backdrop-blur-sm group overflow-hidden transition-all"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                {theme === 'dark' ? (
                  <FiSun className="w-5 h-5 text-amber-400 relative z-10" />
                ) : (
                  <FiMoon className="w-5 h-5 text-cyan-400 relative z-10" />
                )}
              </motion.button>

              {/* Sound Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSoundToggle}
                className="relative p-3 rounded-xl bg-slate-800/50 border border-cyan-500/20 hover:border-cyan-500/40 backdrop-blur-sm group overflow-hidden transition-all"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0"
                  animate={soundEnabled ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                {soundEnabled ? (
                  <FiVolume2 className="w-5 h-5 text-green-400 relative z-10" />
                ) : (
                  <FiVolumeX className="w-5 h-5 text-red-400 relative z-10" />
                )}
              </motion.button>

              {/* Enhanced Volume Slider */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/50 border border-cyan-500/20 backdrop-blur-sm">
                <FiVolume2 className="w-4 h-4 text-cyan-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="30"
                  onChange={(e) => setSoundVolume(e.target.value / 100)}
                  className="w-24 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-gradient-to-r
                    [&::-webkit-slider-thumb]:from-cyan-400
                    [&::-webkit-slider-thumb]:to-purple-400
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:shadow-cyan-500/50
                    [&::-webkit-slider-thumb]:transition-all
                    [&::-webkit-slider-thumb]:hover:scale-125"
                />
              </div>

              {/* Enhanced Connect Button */}
              <div className="relative group">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl blur-lg"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 via-cyan-500 to-purple-500 rounded-xl blur-2xl"
                />
                <div className="relative">
                  <ConnectButton />
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-slate-800/50 border border-cyan-500/20 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6 text-cyan-400 relative z-10" />
              ) : (
                <FiMenu className="w-6 h-6 text-cyan-400 relative z-10" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>
      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-80 bg-slate-900/95 backdrop-blur-xl border-l border-cyan-500/30 z-50 lg:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full p-6">
                {/* Menu Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10">
                      <FiMenu className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                      Menu
                    </h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                  >
                    <FiX className="w-6 h-6 text-cyan-400" />
                  </motion.button>
                </div>

                {/* Tab Navigation */}
                <div className="space-y-3 flex-1">
                  {tabs.map((tab, index) => (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all relative overflow-hidden ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50'
                          : 'bg-slate-800/30 border border-transparent hover:border-cyan-500/30'
                      }`}
                    >
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="mobileActiveTab"
                          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <div className="relative z-10 flex items-center gap-3">
                        <span className="text-2xl">{tab.icon}</span>
                        <span className="font-semibold">{tab.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Settings Section */}
                <div className="space-y-3 pt-6 border-t border-slate-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleTheme}
                    className="w-full p-4 rounded-xl bg-slate-800/50 border border-cyan-500/20 flex items-center justify-between group hover:border-cyan-500/40 transition-all"
                  >
                    <span className="font-semibold">Theme</span>
                    <div className="flex items-center gap-2">
                      {theme === 'dark' ? (
                        <FiSun className="w-5 h-5 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
                      ) : (
                        <FiMoon className="w-5 h-5 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
                      )}
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSoundToggle}
                    className="w-full p-4 rounded-xl bg-slate-800/50 border border-cyan-500/20 flex items-center justify-between hover:border-cyan-500/40 transition-all"
                  >
                    <span className="font-semibold">Sound</span>
                    {soundEnabled ? (
                      <FiVolume2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <FiVolumeX className="w-5 h-5 text-red-400" />
                    )}
                  </motion.button>
                  
                  <div className="pt-3">
                    <ConnectButton />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative pt-32 pb-20 px-4 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              {/* ENHANCED Hero Section with Advanced Animations */}
              <div className="max-w-5xl mx-auto text-center">
                {/* 3D Rotating Logo with Particle Effect */}
                <motion.div
                  className="relative inline-block mb-12"
                >
                  {/* Particle Ring Effect */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                      style={{
                        top: '50%',
                        left: '50%',
                      }}
                      animate={{
                        x: [0, Math.cos(i * 30 * Math.PI / 180) * 150],
                        y: [0, Math.sin(i * 30 * Math.PI / 180) * 150],
                        scale: [1, 0],
                        opacity: [1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                    />
                  ))}

                  {/* Main Logo */}
                  <motion.div
                    animate={{
                      y: [0, -30, 0],
                      rotateY: [0, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative z-10"
                  >
                    <img
                      src={theme === 'light' ? '/logo_light.png' : '/logo_circ.png'}
                      alt="Tapir"
                      className="w-56 h-56 mx-auto drop-shadow-2xl"
                    />
                  </motion.div>

                  {/* Multi-layered Pulsing Glow */}
                  <motion.div
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.3, 0.7, 0.3],
                      rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-3xl"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.2, 0.5, 0.2],
                      rotate: [360, 180, 0],
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 via-cyan-500 to-purple-500 rounded-full blur-[100px]"
                  />
                </motion.div>

                {/* Animated Text with Shimmer Effect */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl lg:text-8xl font-black mb-6 relative"
                >
                  <motion.span
                    className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    style={{
                      backgroundSize: '200% 100%',
                    }}
                  >
                    Welcome to TAPIR
                  </motion.span>
                  
                  {/* Text Glow Effect */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent blur-2xl opacity-50"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Welcome to TAPIR
                  </motion.span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl lg:text-2xl text-slate-300 mb-4 font-light"
                >
                  The Next Generation of Decentralized Finance
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-cyan-400 mb-12 text-lg font-medium tracking-wide flex items-center justify-center gap-2"
                >
                  <span>Endangered in the wild. Thriving in Web3</span>
                  <motion.span
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🦫⚡
                  </motion.span>
                </motion.p>
                {/* INNOVATIVE: Live Stats Ticker */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-wrap justify-center gap-4 mb-12"
                >
                  {[
                    { label: 'TVL', value: '$3.2M', icon: FiTrendingUp, color: 'cyan' },
                    { label: 'Users', value: '12.4K', icon: FiShield, color: 'green' },
                    { label: 'APY', value: '25%', icon: FiZap, color: 'amber' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, type: 'spring' }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className={`px-6 py-3 rounded-full bg-slate-800/50 border border-${stat.color}-500/30 backdrop-blur-sm flex items-center gap-3 group cursor-pointer`}
                    >
                      <stat.icon className={`text-${stat.color}-400 w-5 h-5 group-hover:scale-125 transition-transform`} />
                      <div className="text-left">
                        <p className="text-xs text-slate-400">{stat.label}</p>
                        <p className={`text-sm font-bold text-${stat.color}-400`}>{stat.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Enhanced Feature Cards with 3D Tilt Effect */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="grid md:grid-cols-3 gap-6 mb-12"
                >
                  {[
                    { 
                      icon: '🥩', 
                      title: 'Stake & Earn', 
                      desc: 'Lock tokens for boosted APY up to 25%', 
                      color: 'from-green-500 to-emerald-500',
                      stats: '12.5% Base APY'
                    },
                    { 
                      icon: '🏦', 
                      title: 'Lend & Borrow', 
                      desc: 'Flexible collateral with 75% LTV ratio', 
                      color: 'from-cyan-500 to-blue-500',
                      stats: '8.5% Interest'
                    },
                    { 
                      icon: '🗳️', 
                      title: 'Govern', 
                      desc: 'Vote on proposals and shape the future', 
                      color: 'from-purple-500 to-pink-500',
                      stats: '1 Token = 1 Vote'
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + i * 0.1, type: 'spring' }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -10,
                        rotateX: 5,
                        rotateY: i === 1 ? 0 : (i === 0 ? -5 : 5),
                      }}
                      className="relative group cursor-pointer"
                      style={{ perspective: '1000px' }}
                    >
                      {/* Animated Border Gradient */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-30 rounded-2xl blur-xl transition-all duration-500`}
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      
                      {/* Card Content */}
                      <div className="relative p-8 rounded-2xl bg-slate-800/70 border border-slate-700 backdrop-blur-sm group-hover:border-cyan-500/50 transition-all overflow-hidden">
                        {/* Corner Accent */}
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-20 blur-2xl rounded-full`} />
                        
                        {/* Icon with Rotation */}
                        <motion.div
                          className="text-6xl mb-4 inline-block"
                          whileHover={{ 
                            rotate: [0, -10, 10, -10, 0],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {feature.icon}
                        </motion.div>
                        
                        <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                        <p className="text-slate-400 mb-4 text-sm">{feature.desc}</p>
                        
                        {/* Stats Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${feature.color} bg-opacity-10 border border-white/10`}>
                          <FiZap className="w-4 h-4" />
                          <span className="text-xs font-bold">{feature.stats}</span>
                        </div>
                        
                        {/* Hover Arrow */}
                        <motion.div
                          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center">
                            →
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Enhanced CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  className="relative inline-block"
                >
                  {/* Multi-layer Glow */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.9, 0.5],
                      rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-2xl"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3],
                      rotate: [360, 180, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur-3xl"
                  />
                  
                  <div className="relative">
                    <ConnectButton />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Enhanced Tab Navigation */}
              <div className="flex justify-center mb-12">
                <div className="inline-flex p-2 rounded-2xl bg-slate-800/50 border border-cyan-500/20 backdrop-blur-sm gap-2 relative">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTabChange(tab.id)}
                      className={`relative px-8 py-4 rounded-xl font-semibold transition-all ${
                        activeTab === tab.id
                          ? 'text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {activeTab === tab.id && (
                        <>
                          <motion.div
                            layoutId="activeTabBg"
                            className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-xl`}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-xl blur-lg opacity-50`}
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </>
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <motion.span 
                          className="text-2xl"
                          animate={activeTab === tab.id ? {
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.2, 1]
                          } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          {tab.icon}
                        </motion.span>
                        {tab.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Tab Content with Smooth Transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                >
                  {activeTab === 'dashboard' && <Dashboard />}
                  {activeTab === 'staking' && <Staking />}
                  {activeTab === 'lending' && <Lending />}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative border-t border-cyan-500/20 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
        {/* Animated Background Lines */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
              style={{ top: `${i * 25}%`, width: '100%' }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
          <div className="text-center">
            <motion.p
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold mb-4 cursor-pointer"
            >
              <motion.span
                className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: '200% 100%' }}
              >
                Endangered in the wild. Thriving in Web3 🦫⚡
              </motion.span>
            </motion.p>
            <p className="text-slate-400 mb-6">
              Sepolia Testnet • 2025 • Built with Passion
            </p>
            <div className="flex justify-center gap-6 text-sm text-slate-500">
              <span>© 2025 Tapir DeFi</span>
              <span>•</span>
              <span>All Rights Reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;