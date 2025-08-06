// app/pools/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getPools, Pool } from '@/lib/soroswap'; // ✅ Import Pool

export default function PoolsPage() {
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

  return (
    <div className="min-h-screen bg-blue-900 text-white py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2">Liquidity Pools</h1>
        <p className="text-blue-100 mb-8">Explore active pools on Soroswap with real-time APY, volume, and risk insights.</p>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-blue-200">Loading pools...</p>
          </div>
        ) : pools.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-blue-200">No pools available at the moment.</p>
          </div>
        ) : (
          <div className="bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume (24h)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APY</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pools.map((pool) => (
                  <tr key={pool.id} className="hover:bg-gray-50 transition">
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