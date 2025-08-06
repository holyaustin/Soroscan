// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getPools, Pool } from '@/lib/soroswap';
import { getRiskScores, calculateRisk } from '@/lib/risk';
import { suggestRebalance } from '@/lib/rebalance';
import { sendTelegramAlert } from '@/lib/telegram';

export default function DashboardPage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskScores, setRiskScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadData = async () => {
      const poolData = await getPools();
      setPools(poolData);

      const scores = getRiskScores(poolData);
      const scoreMap = scores.reduce((acc, s) => {
        acc[s.poolId] = s.riskScore;
        return acc;
      }, {} as Record<string, number>);
      setRiskScores(scoreMap);

      setLoading(false);
    };
    loadData();
  }, []);

  const totalTVL = pools.reduce((sum, p) => sum + parseFloat(p.totalValueLockedUSD), 0);
  const avgAPY = pools.length > 0 ? pools.reduce((sum, p) => sum + parseFloat(p.apy), 0) / pools.length : 0;
  const topPool = pools.length > 0 ? pools.reduce((a, b) => (parseFloat(a.apy) > parseFloat(b.apy) ? a : b)) : null;

  const handleRebalanceSuggestion = () => {
    if (!topPool || pools.length < 2) return;

    const suggestion = suggestRebalance(topPool, pools);
    if (suggestion) {
      const fromRisk = calculateRisk(suggestion.fromPool).riskScore;
      const toRisk = calculateRisk(suggestion.toPool).riskScore;

      const message = `
🔔 <b>Soroscan Alert: Rebalance Suggestion</b>

Your high-risk pool: <b>${suggestion.fromPool.token0.symbol}-${suggestion.fromPool.token1.symbol}</b>
Risk Score: <b>${fromRisk}/100</b> (High Volatility / Low TVL)

Recommended: <b>${suggestion.toPool.token0.symbol}-${suggestion.toPool.token1.symbol}</b>
Risk Score: <b>${toRisk}/100</b>
APY: <b>${parseFloat(suggestion.toPool.apy).toFixed(2)}%</b>

✅ Risk reduced by <b>${(fromRisk - toRisk).toFixed(1)}%</b>
💡 You keep 70%+ of your yield with far less risk.

Powered by Soroswap + DeFindex
      `.trim();

      sendTelegramAlert(message);
      alert('Rebalance suggestion sent to your Telegram!');
    } else {
      alert('No safer pools with good APY found.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-300 mb-8">Your overview of Soroswap liquidity pools with DeFindex-powered insights.</p>

        {/* Stats */}
        {!loading && (
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
              <h2 className="text-sm font-medium text-gray-400">Active Pools</h2>
              <p className="text-2xl font-bold text-indigo-400 mt-1">{pools.length}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl border border-yellow-500 text-center">
              <h2 className="text-sm font-medium text-gray-900">Top APY Pool</h2>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {topPool ? `${topPool.token0.symbol}-${topPool.token1.symbol}` : '–'}
              </p>
              <p className="text-xl font-bold text-gray-900">{topPool ? `${parseFloat(topPool.apy).toFixed(2)}%` : '–'}</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APY</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pools
                  .sort((a, b) => parseFloat(b.apy) - parseFloat(a.apy))
                  .slice(0, 6)
                  .map((pool) => (
                    <tr key={pool.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pool.token0.symbol}-{pool.token1.symbol}
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            riskScores[pool.id] > 70
                              ? 'bg-red-100 text-red-800'
                              : riskScores[pool.id] > 40
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {riskScores[pool.id] !== undefined ? `${riskScores[pool.id]}/100` : '–'}
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
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition"
            >
              🔄 Get Rebalance Suggestion (via Telegram)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}