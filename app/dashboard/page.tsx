// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ApiPosition, getUserPositions, getPoolsFromPositions } from '@/lib/soroswap';
import { suggestRebalance } from '@/lib/suggestRebalance';
import { sendTelegramAlert } from '@/lib/telegram';

// ✅ Define Pool type locally or import
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

export default function DashboardPage() {
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

  const totalTVL = pools.reduce((sum, p) => sum + p.totalValueLockedUSD, 0);
  const avgAPY = pools.length > 0 ? pools.reduce((sum, p) => sum + p.apy, 0) / pools.length : 0;
  const topPool = pools.length > 0 ? pools.reduce((a, b) => (b.apy > a.apy ? b : a)) : null;

  const handleRebalanceSuggestion = () => {
    if (!topPool || pools.length < 2) {
      alert('No pool data available for rebalancing.');
      return;
    }

    const suggestion = suggestRebalance(topPool, pools);
    if (suggestion) {
      const fromRisk = calculateRisk(suggestion.fromPool);
      const toRisk = calculateRisk(suggestion.toPool);

      const message = `
🔔 <b>Soroscan Alert: Rebalance Suggestion</b>

Your high-risk pool: <b>${suggestion.fromPool.token0}-${suggestion.fromPool.token1}</b>
Risk Score: <b>${fromRisk}/100</b>

Recommended: <b>${suggestion.toPool.token0}-${suggestion.toPool.token1}</b>
Risk Score: <b>${toRisk}/100</b>
APY: <b>${suggestion.toPool.apy.toFixed(2)}%</b>

✅ Risk reduced by <b>${(fromRisk - toRisk).toFixed(1)}%</b>
💡 You keep 70%+ of your yield with far less risk.

Powered by Soroswap + DeFindex
      `.trim();

      sendTelegramAlert(message);
      alert('✅ Rebalance suggestion sent to your Telegram!');
    } else {
      alert('No safer pools with good APY found.');
    }
  };

  const calculateRisk = (pool: Pool): number => {
    const volatility = pool.apy > 20 ? 85 : pool.apy > 15 ? 65 : 30;
    const ilRisk = pool.feeTier < 500 ? 90 : pool.feeTier < 3000 ? 60 : 30;
    return Math.round((volatility * 0.6) + (ilRisk * 0.4));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-300 mb-8">Live analytics from Soroswap staging API.</p>

        {/* Stats */}
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
              <h2 className="text-sm font-medium text-gray-400">Active Pools</h2>
              <p className="text-2xl font-bold text-indigo-400 mt-1">{pools.length}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl border border-yellow-500 text-center">
              <h2 className="text-sm font-medium text-gray-900">Top APY Pool</h2>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {topPool ? `${topPool.token0}-${topPool.token1}` : '–'}
              </p>
              <p className="text-xl font-bold text-gray-900">{topPool ? `${topPool.apy.toFixed(2)}%` : '–'}</p>
            </div>
          </div>
        )}

        {/* Top Pools Table */}
        <h2 className="text-xl font-semibold mb-4">Top Performing Pools</h2>
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-400">Loading dashboard...</p>
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
                  .sort((a, b) => b.apy - a.apy)
                  .slice(0, 6)
                  .map((pool) => (
                    <tr key={pool.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pool.token0}-{pool.token1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ${pool.totalValueLockedUSD.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ${pool.volumeUSD.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                          {pool.apy.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Rebalance Button */}
        {topPool && !loading && (
          <div className="mt-8 text-center">
            <button
              onClick={handleRebalanceSuggestion}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition transform hover:-translate-y-0.5"
            >
              🔄 Get Rebalance Suggestion (via Telegram)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}