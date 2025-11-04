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
            </div>
            <ConnectButton />
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
            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-tapir-cyan text-tapir-darkest shadow-lg shadow-tapir-cyan/50'
                    : 'bg-tapir-dark/30 text-tapir-green border border-tapir-cyan/30 hover:bg-tapir-dark/50 hover:border-tapir-cyan/60'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('staking')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'staking'
                    ? 'bg-tapir-cyan text-tapir-darkest shadow-lg shadow-tapir-cyan/50'
                    : 'bg-tapir-dark/30 text-tapir-green border border-tapir-cyan/30 hover:bg-tapir-dark/50 hover:border-tapir-cyan/60'
                }`}
              >
                🥩 Staking
              </button>
              <button
                onClick={() => setActiveTab('lending')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'lending'
                    ? 'bg-tapir-cyan text-tapir-darkest shadow-lg shadow-tapir-cyan/50'
                    : 'bg-tapir-dark/30 text-tapir-green border border-tapir-cyan/30 hover:bg-tapir-dark/50 hover:border-tapir-cyan/60'
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
      <footer className="text-center py-8 text-tapir-green/60">
        <p>Built with ❤️ on Sepolia Testnet</p>
      </footer>
    </div>
  );
}

export default App;