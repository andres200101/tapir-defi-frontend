import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Dashboard from './components/Dashboard';
import Staking from './components/Staking';
import Lending from './components/Lending';
import { useTheme } from './contexts/ThemeContext';
import MobileMenu from './components/MobileMenu';
import { toggleSound, isSoundEnabled, playClick, setSoundVolume, playWelcome } from './utils/sounds';

function App() {
  const { isConnected } = useAccount();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());
  const [wasConnected, setWasConnected] = useState(false);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundEnabled(newState);
    playClick();
  };

  useEffect(() => {
    // Play welcome sound when user connects
    if (isConnected && !wasConnected) {
      playWelcome();
      setWasConnected(true);
    } else if (!isConnected && wasConnected) {
      setWasConnected(false);
    }
  }, [isConnected, wasConnected]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-tapir-dark via-tapir-darkest to-tapir-success">
      {/* Navigation Bar */}
      <nav className="bg-tapir-dark/30 backdrop-blur-md border-b border-tapir-cyan/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/logo_circ.png"
                alt="Tapir DeFi Logo"
                className="h-16 w-16 logo-glow"
              />
              <h1 className="text-3xl font-bold text-tapir-cyan">Tapir DeFi</h1>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-tapir-cyan/20 hover:bg-tapir-cyan/30 rounded-xl transition-all border border-tapir-cyan/50"
              >
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSoundToggle}
                className="px-4 py-2 bg-tapir-cyan/20 hover:bg-tapir-cyan/30 rounded-xl transition-all border border-tapir-cyan/50"
                title="Toggle Sound Effects"
              >
                {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="30"
                onChange={(e) => setSoundVolume(e.target.value / 100)}
                className="w-24"
                title="Volume"
              />
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="bg-tapir-dark/40 backdrop-blur-md rounded-2xl p-12 max-w-md mx-auto border-2 border-tapir-cyan/50 shadow-2xl">
              <img
                src="/logo_circ.png"
                alt="Welcome Tapir Logo"
                className="h-48 w-48 mx-auto mb-8 logo-glow animate-pulse-glow"
              />
              <h2 className="text-4xl font-bold text-tapir-cyan mb-4">
                Welcome to Tapir DeFi
              </h2>
              <p className="text-tapir-green text-lg mb-8">
                Stake, lend, and earn rewards with your TAPIR tokens
              </p>
              <ConnectButton />
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Tab Navigation - Hidden on mobile */}
            <div className="hidden md:flex space-x-4 mb-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-tapir-cyan text-tapir-darkest shadow-lg shadow-tapir-cyan/50'
                    : 'bg-tapir-dark/30 text-tapir-green border border-tapir-cyan/30 hover:bg-tapir-dark/50'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('staking')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'staking'
                    ? 'bg-tapir-cyan text-tapir-darkest shadow-lg shadow-tapir-cyan/50'
                    : 'bg-tapir-dark/30 text-tapir-green border border-tapir-cyan/30 hover:bg-tapir-dark/50'
                }`}
              >
                🥩 Staking
              </button>
              <button
                onClick={() => setActiveTab('lending')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'lending'
                    ? 'bg-tapir-cyan text-tapir-darkest shadow-lg shadow-tapir-cyan/50'
                    : 'bg-tapir-dark/30 text-tapir-green border border-tapir-cyan/30 hover:bg-tapir-dark/50'
                }`}
              >
                🏦 Lending
              </button>
            </div>

            {/* Mobile Menu - Only on mobile */}
            <div className="md:hidden mb-6">
              <MobileMenu activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Tab Content */}
            <div className="transition-all duration-300">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'staking' && <Staking />}
              {activeTab === 'lending' && <Lending />}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-tapir-green/60 border-t border-tapir-cyan/20">
  <p className="text-lg font-semibold text-tapir-cyan mb-2">
    Endangered in the wild. Thriving in Web3 🦫⚡
  </p>
  <p className="text-sm opacity-70">
    Sepolia Testnet • 2025
  </p>
</footer>
    </div>
  );
}

export default App;