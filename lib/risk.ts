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
  const apy = parseFloat(pool.apy);
  const tvl = parseFloat(pool.totalValueLockedUSD);
  const volume = parseFloat(pool.volumeUSD); // ✅ Now used

  // 1. Volatility: High APY + Low TVL + Low Volume = High Risk
  const volatility = apy > 20 && tvl < 1_000_000 && volume < 100_000 ? 90 : apy > 15 ? 65 : 30;

  // 2. IL Risk: Low fee tier = higher impermanent loss
  const ilRisk = pool.feeTier < 500 ? 90 : pool.feeTier < 3000 ? 60 : 30;

  // 3. Safety Rating
  const riskScore = Math.round((volatility * 0.6) + (ilRisk * 0.4));
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

export const getRiskScores = (pools: Pool[]): RiskScore[] => {
  return pools.map(calculateRisk);
};