'use client';

import { useState, useEffect } from 'react';
import {
  isConnected,
  requestAccess,
  getAddress,
} from '@stellar/freighter-api';

type WalletButtonProps = {
  onConnect: (publicKey: string) => void;
  onDisconnect: () => void;
};

export default function WalletButton({ onConnect, onDisconnect }: WalletButtonProps) {
  const [loading, setLoading] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const addressObj = await getAddress(); // Lightweight check
        if (addressObj.address) {
          setPublicKey(addressObj.address);
          onConnect(addressObj.address);
        }
      } catch (err) {
        console.log('Not connected yet');
      }
    };
    checkConnection();
  }, [onConnect]);

  const connect = async () => {
    setLoading(true);
    try {
      // Step 1: Check if Freighter is installed
      const isAppConnected = await isConnected();
      if (!isAppConnected.isConnected) {
        alert('Freighter not detected. Please install: https://www.freighter.app');
        setLoading(false);
        return;
      }

      // Step 2: Request access (will prompt user if not allowed)
      const accessObj = await requestAccess();
      if (accessObj.error) {
        throw new Error(accessObj.error);
      }

      const publicKey = accessObj.address;
      setPublicKey(publicKey);
      onConnect(publicKey);
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
    onDisconnect();
  };

  const truncate = (addr: string) => `${addr.slice(0, 3)}...${addr.slice(-3)}`;

  // If connected, show address
  if (publicKey) {
    return (
      <div className="flex items-center space-x-2 bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-mono text-gray-800">{truncate(publicKey)}</span>
        <button
          onClick={disconnect}
          className="ml-2 text-xs text-red-500 font-bold hover:text-red-700"
          aria-label="Disconnect wallet"
        >
          ✕
        </button>
      </div>
    );
  }

  // Always show "Connect Wallet"
  return (
    <button
      onClick={connect}
      disabled={loading}
      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-80 text-white text-sm font-medium rounded-lg transition"
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}