import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { CONTRACTS } from '../contracts/addresses';
import TapirTokenABI from '../contracts/abis/TapirToken.json';
import RewardTokenABI from '../contracts/abis/TapirRewardToken.json';
import GovernanceTokenABI from '../contracts/abis/TapirGovernanceToken.json';
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
      const provider = new ethers.BrowserProvider(window.ethereum);
      
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
        <img 
          src="/logo_circ.png" 
          alt="Loading Tapir Logo" 
          className="h-64 w-64 mx-auto animate-spin-slow logo-glow mb-8" 
        />
        <p className="text-tapir-cyan text-2xl font-semibold">Loading your dashboard...</p>
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
        <div className="bg-tapir-dark/40 backdrop-blur-md rounded-2xl p-6 border-2 border-tapir-cyan/50 shadow-lg shadow-tapir-cyan/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-tapir-green font-semibold text-lg">Total Value</h3>
            <span className="text-3xl">💰</span>
          </div>
          <p className="text-5xl font-bold text-tapir-cyan">{formatNumber(totalValue)}</p>
          <p className="text-tapir-green/60 text-sm mt-2">TAPIR Tokens</p>
        </div>

        <div className="bg-tapir-dark/40 backdrop-blur-md rounded-2xl p-6 border-2 border-tapir-green/50 shadow-lg shadow-tapir-green/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-tapir-green font-semibold text-lg">Pending Rewards</h3>
            <span className="text-3xl">🎁</span>
          </div>
          <p className="text-5xl font-bold text-tapir-green">{formatNumber(balances.pendingRewards)}</p>
          <p className="text-tapir-green/60 text-sm mt-2">TRWD Tokens</p>
        </div>

        <div className="bg-tapir-dark/40 backdrop-blur-md rounded-2xl p-6 border-2 border-tapir-success/50 shadow-lg shadow-tapir-success/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-tapir-green font-semibold text-lg">Health Factor</h3>
            <span className="text-3xl">❤️</span>
          </div>
          <p className="text-5xl font-bold text-tapir-success">
            {parseFloat(balances.borrowed) > 0 
              ? ((parseFloat(balances.collateral) * 0.5) / parseFloat(balances.borrowed) * 100).toFixed(0) + '%'
              : '∞'}
          </p>
          <p className="text-tapir-green/60 text-sm mt-2">LTV Ratio</p>
        </div>
      </div>

      {/* Token Balances */}
      <div className="bg-tapir-dark/40 backdrop-blur-md rounded-2xl p-6 border-2 border-tapir-cyan/50 shadow-lg">
        <h2 className="text-3xl font-bold text-tapir-cyan mb-6 flex items-center">
          <span className="mr-3">💼</span> Token Balances
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-tapir-darkest/30 rounded-xl border border-tapir-cyan/30 hover:border-tapir-cyan/60 transition-all">
            <div className="flex items-center">
              <img src="/logo_circ.png" alt="TAPIR" className="h-12 w-12 mr-4" />
              <div>
                <p className="text-tapir-cyan font-semibold text-lg">TAPIR Token</p>
                <p className="text-tapir-green/60 text-sm">In Wallet</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-tapir-cyan">{formatNumber(balances.tapir)}</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-tapir-darkest/30 rounded-xl border border-tapir-green/30 hover:border-tapir-green/60 transition-all">
            <div className="flex items-center">
              <span className="text-4xl mr-4">🎁</span>
              <div>
                <p className="text-tapir-green font-semibold text-lg">TRWD Token</p>
                <p className="text-tapir-green/60 text-sm">Reward Balance</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-tapir-green">{formatNumber(balances.reward)}</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-tapir-darkest/30 rounded-xl border border-tapir-accent/30 hover:border-tapir-accent/60 transition-all">
            <div className="flex items-center">
              <span className="text-4xl mr-4">🏛️</span>
              <div>
                <p className="text-tapir-accent font-semibold text-lg">GOV Token</p>
                <p className="text-tapir-green/60 text-sm">Governance Power</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-tapir-accent">{formatNumber(balances.gov)}</p>
          </div>
        </div>
      </div>

      {/* Staking & Lending Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-tapir-dark/40 backdrop-blur-md rounded-2xl p-6 border-2 border-tapir-green/50 shadow-lg">
          <h3 className="text-2xl font-bold text-tapir-green mb-4 flex items-center">
            <span className="mr-3">🥩</span> Staking Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-tapir-green/80">Staked:</span>
              <span className="text-tapir-cyan font-semibold">{formatNumber(balances.staked)} TAPIR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tapir-green/80">Pending Rewards:</span>
              <span className="text-tapir-green font-semibold">{formatNumber(balances.pendingRewards)} TRWD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tapir-green/80">APY:</span>
              <span className="text-tapir-cyan font-semibold">~3650%</span>
            </div>
          </div>
        </div>

        <div className="bg-tapir-dark/40 backdrop-blur-md rounded-2xl p-6 border-2 border-tapir-accent/50 shadow-lg">
          <h3 className="text-2xl font-bold text-tapir-accent mb-4 flex items-center">
            <span className="mr-3">🏦</span> Lending Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-tapir-green/80">Collateral:</span>
              <span className="text-tapir-cyan font-semibold">{formatNumber(balances.collateral)} TAPIR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tapir-green/80">Borrowed:</span>
              <span className="text-red-400 font-semibold">{formatNumber(balances.borrowed)} TAPIR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tapir-green/80">Available to Borrow:</span>
              <span className="text-tapir-cyan font-semibold">
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
          className="px-8 py-3 bg-tapir-cyan text-tapir-darkest rounded-xl font-bold hover:bg-tapir-green transition-all shadow-lg shadow-tapir-cyan/50 hover:shadow-tapir-green/50"
        >
          🔄 Refresh Balances
        </button>
      </div>
    </div>
  );
}

export default Dashboard;