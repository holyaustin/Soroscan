// app/layout-client.tsx
'use client';

import { WalletProvider } from '@/context/WalletContext';
import Header from '@/components/Header';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <footer className="bg-white border-t py-6">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600">
            © 2025 <span className="font-bold text-indigo-600">Soroscan</span>. Composable DeFi Intelligence.
            <br />
            Built for the <strong>Soroswap + DeFindex Hackathon</strong>.
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}