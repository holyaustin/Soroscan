// app/page.tsx
'use client';

import { useState } from 'react';
import WalletButton from '@/components/WalletButton';
import LPTable from '@/components/LPTable';
import TelegramAlerts from '@/components/TelegramAlerts';

export default function Home() {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const handleConnect = (pk: string) => setPublicKey(pk);
  const handleDisconnect = () => setPublicKey(null);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-96 md:h-[500px] bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1639762681057-47a2e0f6878c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6 text-white z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Smart LP <span className="text-indigo-300">Assistant</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-90">
            Track, optimize, and secure your liquidity positions on Soroswap with real-time risk insights from DeFindex.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WalletButton onConnect={handleConnect} onDisconnect={handleDisconnect} />
            <a
              href="#dashboard"
              className="text-indigo-700 bg-white hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium transition text-center"
            >
              View Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Your Liquidity Overview</h2>
            <p className="text-gray-600 mt-2">
              Real-time data from Soroswap + risk insights from DeFindex
            </p>
          </div>

          {/* Wallet & LP Table */}
          {publicKey ? (
            <>
              <div className="mb-6 text-right">
                <button
                  onClick={handleDisconnect}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Disconnect {publicKey.slice(0, 6)}...{publicKey.slice(-6)}
                </button>
              </div>
              <LPTable publicKey={publicKey} />
              <TelegramAlerts publicKey={publicKey} />
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
              <p className="text-gray-500">Connect your wallet to view LP positions</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}