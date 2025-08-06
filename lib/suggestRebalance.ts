import type { LPPosition } from '@/lib/queryIndexer';
import { getPoolRisk } from '@/lib/fetchRisk';

const SAFE_POOLS = [
  { id: 'usdc-usdt-100', name: 'USDC-USDT', apy: 8.2, risk: 20 },
  { id: 'dai-usdc-100', name: 'DAI-USDC', apy: 7.8, risk: 18 },
];

export const suggestRebalance = async (currentRisk: number, currentPool: string) => {
  if (currentRisk < 40) return null;
  return SAFE_POOLS[0]; // Return safest alternative
};