import { http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

export const config = getDefaultConfig({
  appName: 'Tapir DeFi',
  projectId: '7405cf1fbb9c20cdd8597a2e80172d67', 
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});