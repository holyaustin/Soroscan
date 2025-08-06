'use client';

import { useEffect } from 'react';

export default function TelegramAlerts({ publicKey }: { publicKey: string }) {
  useEffect(() => {
    if (!publicKey) return;

    const checkForAlerts = async () => {
      const positions = await fetch('/api/mock-lps').then(r => r.json());
      positions.forEach(lp => {
        const fees = parseFloat(lp.withdrawnUSD);
        if (fees > 10) {
          // Send alert
          const msg = `🔔 Soroscan Alert\n\nFees in ${lp.pool.token0.symbol}-${lp.pool.token1.symbol} pool: $${fees}\n\nHarvest now!`;
          const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
          const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
          if (token && chatId) {
            fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: chatId, text: msg }),
            });
          }
        }
      });
    };

    const interval = setInterval(checkForAlerts, 300000); // Every 5 min
    return () => clearInterval(interval);
  }, [publicKey]);

  return null;
}