// lib/soroswap.ts
export type Asset = {
  asset_code: string;
  asset_issuer: string;
  display_code: string;
  image: string;
  name: string;
};

export type Pool = {
  id: string;
  token0: Asset;
  token1: Asset;
  feeTier: number;
  sqrtPriceX96: string;
  liquidity: string;
  tick: number;
  totalValueLockedUSD: string;
  volumeUSD: string;
  apy: string;
  txCount: number;
  token0Price: string;
  token1Price: string;
};

export type Quote = {
  amountIn: string;
  amountOut: string;
  priceImpact: string;
  route: Array<{
    poolId: string;
    tokenIn: string;
    tokenOut: string;
  }>;
};

// Fetch all pools
export const getPools = async (): Promise<Pool[]> => {
  try {
    const res = await fetch('https://api.soroswap.finance/pools', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 }, // Revalidate every 60s
    });

    if (!res.ok) throw new Error('Failed to fetch pools');
    const data = await res.json();
    return data.pools || [];
  } catch (err) {
    console.error('API Error:', err);
    return [];
  }
};

// Fetch single pool by ID
export const getPoolById = async (id: string): Promise<Pool | null> => {
  try {
    const res = await fetch(`https://api.soroswap.finance/pools/${id}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

// Get quote for swap
export const getQuote = async (
  tokenIn: string,
  tokenOut: string,
  amountIn: string
): Promise<Quote | null> => {
  try {
    const res = await fetch(
      `https://api.soroswap.finance/quote?tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${amountIn}`,
      { next: { revalidate: 10 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

// Fetch asset list
export const getAssetList = async (): Promise<Asset[]> => {
  try {
    const res = await fetch('https://api.soroswap.finance/assetlist', {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return data.assets || [];
  } catch {
    return [];
  }
};

// Get price
export const getPrice = async (token: string): Promise<number | null> => {
  try {
    const res = await fetch(`https://api.soroswap.finance/price?token=${token}`);
    const data = await res.json();
    return parseFloat(data.price);
  } catch {
    return null;
  }
};