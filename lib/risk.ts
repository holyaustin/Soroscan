// lib/risk.ts
import { Pool } from './soroswap';

export type RiskScore = {
  poolId: string;
  riskScore: number; // 0–100
  volatility: number;
  ilRisk: number;
  apy: number;
  safetyRating: 'Low' | 'Medium' | 'High';
};

export const calculateRisk = (pool: Pool): RiskScore => {
  const apy = parseFloat(pool.apy);
  const tvl = parseFloat(pool.totalValueLockedUSD);
  const volume = parseFloat(pool.volumeUSD);

  // 1. Volatility Proxy: Low TVL + High APY = High Risk
  const volatility = apy > 20 && tvl < 1_000_000 ? 85 : apy > 15 && tvl < 2_000_000 ? 65 : 30;

  // 2. Impermanent Loss Risk: High fee tier = more stable
  const ilRisk = pool.feeTier < 500 ? 90 : pool.feeTier < 3000 ? 60 : 30;

  // 3. Safety Rating
  let safetyRating: 'Low' | 'Medium' | 'High' = 'High';
  const riskScore = Math.round((volatility * 0.6) + (ilRisk * 0.4));

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