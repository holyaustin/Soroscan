// components/WalletButton.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  isConnected,
  requestAccess,
} from '@stellar/freighter-api';

export default function WalletButton() {
  const [loading, setLoading] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  // Restore connection if already granted
  useEffect(() => {
    const checkSession = async () => {
      try {
        const access = await requestAccess(); // Lightweight check
        if (access.address) setPublicKey(access.address);
      } catch {
        // Not connected
      }
    };
    checkSession();
  }, []);

  const connect = async () => {
    setLoading(true);
    try {
      // 1. Check if Freighter is installed
      const isAppConnected = await isConnected();
      if (!isAppConnected.isConnected) {
        alert('Freighter not detected. Please install: https://www.freighter.app');
        return;
      }

      // 2. Request access
      const access = await requestAccess();
      if (access.error) throw new Error(access.error);

      setPublicKey(access.address);
    } catch (err) {
      console.error('Connection failed:', err);
      alert('Failed to connect to Freighter wallet');
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
  };

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-6)}`;

  if (publicKey) {
    return (
      <div className="flex items-center space-x-2 bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-mono text-gray-800">{truncate(publicKey)}</span>
        <button onClick={disconnect} className="ml-2 text-xs text-red-500 font-bold">✕</button>
      </div>
    );
  }

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