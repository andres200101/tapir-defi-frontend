import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { CONTRACTS } from '../contracts/addresses';
import TapirTokenABI from '../contracts/abis/TapirToken.json';
import StakingABI from '../contracts/abis/Staking.json';

function Staking() {
  const { address } = useAccount();
  const [balances, setBalances] = useState({
    wallet: '0',
    staked: '0',
    pending: '0',
  });
  const [stakeAmount, setStakeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState('');

  useEffect(() => {
    if (address) {
      fetchBalances();
    }
  }, [address]);

  const fetchBalances = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const tapirToken = new ethers.Contract(
        CONTRACTS.sepolia.tapirToken,
        TapirTokenABI,
        provider
      );
      const staking = new ethers.Contract(
        CONTRACTS.sepolia.staking,
        StakingABI,
        provider
      );

      const [walletBal, stakedBal, pendingRewards] = await Promise.all([
        tapirToken.balanceOf(address),
        staking.stakedBalances(address),
        staking.getPendingReward(address),
      ]);

      setBalances({
        wallet: ethers.formatEther(walletBal),
        staked: ethers.formatEther(stakedBal),
        pending: ethers.formatEther(pendingRewards),
      });
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setTxStatus('Requesting approval...');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tapirToken = new ethers.Contract(
        CONTRACTS.sepolia.tapirToken,
        TapirTokenABI,
        signer
      );
      const staking = new ethers.Contract(
        CONTRACTS.sepolia.staking,
        StakingABI,
        signer
      );

      const amount = ethers.parseEther(stakeAmount);

      setTxStatus('Approving tokens...');
      const approveTx = await tapirToken.approve(CONTRACTS.sepolia.staking, amount);
      await approveTx.wait();

      setTxStatus('Staking tokens...');
      const stakeTx = await staking.stake(amount);
      await stakeTx.wait();

      setTxStatus('✅ Successfully staked!');
      setStakeAmount('');
      await fetchBalances();
      
      setTimeout(() => setTxStatus(''), 3000);
    } catch (error) {
      console.error('Error staking:', error);
      setTxStatus('❌ Transaction failed');
      setTimeout(() => setTxStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setTxStatus('Withdrawing tokens...');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const staking = new ethers.Contract(
        CONTRACTS.sepolia.staking,
        StakingABI,
        signer
      );

      const amount = ethers.parseEther(withdrawAmount);
      const withdrawTx = await staking.withdraw(amount);
      await withdrawTx.wait();

      setTxStatus('✅ Successfully withdrawn!');
      setWithdrawAmount('');
      await fetchBalances();
      
      setTimeout(() => setTxStatus(''), 3000);
    } catch (error) {
      console.error('Error withdrawing:', error);
      setTxStatus('❌ Transaction failed');
      setTimeout(() => setTxStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    try {
      setLoading(true);
      setTxStatus('Claiming rewards...');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const staking = new ethers.Contract(
        CONTRACTS.sepolia.staking,
        StakingABI,
        signer
      );

      const claimTx = await staking.claimReward();
      await claimTx.wait();

      setTxStatus('✅ Rewards claimed!');
      await fetchBalances();
      
      setTimeout(() => setTxStatus(''), 3000);
    } catch (error) {
      console.error('Error claiming rewards:', error);
      setTxStatus('❌ Transaction failed');
      setTimeout(() => setTxStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('en-US', {
      maximumFractionDigits: 4,
      minimumFractionDigits: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-tapir-dark/40 backdrop-blur-md rounded-2xl p-6 border-2 border-tapir-cyan/50 shadow-lg">
          <p className="text-tapir-green text-sm mb-2">Wallet Balance</p>
          <p className="text-4xl font-bold text-tapir-cyan">{formatNumber(balances.wallet)}</p>
          <p className="text-tapir-green/60 text-sm mt-1">TAPIR</p>
        </div>

        <div className="bg-tapir-dark/40 backdrop-blur-md rounded-2xl p-6 border-2 border-tapir-green/50 shadow-lg">
          <p className="text-tapir-green text-sm mb-2">Staked Balance</p>
          <p className="text-4xl font-bold text-tapir-green">{formatNumber(balances.staked)}</p>
          <p className="text-tapir-green/60 text-sm mt-1">TAPIR</p>
        </div>

        <div className="bg-tapir-dark/40 backdrop-blur-md rounded-2xl p-6 border-2 border-tapir-success/50 shadow-lg">
          <p className="text-tapir-green text-sm mb-2">Pending Rewards</p>
          <p className="text-4xl font-bold text-tapir-success">{formatNumber(balances.pending)}</p>
          <p className="text-tapir-green/60 text-sm mt-1">TRWD</p>
        </div>
      </div>

      {/* Status Message */}
      {txStatus && (
        <div className="bg-tapir-dark/40 backdrop-blur-md rounded-xl p-4 border-2 border-tapir-cyan/50 text-center shadow-lg">
          <p className="text-tapir-cyan font-semibold text-lg">{txStatus}</p>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stake Card */}
        <div className="bg-tapir-dark/40 backdrop-blur-md rounded-2xl p-6 border-2 border-tapir-green/50 shadow-lg">
          <h3 className="text-2xl font-bold text-tapir-green mb-4 flex items-center">
            <span className="mr-3">🥩</span> Stake TAPIR
          </h3>
          <p className="text-tapir-green/80 mb-4">
            Stake your TAPIR tokens to earn TRWD rewards. Current APY: ~3650%
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="text-tapir-green text-sm block mb-2">Amount to Stake</label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 bg-tapir-darkest/30 border-2 border-tapir-cyan/30 rounded-xl text-tapir-cyan placeholder-tapir-green/40 focus:outline-none focus:border-tapir-cyan/60"
              />
              <button
                onClick={() => setStakeAmount(balances.wallet)}
                className="text-sm text-tapir-cyan hover:text-tapir-green mt-2 transition-colors"
              >
                Max: {formatNumber(balances.wallet)} TAPIR
              </button>
            </div>

            <button
              onClick={handleStake}
              disabled={loading}
              className="w-full py-3 bg-tapir-success hover:bg-tapir-accent disabled:bg-gray-500 text-white font-semibold rounded-xl transition-all shadow-lg"
            >
              {loading ? '⏳ Processing...' : '🥩 Stake Tokens'}
            </button>
          </div>
        </div>

        {/* Withdraw Card */}
        <div className="bg-tapir-dark/40 backdrop-blur-md rounded-2xl p-6 border-2 border-tapir-accent/50 shadow-lg">
          <h3 className="text-2xl font-bold text-tapir-accent mb-4 flex items-center">
            <span className="mr-3">💸</span> Withdraw TAPIR
          </h3>
          <p className="text-tapir-green/80 mb-4">
            Withdraw your staked TAPIR tokens back to your wallet.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="text-tapir-green text-sm block mb-2">Amount to Withdraw</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 bg-tapir-darkest/30 border-2 border-tapir-cyan/30 rounded-xl text-tapir-cyan placeholder-tapir-green/40 focus:outline-none focus:border-tapir-cyan/60"
              />
              <button
                onClick={() => setWithdrawAmount(balances.staked)}
                className="text-sm text-tapir-cyan hover:text-tapir-green mt-2 transition-colors"
              >
                Max: {formatNumber(balances.staked)} TAPIR
              </button>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white font-semibold rounded-xl transition-all shadow-lg"
            >
              {loading ? '⏳ Processing...' : '💸 Withdraw Tokens'}
            </button>
          </div>
        </div>
      </div>

      {/* Claim Rewards Card */}
      <div className="bg-gradient-to-r from-tapir-success/30 to-tapir-accent/30 backdrop-blur-md rounded-2xl p-8 border-2 border-tapir-green/60 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-3xl font-bold text-tapir-green mb-2 flex items-center">
              <span className="mr-3">🎁</span> Claim Your Rewards
            </h3>
            <p className="text-tapir-green/90 text-lg">
              You have <span className="font-bold text-tapir-cyan">{formatNumber(balances.pending)} TRWD</span> ready to claim!
            </p>
          </div>
          <button
            onClick={handleClaimRewards}
            disabled={loading || parseFloat(balances.pending) === 0}
            className="px-8 py-4 bg-tapir-cyan hover:bg-tapir-green disabled:bg-gray-500 text-tapir-darkest font-bold rounded-xl transition-all shadow-lg shadow-tapir-cyan/50 hover:shadow-tapir-green/50 text-lg"
          >
            {loading ? '⏳ Claiming...' : '🎁 Claim Rewards'}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-tapir-dark/30 backdrop-blur-md rounded-2xl p-6 border-2 border-tapir-cyan/30 shadow-lg">
        <h4 className="text-tapir-cyan font-semibold text-xl mb-3 flex items-center">
          <span className="mr-2">ℹ️</span> How Staking Works
        </h4>
        <ul className="text-tapir-green/80 space-y-2">
          <li>• Stake TAPIR tokens to earn TRWD rewards</li>
          <li>• Rewards accumulate every second (approximately 100 TRWD per day per 1000 TAPIR staked)</li>
          <li>• You can withdraw your staked tokens at any time</li>
          <li>• Claim your rewards whenever you want - they don't expire!</li>
        </ul>
      </div>
    </div>
  );
}

export default Staking;