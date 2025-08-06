// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-footer text-white py-8">
      <div className="container mx-auto px-4 text-center text-sm opacity-90">
        <p>
          Soroscan: Composable DeFi Intelligence
        </p>
        <p className="mt-1 text-gray-300">
          Built for the Soroswap + DeFindex Hackathon
        </p>
        <div className="mt-4 flex justify-center space-x-6 text-gray-400">
          <a href="/dashboard" className="hover:text-mustard transition">Dashboard</a>
          <a href="/pools" className="hover:text-mustard transition">Pools</a>
          <a href="/analytics" className="hover:text-mustard transition">Analytics</a>
        </div>
      </div>
    </footer>
  );
}