export type RiskScore = {
  poolId: string;
  riskScore: number; // 0–100
  volatility: number;
  ilRisk: number;
  apy: number;
};

export const getPoolRisk = async (poolId: string): Promise<RiskScore> => {
  try {
    // In real: await fetch(`https://api.defindex.io/v1/pool/${poolId}/risk`)
    // For now: mock
    return {
      poolId,
      riskScore: Math.floor(Math.random() * 100),
      volatility: Number((Math.random() * 2.5).toFixed(2)),
      ilRisk: Math.floor(Math.random() * 100),
      apy: Number((Math.random() * 25 + 5).toFixed(2)), // 5–30%
    };
  } catch (err) {
    console.warn('DeFindex API failed', err);
    return {
      poolId,
      riskScore: 75,
      volatility: 1.8,
      ilRisk: 68,
      apy: 12.4,
    };
  }
};