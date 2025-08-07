// app/pools/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ApiPosition, getUserPositions } from '@/lib/soroswap';

export default function PoolsPage() {
  const [positions, setPositions] = useState<ApiPosition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getUserPositions('GDRIVER...MOCK');
        setPositions(data);
      } catch {
        // Ignore error, use mock
        setPositions([
          {
            pool: '1',
            user: 'GBX...7YF',
            liquidity: '18305475',
            depositedToken0: '10000000',
            depositedToken1: '2598025',
            feeGrowthInside0LastX128: '0',
            feeGrowthInside1LastX128: '0',
            tokensOwed0: '12345',
            tokensOwed1: '6789',
            poolInfo: {
              id: '1',
              token0: 'ETH',
              token1: 'USDC',
              feeTier: '3000',
              totalValueLockedUSD: '1200000',
              volumeUSD: '450000',
              apy: '18.4',
              token0Price: '3000',
              token1Price: '1',
            },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-blue-900 text-white py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2">Top Liquidity Pools</h1>
        <p className="text-blue-100 mb-8">Live and mock data from Soroswap (staging API).</p>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-blue-200">Loading pools...</p>
          </div>
        ) : positions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-blue-200">No pools available at the moment.</p>
          </div>
        ) : (
          <div className="bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pool</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deposited</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fees Owed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">APY</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {positions.map((pos) => (
                  <tr key={pos.pool} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        {pos.poolInfo.token0}-{pos.poolInfo.token1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {parseFloat(pos.depositedToken0).toFixed(2)} {pos.poolInfo.token0}
                      <br />
                      {parseFloat(pos.depositedToken1).toFixed(2)} {pos.poolInfo.token1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {parseFloat(pos.tokensOwed0).toFixed(6)} {pos.poolInfo.token0}
                      <br />
                      {parseFloat(pos.tokensOwed1).toFixed(6)} {pos.poolInfo.token1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                        {parseFloat(pos.poolInfo.apy).toFixed(2)}%
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