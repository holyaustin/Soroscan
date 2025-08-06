// app/analytics/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Pool, getPools } from '@/lib/soroswap';

export default function AnalyticsPage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getPools();
      setPools(data);
      setLoading(false);
    };
    load();
  }, []);

  const highAPY = pools.filter(p => parseFloat(p.apy) > 20);
  const lowTVL = pools.filter(p => parseFloat(p.totalValueLockedUSD) < 1_000_000);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        {loading && <p className="text-gray-400">Loading analytics...</p>}
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-300 mb-8">Deep insights into Soroswap liquidity pools.</p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            {/* ✅ Fixed: Wrap in quotes or use {'>'} */}
            <h2 className="text-xl font-semibold mb-4">High-Yield Pools (APY {'>'} 20%)</h2>
            {highAPY.length === 0 ? (
              <p className="text-gray-400">None</p>
            ) : (
              <ul className="space-y-2">
                {highAPY.map((pool) => (
                  <li key={pool.id} className="text-sm">
                    {pool.token0.display_code}-{pool.token1.display_code}:{' '}
                    <strong>{parseFloat(pool.apy).toFixed(2)}%</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            {/* ✅ Fixed: Use string literal */}
            <h2 className="text-xl font-semibold mb-4">Low-Liquidity Pools (TVL {'<'} $1M)</h2>
            {lowTVL.length === 0 ? (
              <p className="text-gray-400">None</p>
            ) : (
              <ul className="space-y-2">
                {lowTVL.map((pool) => (
                  <li key={pool.id} className="text-sm">
                    {pool.token0.display_code}-{pool.token1.display_code}:{' '}
                    <strong>${parseFloat(pool.totalValueLockedUSD).toLocaleString()}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Fee Tier Distribution</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>0.01% (100bps)</span>
              <span>{pools.filter(p => p.feeTier === 100).length}</span>
            </div>
            <div className="flex justify-between">
              <span>0.05% (500bps)</span>
              <span>{pools.filter(p => p.feeTier === 500).length}</span>
            </div>
            <div className="flex justify-between">
              <span>0.30% (3000bps)</span>
              <span>{pools.filter(p => p.feeTier === 3000).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}