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

/**
 * Suggest a safer pool to rebalance into
 */
export const suggestRebalance = (userPool: Pool, allPools: Pool[]): RebalanceSuggestion | null => {
  const userRisk = calculateRisk(userPool).riskScore;

  // Find pools with lower risk and decent APY
  const candidates = allPools
    .filter(p => p.id !== userPool.id)
    .map(p => ({
      pool: p,
      riskScore: calculateRisk(p).riskScore,
      apy: parseFloat(p.apy),
    }))
    .filter(p => p.riskScore < userRisk && p.apy >= parseFloat(userPool.apy) * 0.7);

  if (candidates.length === 0) return null;

  // Pick best trade-off between risk and yield
  const best = candidates.reduce((a, b) =>
    (userRisk - b.riskScore) / b.apy < (userRisk - a.riskScore) / a.apy ? b : a
  );

  const riskReduction = userRisk - best.riskScore;
  const apyImpact = best.apy - parseFloat(userPool.apy);

  return {
    fromPool: userPool,
    toPool: best.pool,
    riskReduction,
    apyImpact,
    recommendation: riskReduction > 20 ? 'High' : 'Medium',
  };
};