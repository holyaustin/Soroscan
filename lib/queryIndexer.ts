import { GraphQLClient } from 'graphql-request';

// 🔁 Replace with real Soroswap indexer URL
const INDEXER_URL = 'https://api.studio.thegraph.com/query/123/soroswap/version/latest';

const client = new GraphQLClient(INDEXER_URL);

export type LPPosition = {
  id: string;
  pool: {
    id: string;
    token0: { symbol: string };
    token1: { symbol: string };
    feeTier: number;
    totalValueLockedUSD: string;
  };
  depositedUSD: string;
  withdrawnUSD: string; // fees earned
  liquidityTokenBalance: string;
};

export const getUserLPs = async (userAddress: string): Promise<LPPosition[]> => {
  const query = `
    query GetUserLPs($id: String!) {
      liquidityPositions(where: { user: $id }) {
        id
        pool {
          id
          token0 { symbol }
          token1 { symbol }
          feeTier
          totalValueLockedUSD
        }
        depositedUSD
        withdrawnUSD
        liquidityTokenBalance
      }
    }
  `;

  try {
    const data = await client.request<{ liquidityPositions: LPPosition[] }>(query, {
      id: userAddress.toLowerCase(),
    });
    return data.liquidityPositions;
  } catch (err) {
    console.warn('Indexer error (using mock)', err);
    return getMockLPs();
  }
};

// Mock data
const getMockLPs = (): LPPosition[] => [
  {
    id: '1',
    pool: {
      id: 'eth-usdc-3000',
      token0: { symbol: 'ETH' },
      token1: { symbol: 'USDC' },
      feeTier: 3000,
      totalValueLockedUSD: '1200000',
    },
    depositedUSD: '1200',
    withdrawnUSD: '42',
    liquidityTokenBalance: '0.0012',
  },
  {
    id: '2',
    pool: {
      id: 'usdc-usdt-100',
      token0: { symbol: 'USDC' },
      token1: { symbol: 'USDT' },
      feeTier: 100,
      totalValueLockedUSD: '5400000',
    },
    depositedUSD: '800',
    withdrawnUSD: '18',
    liquidityTokenBalance: '0.0008',
  },
];