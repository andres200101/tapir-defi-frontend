import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { CONTRACTS } from '../contracts/addresses';
import TapirTokenABI from '../contracts/abis/TapirToken.json';
import LendingPoolABI from '../contracts/abis/LendingPool.json';

function Lending() {
  const { address } = useAccount();
  const [balances, setBalances] = useState({
    wallet: '0',
    collateral: '0',
    borrowed: '0',
    interest: '0',
  });
  const [depositAmount, setDepositAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
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
      const lendingPool = new ethers.Contract(
        CONTRACTS.sepolia.lendingPool,
        LendingPoolABI,
        provider
      );

      const [walletBal, accountInfo] = await Promise.all([
        tapirToken.balanceOf(address),
        lendingPool.getAccountInfo(address),
      ]);

      setBalances({
        wallet: ethers.formatEther(walletBal),
        collateral: ethers.formatEther(accountInfo.collateral),
        borrowed: ethers.formatEther(accountInfo.borrowed),
        interest: ethers.formatEther(accountInfo.interest),
      });
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
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
      const lendingPool = new ethers.Contract(
        CONTRACTS.sepolia.lendingPool,
        LendingPoolABI,
        signer
      );

      const amount = ethers.parseEther(depositAmount);

      setTxStatus('Approving tokens...');
      const approveTx = await tapirToken.approve(CONTRACTS.sepolia.lendingPool, amount);
      await approveTx.wait();

      setTxStatus('Depositing collateral...');
      const depositTx = await lendingPool.depositCollateral(amount);
      await depositTx.wait();

      setTxStatus('✅ Successfully deposited!');
      setDepositAmount('');
      await fetchBalances();
      
      setTimeout(() => setTxStatus(''), 3000);
    } catch (error) {
      console.error('Error depositing:', error);
      setTxStatus('❌ Transaction failed');
      setTimeout(() => setTxStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setTxStatus('Borrowing tokens...');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const lendingPool = new ethers.Contract(
        CONTRACTS.sepolia.lendingPool,
        LendingPoolABI,
        signer
      );

      const amount = ethers.parseEther(borrowAmount);
      const borrowTx = await lendingPool.borrow(amount);
      await borrowTx.wait();

      setTxStatus('✅ Successfully borrowed!');
      setBorrowAmount('');
      await fetchBalances();
      
      setTimeout(() => setTxStatus(''), 3000);
    } catch (error) {
      console.error('Error borrowing:', error);
      setTxStatus('❌ Transaction failed: ' + (error.reason || error.message));
      setTimeout(() => setTxStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleRepay = async () => {
    if (!repayAmount || parseFloat(repayAmount) <= 0) {
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
      const lendingPool = new ethers.Contract(
        CONTRACTS.sepolia.lendingPool,
        LendingPoolABI,
        signer
      );

      const amount = ethers.parseEther(repayAmount);

      setTxStatus('Approving tokens...');
      const approveTx = await tapirToken.approve(CONTRACTS.sepolia.lendingPool, amount);
      await approveTx.wait();

      setTxStatus('Repaying loan...');
      const repayTx = await lendingPool.repay(amount);
      await repayTx.wait();

      setTxStatus('✅ Successfully repaid!');
      setRepayAmount('');
      await fetchBalances();
      
      setTimeout(() => setTxStatus(''), 3000);
    } catch (error) {
      console.error('Error repaying:', error);
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
      setTxStatus('Withdrawing collateral...');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const lendingPool = new ethers.Contract(
        CONTRACTS.sepolia.lendingPool,
        LendingPoolABI,
        signer
      );

      const amount = ethers.parseEther(withdrawAmount);
      const withdrawTx = await lendingPool.withdrawCollateral(amount);
      await withdrawTx.wait();

      setTxStatus('✅ Successfully withdrawn!');
      setWithdrawAmount('');
      await fetchBalances();
      
      setTimeout(() => setTxStatus(''), 3000);
    } catch (error) {
      console.error('Error withdrawing:', error);
      setTxStatus('❌ Transaction failed: You may need to repay your loan first');
      setTimeout(() => setTxStatus(''), 5000);
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

  const maxBorrowable = parseFloat(balances.collateral) * 0.5 - parseFloat(balances.borrowed);
  const healthFactor = parseFloat(balances.borrowed) > 0 
    ? ((parseFloat(balances.collateral) * 0.5) / parseFloat(balances.borrowed) * 100).toFixed(0)
    : 'Safe';

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <p className="text-white/80 text-sm mb-2">Wallet Balance</p>
          <p className="text-3xl font-bold text-white">{formatNumber(balances.wallet)}</p>
          <p className="text-white/60 text-sm mt-1">TAPIR</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <p className="text-white/80 text-sm mb-2">Collateral</p>
          <p className="text-3xl font-bold text-blue-400">{formatNumber(balances.collateral)}</p>
          <p className="text-white/60 text-sm mt-1">TAPIR</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <p className="text-white/80 text-sm mb-2">Borrowed</p>
          <p className="text-3xl font-bold text-red-400">{formatNumber(balances.borrowed)}</p>
          <p className="text-white/60 text-sm mt-1">TAPIR</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <p className="text-white/80 text-sm mb-2">Health Factor</p>
          <p className="text-3xl font-bold text-green-400">{healthFactor}</p>
          <p className="text-white/60 text-sm mt-1">LTV Ratio</p>
        </div>
      </div>

      {/* Status Message */}
      {txStatus && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
          <p className="text-white font-semibold">{txStatus}</p>
        </div>
      )}

      {/* Action Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deposit Collateral */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <span className="mr-3">💰</span> Deposit Collateral
          </h3>
          <p className="text-white/80 mb-4">
            Deposit TAPIR tokens as collateral to borrow against them.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="text-white/80 text-sm block mb-2">Amount to Deposit</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
              <button
                onClick={() => setDepositAmount(balances.wallet)}
                className="text-sm text-blue-400 hover:text-blue-300 mt-2"
              >
                Max: {formatNumber(balances.wallet)} TAPIR
              </button>
            </div>

            <button
              onClick={handleDeposit}
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-semibold rounded-xl transition-all"
            >
              {loading ? '⏳ Processing...' : '💰 Deposit Collateral'}
            </button>
          </div>
        </div>

        {/* Borrow */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <span className="mr-3">🏦</span> Borrow TAPIR
          </h3>
          <p className="text-white/80 mb-4">
            Borrow up to 50% of your collateral value. Max: {formatNumber(maxBorrowable)} TAPIR
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="text-white/80 text-sm block mb-2">Amount to Borrow</label>
              <input
                type="number"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
              <button
                onClick={() => setBorrowAmount(maxBorrowable.toFixed(2))}
                className="text-sm text-blue-400 hover:text-blue-300 mt-2"
              >
                Max: {formatNumber(maxBorrowable)} TAPIR
              </button>
            </div>

            <button
              onClick={handleBorrow}
              disabled={loading || maxBorrowable <= 0}
              className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-semibold rounded-xl transition-all"
            >
              {loading ? '⏳ Processing...' : '🏦 Borrow Tokens'}
            </button>
          </div>
        </div>
      </div>

      {/* Action Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Repay */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <span className="mr-3">💸</span> Repay Loan
          </h3>
          <p className="text-white/80 mb-4">
            Repay your borrowed amount plus interest. Total owed: {formatNumber(parseFloat(balances.borrowed) + parseFloat(balances.interest))} TAPIR
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="text-white/80 text-sm block mb-2">Amount to Repay</label>
              <input
                type="number"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
              <button
                onClick={() => setRepayAmount((parseFloat(balances.borrowed) + parseFloat(balances.interest)).toFixed(4))}
                className="text-sm text-blue-400 hover:text-blue-300 mt-2"
              >
                Max: {formatNumber(parseFloat(balances.borrowed) + parseFloat(balances.interest))} TAPIR
              </button>
            </div>

            <button
              onClick={handleRepay}
              disabled={loading || parseFloat(balances.borrowed) === 0}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-black font-semibold rounded-xl transition-all"
            >
              {loading ? '⏳ Processing...' : '💸 Repay Loan'}
            </button>
          </div>
        </div>

        {/* Withdraw Collateral */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <span className="mr-3">🔓</span> Withdraw Collateral
          </h3>
          <p className="text-white/80 mb-4">
            Withdraw your collateral. Must maintain 50% LTV ratio.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="text-white/80 text-sm block mb-2">Amount to Withdraw</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
              <button
                onClick={() => setWithdrawAmount(balances.collateral)}
                className="text-sm text-blue-400 hover:text-blue-300 mt-2"
              >
                Max: {formatNumber(balances.collateral)} TAPIR
              </button>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={loading}
              className="w-full py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white font-semibold rounded-xl transition-all"
            >
              {loading ? '⏳ Processing...' : '🔓 Withdraw Collateral'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
        <h4 className="text-white font-semibold mb-2 flex items-center">
          <span className="mr-2">ℹ️</span> How Lending Works
        </h4>
        <ul className="text-white/80 space-y-2 text-sm">
          <li>• Deposit TAPIR tokens as collateral</li>
          <li>• Borrow up to 50% of your collateral value (LTV ratio)</li>
          <li>• Interest accrues at 10% APR on borrowed amount</li>
          <li>• Repay your loan anytime to unlock your collateral</li>
          <li>• Maintain healthy LTV ratio to avoid liquidation</li>
        </ul>
      </div>
    </div>
  );
}

export default Lending;