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
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch pools');

    const data = await res.json();
    return data.pools || [];
  } catch (err) {
    console.warn('API failed, using mock', err);
    return getMockPools();
  }
};

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
  {
    id: '2',
    token0: { symbol: 'BTC', name: 'Bitcoin' },
    token1: { symbol: 'USDT', name: 'Tether' },
    feeTier: 5000,
    totalValueLockedUSD: '2100000',
    volumeUSD: '620000',
    apy: '14.8',
  },
];