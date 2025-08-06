// app/pools/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Pool, getPools } from '@/lib/soroswap';
import Image from 'next/image';

export default function PoolsPage() {
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

  return (
    <div className="min-h-screen bg-blue-900 text-white py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2">Liquidity Pools</h1>
        <p className="text-blue-100 mb-8">Live data from Soroswap — updated every 60 seconds.</p>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-blue-200">Loading pools...</p>
          </div>
        ) : pools.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-blue-200">No pools available.</p>
          </div>
        ) : (
          <div className="bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pool</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TVL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume (24h)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">APY</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Tier</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pools.map((pool) => (
                  <tr key={pool.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Image src={pool.token0.image} alt={pool.token0.display_code} className="w-6 h-6 rounded-full mr-2" />
                        <Image src={pool.token1.image} alt={pool.token1.display_code} className="w-6 h-6 rounded-full mr-2" />
                        <span className="text-sm font-medium">
                          {pool.token0.display_code}-{pool.token1.display_code}
                        </span>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {pool.feeTier / 10000}%
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