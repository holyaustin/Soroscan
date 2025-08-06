// app/layout.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css'; // ✅ MUST be present

export const metadata = {
  title: 'Soroscan – Smart LP Assistant for Soroswap & DeFindex',
  description: 'Track, optimize, and secure your liquidity positions with real-time risk insights and alerts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}