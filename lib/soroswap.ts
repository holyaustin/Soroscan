// lib/soroswap.ts

const API_URL = 'https://soroswap-api-staging-436722401508.us-central1.run.app';
const API_KEY = process.env.NEXT_PUBLIC_SOROSWAP_API_KEY || 'sk_e2acb3e0b5248f286023ef7ce9a5cde7e087c12579ae85fb3e9e318aeb11c6ce';

// === TYPES ===
export type ApiPosition = {
  pool: string;
  user: string;
  liquidity: string;
  depositedToken0: string;
  depositedToken1: string;
  feeGrowthInside0LastX128: string;
  feeGrowthInside1LastX128: string;
  tokensOwed0: string;
  tokensOwed1: string;
  poolInfo: {
    id: string;
    token0: string;
    token1: string;
    feeTier: string;
    totalValueLockedUSD: string;
    volumeUSD: string;
    apy: string;
    token0Price: string;
    token1Price: string;
  };
};

export type Pool = {
  id: string;
  token0: string;
  token1: string;
  feeTier: number;
  totalValueLockedUSD: number;
  volumeUSD: number;
  apy: number;
  token0Price: number;
  token1Price: number;
};

// === MOCK DATA ===
const mockPositions: ApiPosition[] = [
  {
    pool: '1',
    user: 'GBX...7YF',
    liquidity: '18305475',
    depositedToken0: '10000000',
    depositedToken1: '2598025',
    feeGrowthInside0LastX128: '0',
    feeGrowthInside1LastX128: '0',
    tokensOwed0: '12345',
    tokensOwed1: '6789',
    poolInfo: {
      id: '1',
      token0: 'ETH',
      token1: 'USDC',
      feeTier: '3000',
      totalValueLockedUSD: '1200000',
      volumeUSD: '450000',
      apy: '18.4',
      token0Price: '3000',
      token1Price: '1',
    },
  },
  {
    pool: '2',
    user: 'GBX...7YF',
    liquidity: '25000000',
    depositedToken0: '5000000',
    depositedToken1: '4800000',
    feeGrowthInside0LastX128: '0',
    feeGrowthInside1LastX128: '0',
    tokensOwed0: '9876',
    tokensOwed1: '4321',
    poolInfo: {
      id: '2',
      token0: 'BTC',
      token1: 'USDT',
      feeTier: '5000',
      totalValueLockedUSD: '2100000',
      volumeUSD: '620000',
      apy: '14.8',
      token0Price: '60000',
      token1Price: '1',
    },
  },
];

// === GET USER LIQUIDITY POSITIONS ===
export const getUserPositions = async (address: string): Promise<ApiPosition[]> => {
  try {
    const url = new URL(`${API_URL}/liquidity/positions/GD2KE7XPL2BK4CJODN33OO5I3PRIBXE3KKHHBW3O65TM4EM2PDUFSRTX`);
    url.searchParams.append('network', 'mainnet');

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn('API returned non-200:', res.status);
      return getMockPositions();
    }

    const data: ApiPosition[] = await res.json();
    return data.length > 0 ? data : getMockPositions();
  } catch (err) {
    console.error('API fetch failed:', err);
    return getMockPositions();
  }
};

// === FALLBACK ===
const getMockPositions = (): ApiPosition[] => {
  console.log('⚠️ Using mock liquidity positions — API failed or blocked');
  return mockPositions;
};

// === GET POOLS FROM POSITIONS (for analytics, dashboard) ===
export const getPoolsFromPositions = (positions: ApiPosition[]): Pool[] => {
  return positions.map(pos => ({
    id: pos.poolInfo.id,
    token0: pos.poolInfo.token0,
    token1: pos.poolInfo.token1,
    feeTier: parseFloat(pos.poolInfo.feeTier) || 0,
    totalValueLockedUSD: parseFloat(pos.poolInfo.totalValueLockedUSD) || 0,
    volumeUSD: parseFloat(pos.poolInfo.volumeUSD) || 0,
    apy: parseFloat(pos.poolInfo.apy) || 0,
    token0Price: parseFloat(pos.poolInfo.token0Price) || 0,
    token1Price: parseFloat(pos.poolInfo.token1Price) || 0,
  }));
};

// === RISK ENGINE ===
export const calculateRisk = (pool: Pool): {
  riskScore: number;
  volatility: number;
  ilRisk: number;
  safetyRating: 'Low' | 'Medium' | 'High';
} => {
  const volatility = pool.apy > 20 ? 85 : pool.apy > 15 ? 65 : 30;
  const ilRisk = pool.feeTier < 500 ? 90 : pool.feeTier < 3000 ? 60 : 30;
  const riskScore = Math.round((volatility * 0.6) + (ilRisk * 0.4));
  const safetyRating = riskScore > 70 ? 'Low' : riskScore > 40 ? 'Medium' : 'High';
  return { riskScore, volatility, ilRisk, safetyRating };
};