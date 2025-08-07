// app/analytics/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ApiPosition, getUserPositions, getPoolsFromPositions, calculateRisk } from '@/lib/soroswap';

// ✅ Define Pool type (same as in lib/soroswap.ts)
type Pool = {
  id: string;
  token0: string;
  token1: string;
  feeTier: number;
  totalValueLockedUSD: number;
  volumeUSD: number;
  apy: number;
  token0Price: number;
  token1Price: number;
};

export default function AnalyticsPage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const positions = await getUserPositions('GDRIVER...MOCK');
        const poolData = getPoolsFromPositions(positions);
        setPools(poolData);
      } catch (err) {
        console.error('Load failed:', err);
        setPools([
          {
            id: '1',
            token0: 'ETH',
            token1: 'USDC',
            feeTier: 3000,
            totalValueLockedUSD: 1_200_000,
            volumeUSD: 450_000,
            apy: 18.4,
            token0Price: 3000,
            token1Price: 1,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ✅ Removed: lowTVL (was unused)
  const highAPY = pools.filter(p => p.apy > 18);
  const riskyPools = pools.filter(p => calculateRisk(p).riskScore > 70);

  const totalTVL = pools.reduce((sum, p) => sum + p.totalValueLockedUSD, 0);
  const avgAPY = pools.length > 0 ? pools.reduce((sum, p) => sum + p.apy, 0) / pools.length : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-300 mb-8">Deep insights into Soroswap liquidity pools.</p>

        {/* Summary Stats */}
        {!loading && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
              <h2 className="text-sm font-medium text-gray-400">Total TVL</h2>
              <p className="text-2xl font-bold text-green-400 mt-1">${totalTVL.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
              <h2 className="text-sm font-medium text-gray-400">Avg APY</h2>
              <p className="text-2xl font-bold text-blue-400 mt-1">{avgAPY.toFixed(2)}%</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
              <h2 className="text-sm font-medium text-gray-400">High-Yield Pools</h2>
              <p className="text-2xl font-bold text-yellow-400 mt-1">{highAPY.length}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
              <h2 className="text-sm font-medium text-gray-400">Risky Pools</h2>
              <p className="text-2xl font-bold text-red-400 mt-1">{riskyPools.length}</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* High-Yield Pools */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">High-Yield Pools (APY {'>'} 18%)</h2>
            {highAPY.length === 0 ? (
              <p className="text-gray-400">None</p>
            ) : (
              <ul className="space-y-2">
                {highAPY.map((pool) => (
                  <li key={pool.id} className="text-sm">
                    {pool.token0}-{pool.token1}: <strong>{pool.apy.toFixed(2)}%</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Risky Pools */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">High-Risk Pools (Score {'>'} 70)</h2>
            {riskyPools.length === 0 ? (
              <p className="text-gray-400">None</p>
            ) : (
              <ul className="space-y-2">
                {riskyPools.map((pool) => {
                  const risk = calculateRisk(pool);
                  return (
                    <li key={pool.id} className="text-sm">
                      {pool.token0}-{pool.token1}: <strong>{risk.riskScore}/100</strong> ({risk.safetyRating})
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Diversification */}
        <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Portfolio Diversification</h2>
          <div className="space-y-2">
            {pools.map((pool) => {
              const share = (pool.totalValueLockedUSD / totalTVL) * 100;
              return (
                <div key={pool.id} className="flex justify-between text-sm">
                  <span>{pool.token0}-{pool.token1}</span>
                  <span>{share.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}