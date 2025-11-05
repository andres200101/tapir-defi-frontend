import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Toaster } from 'react-hot-toast'; // ADD THIS
import { config } from './contracts/config';
import App from './App';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';
import { ThemeProvider } from './contexts/ThemeContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider> 
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#0c6874',
                color: '#74ef93',
                border: '2px solid #24d1dc',
                borderRadius: '12px',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#24d1dc',
                  secondary: '#0c6874',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#0c6874',
                },
              },
            }}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    </ThemeProvider>
  </React.StrictMode>
);