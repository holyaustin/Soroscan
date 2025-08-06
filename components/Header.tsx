// components/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import WalletButton from './WalletButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Dummy handlers — passed from page
  const handleConnect = (pk: string, network: string) => {};
  const handleDisconnect = () => {};

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo as Link to Home */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Soroscan</h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium">
            Dashboard
          </Link>
          <Link href="/pools" className="text-gray-700 hover:text-indigo-600 font-medium">
            Pools
          </Link>
          <Link href="/analytics" className="text-gray-700 hover:text-indigo-600 font-medium">
            Analytics
          </Link>
        </nav>

        {/* Wallet Button */}
        <WalletButton onConnect={handleConnect} onDisconnect={handleDisconnect} />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t px-4 py-2 space-y-2">
          <Link href="/dashboard" className="block text-gray-700">Dashboard</Link>
          <Link href="/pools" className="block text-gray-700">Pools</Link>
          <Link href="/analytics" className="block text-gray-700">Analytics</Link>
        </nav>
      )}
    </header>
  );
}