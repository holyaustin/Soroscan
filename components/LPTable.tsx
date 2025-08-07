// components/LPTable.tsx
'use client';

import { useEffect, useState } from 'react';
import { getUserLPs, LPPosition } from '@/lib/queryIndexer';
import { getPoolRisk } from '@/lib/fetchRisk';

export default function LPTable({ publicKey }: { publicKey: string }) {
  const [lps, setLps] = useState<Array<LPPosition & { risk: number }>>([]);

  useEffect(() => {
    if (!publicKey) return;

    const loadLPs = async () => {
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
      }
    };

    loadLPs();
  }, [publicKey]);

  return (
    <Card title="Your Liquidity Positions">
      {lps.length === 0 ? (
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
                    {/* ✅ Now Suggestion accepts 'pool' */}
                    <Suggestion risk={lp.risk} pool={lp.pool} />
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

// ------------------------------
// Card Component
// ------------------------------
function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
}

// ------------------------------
// RiskBadge Component
// ------------------------------
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

// ------------------------------
// Suggestion Component (Fixed)
// ------------------------------
function Suggestion({ risk, pool }: { risk: number; pool: LPPosition['pool'] }) {
  const isStable = ['USDC', 'USDT', 'DAI'].includes(pool.token0.symbol) && 
                   ['USDC', 'USDT', 'DAI'].includes(pool.token1.symbol);

  if (risk > 70 && !isStable) {
    return (
      <button className="text-sm text-red-600 hover:underline font-medium">
        Rebalance to USDC-USDT
      </button>
    );
  }

  return <span className="text-sm text-green-600">Hold — low risk</span>;
}