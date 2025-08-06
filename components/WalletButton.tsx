'use client';

import { useState } from 'react';

type WalletButtonProps = {
  onConnect: (publicKey: string) => void;
};

export default function WalletButton({ onConnect }: WalletButtonProps) {
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    setLoading(true);

    try {
      // ✅ 1. Check if freighterApi exists
      if (typeof window.freighterApi === 'undefined') {
        alert('Freighter wallet not detected. Please install: https://www.freighter.app');
        return;
      }

      // ✅ 2. Check if isInstalled method exists and call it
      const isInstalled = await window.freighterApi.isInstalled?.();
      if (!isInstalled) {
        alert('Freighter is not installed. Please install it to continue.');
        return;
      }

      // ✅ 3. Now safe to call getUserInfo
      const userData = await window.freighterApi.getUserInfo();
      if (!userData?.publicKey) {
        alert('Failed to retrieve public key');
        return;
      }

      // ✅ 4. Connect successfully
      onConnect(userData.publicKey);
    } catch (err: unknown) {
      console.error('Freighter connection failed:', err);

      if (err instanceof Error) {
        alert(`Connection error: ${err.message}`);
      } else {
        alert('Failed to connect to Freighter wallet');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={connect}
      disabled={loading}
      className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white px-4 py-2 rounded-lg text-sm font-medium"
    >
      {loading ? 'Connecting...' : 'Connect Freighter'}
    </button>
  );
}