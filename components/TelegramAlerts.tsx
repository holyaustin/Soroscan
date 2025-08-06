// components/TelegramAlerts.tsx
'use client';

import { useEffect } from 'react';
import { sendTelegramAlert } from '@/lib/telegram';

// Define LP Position type
type LPPosition = {
  poolId: string;
  userAddress: string;
  depositedUSD: string;
  withdrawnUSD: string; // fees earned
  liquidityTokenBalance: string;
};

// Mock: In real app, this comes from user's LP data
const mockLPPositions: LPPosition[] = [
  {
    poolId: '1',
    userAddress: 'GBX...7YF',
    depositedUSD: '1200',
    withdrawnUSD: '42', // $42 in fees
    liquidityTokenBalance: '0.0012',
  },
];

export default function TelegramAlerts({ publicKey }: { publicKey: string }) {
  useEffect(() => {
    if (!publicKey) return;

    const checkForAlerts = async () => {
      // In real app: fetch user's LP positions from Soroswap + DeFindex
      // For demo: use mock data
      mockLPPositions.forEach((lp: LPPosition) => {
        const fees = parseFloat(lp.withdrawnUSD);
        if (fees > 10) {
          const message = `
🔔 <b>Soroscan Alert</b>

You’ve earned <b>$${fees}</b> in fees from your LP position.

💡 Time to harvest and rebalance for better yield?

Powered by Soroswap + DeFindex
          `.trim();

          sendTelegramAlert(message);
        }
      });
    };

    // Check every 5 minutes
    const interval = setInterval(checkForAlerts, 300000);
    return () => clearInterval(interval);
  }, [publicKey]);

  return null;
}