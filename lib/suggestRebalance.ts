// lib/suggestRebalance.ts
import { Pool } from './soroswap';
import { calculateRisk } from './risk';

export type RebalanceSuggestion = {
  fromPool: Pool;
  toPool: Pool;
  riskReduction: number;
  apyImpact: number;
  recommendation: 'High' | 'Medium' | 'Low';
};

export const suggestRebalance = (
  userPool: Pool,
  allPools: Pool[]
): RebalanceSuggestion | null => {
  const userRisk = calculateRisk(userPool).riskScore;

  const candidates = allPools
    .filter(p => p.id !== userPool.id)
    .map(p => {
      const risk = calculateRisk(p);
      return {
        pool: p,
        riskScore: risk.riskScore,
        apy: p.apy, // already number
      };
    })
    .filter(p => p.riskScore < userRisk && p.apy >= userPool.apy * 0.7);

  if (candidates.length === 0) return null;

  const best = candidates.reduce((a, b) =>
    (userRisk - b.riskScore) / b.apy < (userRisk - a.riskScore) / a.apy ? b : a
  );

  return {
    fromPool: userPool,
    toPool: best.pool,
    riskReduction: userRisk - best.riskScore,
    apyImpact: best.apy - userPool.apy,
    recommendation: (userRisk - best.riskScore) > 20 ? 'High' : 'Medium',
  };
};