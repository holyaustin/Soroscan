// lib/rebalance.ts
import { Pool } from './soroswap';
import { getRiskScores } from './risk';

export type RebalanceSuggestion = {
  fromPool: Pool;
  toPool: Pool;
  riskReduction: number;
  apyImpact: number;
  recommendation: 'High' | 'Medium' | 'Low';
};

export const suggestRebalance = (userPool: Pool, allPools: Pool[]): RebalanceSuggestion | null => {
  const userRisk = calculateRisk(userPool).riskScore;

  // Find safer pools with decent APY
  const candidates = allPools
    .filter(p => p.id !== userPool.id)
    .map(p => {
      const risk = calculateRisk(p);
      return {
        pool: p,
        riskScore: risk.riskScore,
        apy: parseFloat(p.apy),
      };
    })
    .filter(p => p.riskScore < userRisk && p.apy >= parseFloat(userPool.apy) * 0.7); // At least 70% of current APY

  if (candidates.length === 0) return null;

  // Pick best balance of safety and yield
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

// Helper
const calculateRisk = (pool: Pool) => {
  const apy = parseFloat(pool.apy);
  const tvl = parseFloat(pool.totalValueLockedUSD);
  const volatility = apy > 20 && tvl < 1_000_000 ? 85 : 65;
  const ilRisk = pool.feeTier < 500 ? 90 : pool.feeTier < 3000 ? 60 : 30;
  const riskScore = Math.round((volatility * 0.6) + (ilRisk * 0.4));
  return { riskScore };
};