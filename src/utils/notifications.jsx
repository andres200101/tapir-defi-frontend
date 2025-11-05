import toast from 'react-hot-toast';
import { playSuccess, playError, playCoin } from './sounds';

export const notifySuccess = (message, txHash) => {
  playSuccess();
  const content = (
    <div>
      <p className="font-bold mb-2">{message}</p>
      {txHash && (
        <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-tapir-cyan hover:text-tapir-green underline text-sm">
          View on Etherscan →
        </a>
      )}
    </div>
  );
  
  toast.success(content, { duration: 6000 });
};

export const notifyError = (message) => {
  playError();
  toast.error(message);
};

export const notifyLoading = (message) => {
  return toast.loading(message);
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};