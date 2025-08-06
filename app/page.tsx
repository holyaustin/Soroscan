// app/page.tsx
'use client';

import { useState } from 'react';
import WalletButton from '@/components/WalletButton';

export default function Home() {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const handleConnect = (pk: string) => {
    setPublicKey(pk);
  };

  const handleDisconnect = () => {
    setPublicKey(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section
        className="relative h-96 md:h-[520px] flex items-center"
        style={{
          backgroundImage: `url('https://img.freepik.com/free-photo/abstract-futuristic-digital-circuit-board-ai-technology-background_53876-128859.jpg?w=1380')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative container mx-auto px-6 text-center text-white z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            <span className="block">Composable DeFi Intelligence</span>
            <span className="text-yellow-400">Powered by Soroswap & DeFindex</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto font-light opacity-95">
            Monitor, optimize, and secure your liquidity positions with real-time analytics, risk insights, and smart alerts — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <WalletButton onConnect={handleConnect} onDisconnect={handleDisconnect} />
            <a
              href="/dashboard"
              className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold text-lg rounded-lg hover:bg-yellow-300 hover:shadow-md transition-all transform hover:-translate-y-0.5"
            >
              Explore Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* Enhanced "Ready to Optimize Your LP Strategy?" Section */}
      {!publicKey && (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Ready to Optimize Your LP Strategy?
              </h2>
              <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
                Soroscan empowers liquidity providers with actionable insights from <strong className="text-indigo-600">Soroswap</strong> and <strong className="text-indigo-600">DeFindex</strong> — so you can earn more, risk less, and stay ahead.
              </p>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-8">
                {/* Card 1: Real-Time Analytics */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Analytics</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Track your liquidity positions, fees earned, and APR across Soroswap pools with live updates. Never miss a profitable opportunity.
                  </p>
                </div>

                {/* Card 2: Risk Intelligence */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-yellow-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Risk Intelligence</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get DeFindex-powered risk scores to avoid high impermanent loss and optimize for safety. Make data-driven decisions.
                  </p>
                </div>

                {/* Card 3: Smart Alerts */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🔔</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Alerts</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Never miss a fee harvest again. Get notified when it’s time to rebalance or claim rewards — directly in your wallet.
                  </p>
                </div>
              </div>

              {/* Final CTA */}
              <div className="mt-12 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-gray-800 font-medium text-lg">
                  <strong>Soroscan</strong> is your all-in-one dashboard for <strong>composable DeFi intelligence</strong> — built for the modern liquidity provider.
                </p>
                <button
                  onClick={() => document.querySelector('#connect-button')?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-4 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
                >
                  Connect Wallet to Get Started
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dashboard Preview (After Connect) */}
      {publicKey && (
        <section className="py-16 bg-gray-50 flex-grow">
          <div className="container mx-auto px-6 text-center">
            <div className="bg-white p-10 rounded-2xl shadow-md border max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome, {publicKey.slice(0, 6)}...{publicKey.slice(-6)}</h2>
              <p className="text-gray-600 mb-6">
                You&apos;re now connected to Soroscan. Explore your liquidity positions, fees, and risk insights.
              </p>
              <div className="space-y-4 text-left max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-gray-700">Wallet Status</span>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Integration</span>
                  <span className="text-indigo-600 font-medium">Soroswap + DeFindex</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Access Level</span>
                  <span className="text-yellow-600 font-medium">Full Read</span>
                </div>
              </div>
              <a
                href="/dashboard"
                className="mt-8 inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}