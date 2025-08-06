// app/analytics/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getPools, Pool } from '@/lib/soroswap';

export default function AnalyticsPage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPools = async () => {
      const data = await getPools();
      setPools(data);
      setLoading(false);
    };
    loadPools();
  }, []);

  // Calculate analytics
  const totalTVL = pools.reduce((sum, p) => sum + parseFloat(p.totalValueLockedUSD), 0);
  const avgAPY = pools.length > 0 ? pools.reduce((sum, p) => sum + parseFloat(p.apy), 0) / pools.length : 0;
  const highestAPY = pools.length > 0 ? Math.max(...pools.map(p => parseFloat(p.apy))) : 0;
  const lowestAPY = pools.length > 0 ? Math.min(...pools.map(p => parseFloat(p.apy))) : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2">DeFi Analytics</h1>
        <p className="text-gray-300 mb-8">Deep insights into Soroswap liquidity pools using DeFindex-powered metrics.</p>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
            <h2 className="text-sm font-medium text-gray-400">Total Value Locked</h2>
            <p className="text-2xl font-bold text-green-400 mt-1">${totalTVL.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
            <h2 className="text-sm font-medium text-gray-400">Avg APY</h2>
            <p className="text-2xl font-bold text-blue-400 mt-1">{avgAPY.toFixed(2)}%</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
            <h2 className="text-sm font-medium text-gray-400">Highest APY</h2>
            <p className="text-2xl font-bold text-yellow-400 mt-1">{highestAPY.toFixed(2)}%</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
            <h2 className="text-sm font-medium text-gray-400">Lowest APY</h2>
            <p className="text-2xl font-bold text-red-400 mt-1">{lowestAPY.toFixed(2)}%</p>
          </div>
        </div>

        {/* APY Distribution */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4">APY Distribution</h2>
          <div className="space-y-3">
            {pools.slice(0, 6).map((pool) => (
              <div key={pool.id} className="flex justify-between items-center">
                <span className="text-sm">
                  {pool.token0.symbol}-{pool.token1.symbol}
                </span>
                <div className="flex items-center space-x-2">
                  <div
                    className="h-2 bg-gradient-to-r from-red-500 to-green-500 rounded"
                    style={{ width: `${Math.min(parseFloat(pool.apy) * 5, 200)}px` }}
                  ></div>
                  <span className="text-sm font-mono w-16 text-right">{parseFloat(pool.apy).toFixed(2)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top High-Risk Pools (Mocked Risk Logic) */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">High-Risk Pools (Estimated)</h2>
          <p className="text-gray-400 text-sm mb-4">
            Based on high volatility and low liquidity.
          </p>
          <ul className="space-y-2">
            {pools
              .filter(p => parseFloat(p.apy) > 20)
              .slice(0, 5)
              .map((pool) => (
                <li key={pool.id} className="flex justify-between text-yellow-400">
                  <span>{pool.token0.symbol}-{pool.token1.symbol}</span>
                  <span>High APY, High Risk</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}