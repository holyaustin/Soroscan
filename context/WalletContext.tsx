// context/WalletContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type WalletContextType = {
  publicKey: string | null;
  connect: (pk: string) => void;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const connect = (pk: string) => setPublicKey(pk);
  const disconnect = () => setPublicKey(null);

  return (
    <WalletContext.Provider value={{ publicKey, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}