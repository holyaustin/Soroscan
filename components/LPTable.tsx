'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/Card'; // ✅ Correct path
import { getUserLPs, LPPosition } from '@/lib/queryIndexer';
import { getPoolRisk } from '@/lib/fetchRisk';

// Define types
type EnrichedLP = LPPosition & { risk: number };

export default function LPTable({ publicKey }: { publicKey: string }) {
  const [lps, setLps] = useState<EnrichedLP[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) return;
    loadLPs();
  }, [publicKey]);

  const loadLPs = async () => {
    setLoading(true);
    try {
      const positions = await getUserLPs(publicKey);
      const enriched = await Promise.all(
        positions.map(async (lp) => {
          const riskData = await getPoolRisk(lp.pool.id);
          return { ...lp, risk: riskData.riskScore };
        })
      );
      setLps(enriched);
    } catch (err) {
      console.error('Failed to load LPs', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Your Liquidity Positions">
      {loading ? (
        <p className="text-gray-500">Loading positions...</p>
      ) : lps.length === 0 ? (
        <p className="text-gray-500">No LP positions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Pool</th>
                <th className="text-left py-2">Deposited</th>
                <th className="text-left py-2">Fees Earned</th>
                <th className="text-left py-2">Risk</th>
                <th className="text-left py-2">Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {lps.map((lp) => (
                <tr key={lp.id} className="border-b hover:bg-gray-50">
                  <td>{lp.pool.token0.symbol}-{lp.pool.token1.symbol}</td>
                  <td>${parseFloat(lp.depositedUSD).toLocaleString()}</td>
                  <td>${parseFloat(lp.withdrawnUSD).toLocaleString()}</td>
                  <td>
                    <RiskBadge score={lp.risk} />
                  </td>
                  <td>
                    <Suggestion risk={lp.risk} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

// ✅ Inline components
function RiskBadge({ score }: { score: number }) {
  const color = score > 70 ? 'red' : score > 40 ? 'yellow' : 'green';
  const colors = {
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[color]}`}>
      {score}/100
    </span>
  );
}

function Suggestion({ risk }: { risk: number }) {
  if (risk > 70) {
    return <span className="text-sm text-red-600">High risk — consider rebalancing</span>;
  }
  return <span className="text-sm text-green-600">Stable — holding is optimal</span>;
}