// components/WalletButton.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  isConnected,
  requestAccess,
  getAddress,
  getNetwork,
} from '@stellar/freighter-api';

type WalletButtonProps = {
  onConnect: (publicKey: string, network: string) => void;
  onDisconnect: () => void;
};

export default function WalletButton({ onConnect, onDisconnect }: WalletButtonProps) {
  const [loading, setLoading] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  // Restore connection on load
  useEffect(() => {
    const restoreSession = async () => {
      const addressObj = await getAddress();
      if (addressObj.address) {
        const networkObj = await getNetwork();
        setPublicKey(addressObj.address);
        setNetwork(networkObj.network || 'Unknown');
        onConnect(addressObj.address, networkObj.network || 'Unknown');
      }
    };
    restoreSession();
  }, [onConnect]);

  const connect = async () => {
    setLoading(true);
    try {
      const isAppConnected = await isConnected();
      if (!isAppConnected.isConnected) {
        alert('Freighter not detected. Please install: https://www.freighter.app');
        setLoading(false);
        return;
      }

      const accessObj = await requestAccess();
      if (accessObj.error) throw new Error(accessObj.error);

      const networkObj = await getNetwork();

      setPublicKey(accessObj.address);
      setNetwork(networkObj.network || 'Unknown');
      onConnect(accessObj.address, networkObj.network || 'Unknown');
    } catch (err: unknown) {
      console.error('Connection failed:', err);
      alert(
        typeof err === 'string'
          ? err
          : err instanceof Error
          ? err.message
          : 'Failed to connect to Freighter'
      );
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
    setNetwork(null);
    onDisconnect();
  };

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-6)}`;

  // If connected, show address + network + disconnect
  if (publicKey && network) {
    return (
      <div className="flex items-center space-x-3 bg-blue-400 bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-lg shadow border">
        {/* Network Indicator */}
        <div
          className={`w-2 h-2 rounded-full ${
            network === 'PUBLIC' ? 'bg-green-500' : 'bg-yellow-500'
          }`}
          title={`Network: ${network}`}
        ></div>

        {/* Wallet Info */}
        <div className="text-sm font-mono text-gray-800 font-bold ">
          <div>{truncate(publicKey)}</div>
          <div className="text-gray-700">{network === 'PUBLIC' ? 'Mainnet' : network}</div>
        </div>

        {/* Disconnect Button */}
        <button
          onClick={disconnect}
          className="ml-1 my-3 text-gray-400 hover:text-red-500 transition font-bold"
          aria-label="Disconnect wallet"
        >
          ✕
        </button>
      </div>
    );
  }

  // Connect button
  return (
    <button
      onClick={connect}
      disabled={loading}
      className="px-4 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-80 text-white text-sm font-medium rounded-lg transition"
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}