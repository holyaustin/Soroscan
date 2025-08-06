// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Pool, getPools } from '@/lib/soroswap';

export default function DashboardPage() {
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

  const totalTVL = pools.reduce((sum, p) => sum + parseFloat(p.totalValueLockedUSD), 0);
  const avgAPY = pools.length > 0 ? pools.reduce((sum, p) => sum + parseFloat(p.apy), 0) / pools.length : 0;
  const topVolume = [...pools].sort((a, b) => parseFloat(b.volumeUSD) - parseFloat(a.volumeUSD))[0];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-300 mb-8">Live analytics from Soroswap — powered by real-time data.</p>

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
            <h2 className="text-sm font-medium text-gray-400">Pools</h2>
            <p className="text-2xl font-bold text-indigo-400 mt-1">{pools.length}</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl border border-yellow-500 text-center">
            <h2 className="text-sm font-medium text-gray-900">Top Volume</h2>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {topVolume ? `${topVolume.token0.display_code}-${topVolume.token1.display_code}` : '–'}
            </p>
            <p className="text-sm text-gray-900">
              ${topVolume ? parseFloat(topVolume.volumeUSD).toLocaleString() : '–'}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Top Pools</h2>
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pool</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TVL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">APY</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pools
                  .sort((a, b) => parseFloat(b.apy) - parseFloat(a.apy))
                  .slice(0, 6)
                  .map((pool) => (
                    <tr key={pool.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pool.token0.display_code}-{pool.token1.display_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ${parseFloat(pool.totalValueLockedUSD).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ${parseFloat(pool.volumeUSD).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                          {parseFloat(pool.apy).toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}