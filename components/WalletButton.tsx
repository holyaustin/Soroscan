// components/WalletButton.tsx
'use client';

import { useState, useEffect } from 'react';

type WalletButtonProps = {
  onConnect: (publicKey: string) => void;
  onDisconnect: () => void;
};

export default function WalletButton({ onConnect, onDisconnect }: WalletButtonProps) {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    const checkInstallation = () => {
      setTimeout(() => {
        setIsInstalled(typeof window.freighterApi !== 'undefined');
      }, 300);
    };
    checkInstallation();
  }, []);

  const truncate = (addr: string) => `${addr.slice(0, 3)}...${addr.slice(-3)}`;

  const connect = async () => {
    setLoading(true);
    try {
      if (typeof window.freighterApi === 'undefined') {
        setIsInstalled(false);
        return;
      }

      const userData = await window.freighterApi.getUserInfo();
      setPublicKey(userData.publicKey);
      onConnect(userData.publicKey);
    } catch (err) {
      console.error(err);
      alert('Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
    onDisconnect();
  };

  const handleInstall = () => {
    window.open('https://www.freighter.app', '_blank');
  };

  if (publicKey) {
    return (
      <div className="flex items-center space-x-2 bg-white bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-mono text-gray-800">{truncate(publicKey)}</span>
        <button
          onClick={disconnect}
          className="ml-2 text-xs text-red-500 hover:text-red-700 font-bold"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={isInstalled === false ? handleInstall : connect}
        disabled={loading}
        className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium text-white transition
          ${loading
            ? 'bg-indigo-400 cursor-not-allowed'
            : isInstalled === false
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
      >
        {loading
          ? 'Connecting...'
          : isInstalled === false
          ? 'Install Freighter'
          : 'Connect Wallet'}
      </button>

      {isInstalled === false && (
        <p className="text-xs text-gray-500 text-center">Install to get started</p>
      )}
    </div>
  );
}