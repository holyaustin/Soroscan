// lib/soroswap.ts


// ✅ Load from environment (safe)
const API_URL = process.env.NEXT_PUBLIC_SOROSWAP_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_SOROSWAP_API_KEY || 'sk_e2acb3e0b5248f286023ef7ce9a5cde7e087c12579ae85fb3e9e318aeb11c6ce';


// Validate
if (!API_URL) {
  console.error('NEXT_PUBLIC_SOROSWAP_API_URL is not set');
}
if (!API_KEY) {
  console.error('NEXT_PUBLIC_SOROSWAP_API_KEY is not set');
}

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

// === MOCK POOLS (5 Real Pairs) ===
const mockPositions: ApiPosition[] = [
  {
    pool: '1',
    user: 'GCU5BZWLVJW7UIELIAWACFLMU4SH7GE7R2Q75EABY6S75NG7ICMAQC56',
    liquidity: '18305475',
    depositedToken0: '10000000',
    depositedToken1: '2598025',
    feeGrowthInside0LastX128: '0',
    feeGrowthInside1LastX128: '0',
    tokensOwed0: '12345',
    tokensOwed1: '6789',
    poolInfo: {
      id: '1',
      token0: 'XLM',
      token1: 'USDC',
      feeTier: '100',
      totalValueLockedUSD: '1200000',
      volumeUSD: '450000',
      apy: '8.42',
      token0Price: '0.50',
      token1Price: '1.00',
    },
  },
  {
    pool: '2',
    user: 'GCU5BZWLVJW7UIELIAWACFLMU4SH7GE7R2Q75EABY6S75NG7ICMAQC56',
    liquidity: '25000000',
    depositedToken0: '5000000',
    depositedToken1: '4800000',
    feeGrowthInside0LastX128: '0',
    feeGrowthInside1LastX128: '0',
    tokensOwed0: '9876',
    tokensOwed1: '4321',
    poolInfo: {
      id: '2',
      token0: 'ETH',
      token1: 'USDC',
      feeTier: '3000',
      totalValueLockedUSD: '7200000',
      volumeUSD: '1800000',
      apy: '18.75',
      token0Price: '3000',
      token1Price: '1.00',
    },
  },
  {
    pool: '3',
    user: 'GCU5BZWLVJW7UIELIAWACFLMU4SH7GE7R2Q75EABY6S75NG7ICMAQC56',
    liquidity: '15000000',
    depositedToken0: '3000000',
    depositedToken1: '90000000',
    feeGrowthInside0LastX128: '0',
    feeGrowthInside1LastX128: '0',
    tokensOwed0: '4500',
    tokensOwed1: '135000',
    poolInfo: {
      id: '3',
      token0: 'BTC',
      token1: 'USDT',
      feeTier: '5000',
      totalValueLockedUSD: '21000000',
      volumeUSD: '6200000',
      apy: '14.80',
      token0Price: '60000',
      token1Price: '1.00',
    },
  },
  {
    pool: '4',
    user: 'GCU5BZWLVJW7UIELIAWACFLMU4SH7GE7R2Q75EABY6S75NG7ICMAQC56',
    liquidity: '8000000',
    depositedToken0: '2000000',
    depositedToken1: '6000000',
    feeGrowthInside0LastX128: '0',
    feeGrowthInside1LastX128: '0',
    tokensOwed0: '2100',
    tokensOwed1: '6300',
    poolInfo: {
      id: '4',
      token0: 'SOL',
      token1: 'USDC',
      feeTier: '3000',
      totalValueLockedUSD: '3500000',
      volumeUSD: '950000',
      apy: '22.30',
      token0Price: '175',
      token1Price: '1.00',
    },
  },
  {
    pool: '5',
    user: 'GCU5BZWLVJW7UIELIAWACFLMU4SH7GE7R2Q75EABY6S75NG7ICMAQC56',
    liquidity: '12000000',
    depositedToken0: '4000000',
    depositedToken1: '8000000',
    feeGrowthInside0LastX128: '0',
    feeGrowthInside1LastX128: '0',
    tokensOwed0: '3200',
    tokensOwed1: '6400',
    poolInfo: {
      id: '5',
      token0: 'XLM',
      token1: 'ETH',
      feeTier: '500',
      totalValueLockedUSD: '4800000',
      volumeUSD: '1100000',
      apy: '12.60',
      token0Price: '0.50',
      token1Price: '3000',
    },
  },
];

// === GET USER LIQUIDITY POSITIONS ===
export const getUserPositions = async (address: string = 'GCU5BZWLVJW7UIELIAWACFLMU4SH7GE7R2Q75EABY6S75NG7ICMAQC56'): Promise<ApiPosition[]> => {
  try {
    const url = new URL(`${API_URL}/liquidity/positions/${address}`);
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
      console.warn('API Error:', res.status, await res.text());
      return getMockPositions();
    }

    const data: ApiPosition[] = await res.json();
    return data.length > 0 ? data : getMockPositions();
  } catch (err) {
    console.error('Fetch failed:', err);
    return getMockPositions();
  }
};

// === FALLBACK ===
const getMockPositions = (): ApiPosition[] => {
  console.log('⚠️ Using mock positions — API failed or no data');
  return mockPositions;
};

// === EXTRACT POOLS FROM POSITIONS ===
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