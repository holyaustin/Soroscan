// app/layout.tsx
// This file must be a Server Component (no "use client")
import './globals.css';

import LayoutClient from './layout-client';

export const metadata = {
  title: 'Soroscan – LP Intelligence',
  description: 'Soroswap + DeFindex analytics dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}