// lib/soroswap.ts
const API_URL = process.env.NEXT_PUBLIC_SOROSWAP_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_SOROSWAP_API_KEY;

export type Pool = {
  id: string;
  token0: { symbol: string; name: string };
  token1: { symbol: string; name: string };
  feeTier: number;
  totalValueLockedUSD: string;
  volumeUSD: string;
  apy: string;
};

export const getPools = async (): Promise<Pool[]> => {
  try {
    if (!API_URL || !API_KEY) throw new Error('API config missing');

    const res = await fetch(`${API_URL}/pools`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn('API error:', err);
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!data.pools) throw new Error('Invalid response format');

    console.log('✅ Fetched real pools:', data.pools.length);
    return data.pools;
  } catch (err) {
    console.warn('❌ API failed. Using mock data for demo only.', err);
    return getMockPools();
  }
};

// Mock only as fallback
const getMockPools = (): Pool[] => [
  {
    id: '1',
    token0: { symbol: 'ETH', name: 'Ethereum' },
    token1: { symbol: 'USDC', name: 'USD Coin' },
    feeTier: 3000,
    totalValueLockedUSD: '1200000',
    volumeUSD: '450000',
    apy: '18.4',
  },
];