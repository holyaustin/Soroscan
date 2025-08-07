// lib/risk.ts

import { Pool } from './soroswap';

export type RiskScore = {
  poolId: string;
  riskScore: number;
  volatility: number;
  ilRisk: number;
  apy: number;
  safetyRating: 'Low' | 'Medium' | 'High';
};

export const calculateRisk = (pool: Pool): RiskScore => {
  // ✅ No parseFloat — these are already numbers
  const apy = pool.apy;
  const tvl = pool.totalValueLockedUSD;
  const volume = pool.volumeUSD;

  // Volatility: High APY + Low TVL + Low Volume = High Risk
  const volatility = apy > 20 && tvl < 1_000_000 && volume < 100_000 ? 85 : apy > 15 ? 65 : 30;

  // IL Risk: Low fee tier = higher impermanent loss
  const ilRisk = pool.feeTier < 500 ? 90 : pool.feeTier < 3000 ? 60 : 30;

  // Final risk score
  const riskScore = Math.round((volatility * 0.6) + (ilRisk * 0.4));

  // Safety rating
  let safetyRating: 'Low' | 'Medium' | 'High' = 'High';
  if (riskScore > 70) safetyRating = 'Low';
  else if (riskScore > 40) safetyRating = 'Medium';

  return {
    poolId: pool.id,
    riskScore,
    volatility,
    ilRisk,
    apy,
    safetyRating,
  };
};

// For multiple pools
export const getRiskScores = (pools: Pool[]): RiskScore[] => {
  return pools.map(calculateRisk);
};