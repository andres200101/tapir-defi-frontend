import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { CONTRACTS } from '../contracts/addresses';
import TapirTokenABI from '../contracts/abis/TapirToken.json';
import RewardTokenABI from '../contracts/abis/TapirRewardToken.json'; // <--- CORRECTION
import GovernanceTokenABI from '../contracts/abis/TapirGovernanceToken.json'; // <--- CORRECTION
import StakingABI from '../contracts/abis/Staking.json';
import LendingPoolABI from '../contracts/abis/LendingPool.json';

function Dashboard() {
  const { address } = useAccount();
  const [balances, setBalances] = useState({
    tapir: '0',
    reward: '0',
    gov: '0',
    staked: '0',
    pendingRewards: '0',
    collateral: '0',
    borrowed: '0',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (address) {
      fetchBalances();
    }
  }, [address]);

  const fetchBalances = async () => {
    try {
      setLoading(true);
      // NOTE: Using BrowserProvider for window.ethereum is typically done with ethers v6/wagmi projects for simple read operations.
      // For full compatibility and signing, you would typically use wagmi/viem hooks, but we'll stick to this for now.
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Initialize contracts
      const tapirToken = new ethers.Contract(
        CONTRACTS.sepolia.tapirToken,
        TapirTokenABI,
        provider
      );
      const rewardToken = new ethers.Contract(
        CONTRACTS.sepolia.rewardToken,
        RewardTokenABI,
        provider
      );
      const govToken = new ethers.Contract(
        CONTRACTS.sepolia.govToken,
        GovernanceTokenABI,
        provider
      );
      const staking = new ethers.Contract(
        CONTRACTS.sepolia.staking,
        StakingABI,
        provider
      );
      const lendingPool = new ethers.Contract(
        CONTRACTS.sepolia.lendingPool,
        LendingPoolABI,
        provider
      );

      // Fetch all balances
      const [
        tapirBal,
        rewardBal,
        govBal,
        stakedBal,
        pending,
        accountInfo
      ] = await Promise.all([
        tapirToken.balanceOf(address),
        rewardToken.balanceOf(address),
        govToken.balanceOf(address),
        staking.stakedBalances(address),
        staking.getPendingReward(address),
        lendingPool.getAccountInfo(address)
      ]);

      setBalances({
        tapir: ethers.formatEther(tapirBal),
        reward: ethers.formatEther(rewardBal),
        gov: ethers.formatEther(govBal),
        staked: ethers.formatEther(stakedBal),
        pendingRewards: ethers.formatEther(pending),
        collateral: ethers.formatEther(accountInfo.collateral),
        borrowed: ethers.formatEther(accountInfo.borrowed),
      });
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        {/*         --- LOGO UPDATE: Loading Spinner Icon --- */}
        <div className="animate-spin text-6xl mb-4">
          <img src="/logo_circ.png" alt="Loading Tapir Logo" className="h-16 w-16 mx-auto" />
        </div>
        <p className="text-white text-xl">Loading your dashboard...</p>
      </div>
    );
  }

  const totalValue = parseFloat(balances.tapir) + 
                     parseFloat(balances.staked) + 
                     parseFloat(balances.collateral);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/80 font-semibold">Total Value</h3>
            <span className="text-3xl">💰</span>
          </div>
          <p className="text-4xl font-bold text-white">{formatNumber(totalValue)}</p>
          <p className="text-white/60 text-sm mt-2">TAPIR Tokens</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/80 font-semibold">Pending Rewards</h3>
            <span className="text-3xl">🎁</span>
          </div>
          <p className="text-4xl font-bold text-green-400">{formatNumber(balances.pendingRewards)}</p>
          <p className="text-white/60 text-sm mt-2">TRWD Tokens</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/80 font-semibold">Health Factor</h3>
            <span className="text-3xl">❤️</span>
          </div>
          <p className="text-4xl font-bold text-white">
            {parseFloat(balances.borrowed) > 0 
              ? ((parseFloat(balances.collateral) * 0.5) / parseFloat(balances.borrowed) * 100).toFixed(0) + '%'
              : '∞'}
          </p>
          <p className="text-white/60 text-sm mt-2">LTV Ratio</p>
        </div>
      </div>

      {/* Token Balances */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-3">💼</span> Token Balances
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center">
              <span className="text-3xl mr-4">🦫</span>
              <div>
                <p className="text-white font-semibold">TAPIR Token</p>
                <p className="text-white/60 text-sm">In Wallet</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{formatNumber(balances.tapir)}</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center">
              <span className="text-3xl mr-4">🎁</span>
              <div>
                <p className="text-white font-semibold">TRWD Token</p>
                <p className="text-white/60 text-sm">Reward Balance</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-400">{formatNumber(balances.reward)}</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center">
              <span className="text-3xl mr-4">🏛️</span>
              <div>
                <p className="text-white font-semibold">GOV Token</p>
                <p className="text-white/60 text-sm">Governance Power</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-400">{formatNumber(balances.gov)}</p>
          </div>
        </div>
      </div>

      {/* Staking & Lending Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-3">🥩</span> Staking Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/80">Staked:</span>
              <span className="text-white font-semibold">{formatNumber(balances.staked)} TAPIR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Pending Rewards:</span>
              <span className="text-green-400 font-semibold">{formatNumber(balances.pendingRewards)} TRWD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">APY:</span>
              <span className="text-white font-semibold">~3650%</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-3">🏦</span> Lending Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/80">Collateral:</span>
              <span className="text-white font-semibold">{formatNumber(balances.collateral)} TAPIR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Borrowed:</span>
              <span className="text-red-400 font-semibold">{formatNumber(balances.borrowed)} TAPIR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Available to Borrow:</span>
              <span className="text-white font-semibold">
                {formatNumber(parseFloat(balances.collateral) * 0.5 - parseFloat(balances.borrowed))} TAPIR
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchBalances}
          className="px-8 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg"
        >
          🔄 Refresh Balances
        </button>
      </div>
    </div>
  );
}

export default Dashboard;