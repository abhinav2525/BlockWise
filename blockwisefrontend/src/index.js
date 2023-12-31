import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App2';
import { configureChains, createClient, WagmiConfig, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { polygonMumbai } from 'wagmi/chains';

const { provider, webSocketProvider } = configureChains([polygonMumbai, mainnet], [publicProvider()])

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <WagmiConfig client={client}>
    <App />
  </WagmiConfig>
);

