// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getPools, Pool } from '@/lib/soroswap';

export default function DashboardPage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTVL, setTotalTVL] = useState(0);
  const [totalAPY, setTotalAPY] = useState(0);

  useEffect(() => {
    const loadPools = async () => {
      const data = await getPools();
      setPools(data);

      // Calculate totals
      const tvl = data.reduce((sum, p) => sum + parseFloat(p.totalValueLockedUSD), 0);
      const apy = data.length > 0 ? data.reduce((sum, p) => sum + parseFloat(p.apy), 0) / data.length : 0;

      setTotalTVL(tvl);
      setTotalAPY(apy);
      setLoading(false);
    };
    loadPools();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">Your overview of Soroswap liquidity pools.</p>

        {/* Stats */}
        {loading ? null : (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <h2 className="text-sm font-medium text-gray-500">Total Value Locked</h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalTVL.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <h2 className="text-sm font-medium text-gray-500">Average APY</h2>
              <p className="text-2xl font-bold text-green-600 mt-1">{totalAPY.toFixed(2)}%</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <h2 className="text-sm font-medium text-gray-500">Active Pools</h2>
              <p className="text-2xl font-bold text-indigo-600 mt-1">{pools.length}</p>
            </div>
          </div>
        )}

        {/* Pools Table */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Pools</h2>
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APY</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pools.slice(0, 5).map((pool) => (
                  <tr key={pool.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {pool.token0.symbol}-{pool.token1.symbol}
                      </div>
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