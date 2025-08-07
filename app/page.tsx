// app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section
        className="relative h-96 md:h-[520px] flex items-center"
        style={{
          backgroundImage: `url('https://img.freepik.com/free-photo/abstract-futuristic-digital-circuit-board-ai-technology-background_53876-128859.jpg?w=1380')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative container mx-auto px-6 text-center text-white z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            <span className="block">Composable DeFi Intelligence</span>
            <span className="text-yellow-400">Powered by Soroswap & DeFindex</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto font-light opacity-95">
            Monitor, optimize, and secure your liquidity positions with real-time analytics, risk insights, and smart alerts — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
           
            <a
              href="/dashboard"
              className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold text-lg rounded-lg hover:bg-yellow-300 hover:shadow-md transition-all transform hover:-translate-y-0.5"
            >
              Explore Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* Ready to Optimize Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Ready to Optimize Your LP Strategy?
            </h2>
            <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
              Soroscan empowers liquidity providers with actionable insights from{' '}
              <strong className="text-indigo-600">Soroswap</strong> and{' '}
              <strong className="text-indigo-600">DeFindex</strong> — so you can earn more, risk less, and stay ahead.
            </p>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Track your liquidity positions, fees earned, and APR across Soroswap pools with live updates.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-yellow-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Risk Intelligence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get DeFindex-powered risk scores to avoid high impermanent loss and optimize for safety.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🔔</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Alerts</h3>
                <p className="text-gray-600 leading-relaxed">
                  Never miss a fee harvest again. Get notified when it’s time to rebalance or claim rewards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}