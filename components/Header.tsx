// components/Header.tsx
'use client';

import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Soroscan</h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Dashboard</a>
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Pools</a>
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Analytics</a>
        </nav>

        {/* Wallet Button */}
        <div className="flex items-center">
          <WalletButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t px-4 py-2 space-y-2">
          <a href="#" className="block text-gray-700">Dashboard</a>
          <a href="#" className="block text-gray-700">Pools</a>
          <a href="#" className="block text-gray-700">Analytics</a>
        </nav>
      )}
    </header>
  );
}

// Inline WalletButton for now (or import from separate file)
function WalletButton() {
  const [connected, setConnected] = useState(false);

  return (
    <button
      onClick={() => setConnected(!connected)}
      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
    >
      {connected ? 'GBX...7YF' : 'Connect Wallet'}
    </button>
  );
}