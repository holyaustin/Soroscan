'use client';

import { useState } from 'react'; // ✅ Added
import WalletButton from '@/components/WalletButton';
import LPTable from '@/components/LPTable';
import TelegramAlerts from '@/components/TelegramAlerts';

export default function Home() {
  const [publicKey, setPublicKey] = useState<string | null>(null); // ✅ Fixed type

  return (
    <main className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Soroscan</h1>
        <p className="text-gray-600">Smart LP Assistant for Soroswap + DeFindex</p>
      </div>

      {!publicKey ? (
        <div className="flex justify-center">
          <WalletButton onConnect={setPublicKey} />
        </div>
      ) : (
        <>
          <LPTable publicKey={publicKey} />
          <TelegramAlerts publicKey={publicKey} />
        </>
      )}
    </main>
  );
}