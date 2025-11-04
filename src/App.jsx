import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Dashboard from './components/Dashboard';
import Staking from './components/Staking';
import Lending from './components/Lending';

function App() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      {/* Navigation Bar */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-4xl">🦫</span>
              <h1 className="text-2xl font-bold text-white">Tapir DeFi</h1>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 max-w-md mx-auto border border-white/20">
              <span className="text-8xl mb-6 block">🦫</span>
              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome to Tapir DeFi
              </h2>
              <p className="text-white/80 mb-8">
                Stake, lend, and earn rewards with your TAPIR tokens
              </p>
              <ConnectButton />
            </div>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-purple-700 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('staking')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'staking'
                    ? 'bg-white text-purple-700 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                🥩 Staking
              </button>
              <button
                onClick={() => setActiveTab('lending')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'lending'
                    ? 'bg-white text-purple-700 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                🏦 Lending
              </button>
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
      <footer className="text-center py-8 text-white/60">
        <p>Built with ❤️ on Sepolia Testnet</p>
      </footer>
    </div>
  );
}

export default App;