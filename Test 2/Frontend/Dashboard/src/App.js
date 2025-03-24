import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [dashboardData, setDashboardData] = useState({ weather: {}, crypto: {}, news: [] });
  const [loading, setLoading] = useState(true);
  const [lastCryptoUpdate, setLastCryptoUpdate] = useState(null);
  const [cryptoTrend, setCryptoTrend] = useState({ bitcoin: 0, ethereum: 0 });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/dashboard?city=London');
      const data = await response.json();
      setCryptoTrend({
        bitcoin: data.crypto.bitcoin > (dashboardData.crypto.bitcoin || 0) ? 1 : -1,
        ethereum: data.crypto.ethereum > (dashboardData.crypto.ethereum || 0) ? 1 : -1,
      });
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData(); // Initial fetch
    socket.on('crypto update', (crypto) => {
      setCryptoTrend({
        bitcoin: crypto.bitcoin > (dashboardData.crypto.bitcoin || 0) ? 1 : -1,
        ethereum: crypto.ethereum > (dashboardData.crypto.ethereum || 0) ? 1 : -1,
      });
      setDashboardData((prev) => ({ ...prev, crypto }));
      setLastCryptoUpdate(new Date().toLocaleTimeString());
    });

    return () => {
      socket.off('crypto update');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-4 sm:p-6">
      {/* Floating Header */}
      <header className="fixed top-4 left-4 right-4 z-10 bg-gradient-to-r from-blue-800 to-indigo-900 rounded-xl shadow-lg p-4 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          Data Dashboard
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => fetchDashboardData()}
            className={`h-10 w-32 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${loading ? 'animate-pulse' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                </svg>
                Refreshing...
              </>
            ) : (
              'Refresh'
            )}
          </button>
      
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 max-w-6xl mx-auto space-y-6">
        {/* Weather Section */}
        <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 animate-fade-in text-white">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">🌤️ Weather</h2>
          {dashboardData.weather.error ? (
            <p className="text-red-400">{dashboardData.weather.error}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/20 p-4 rounded-lg flex items-center gap-2">
                <span className="text-2xl">🏙️</span>
                <div>
                  <p className="text-sm text-gray-300">City</p>
                  <p className="text-lg font-medium">{dashboardData.weather.city}</p>
                </div>
              </div>
              <div className="bg-white/20 p-4 rounded-lg flex items-center gap-2">
                <span className="text-2xl">🌡️</span>
                <div>
                  <p className="text-sm text-gray-300">Temp</p>
                  <p className="text-lg font-medium">{dashboardData.weather.temp}°C</p>
                </div>
              </div>
              <div className="bg-white/20 p-4 rounded-lg flex items-center gap-2">
                <span className="text-2xl">💧</span>
                <div>
                  <p className="text-sm text-gray-300">Humidity</p>
                  <p className="text-lg font-medium">{dashboardData.weather.humidity}%</p>
                </div>
              </div>
              <div className="bg-white/20 p-4 rounded-lg flex items-center gap-2">
                <span className="text-2xl">☁️</span>
                <div>
                  <p className="text-sm text-gray-300">Conditions</p>
                  <p className="text-lg font-medium">{dashboardData.weather.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Crypto Section */}
        <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 animate-fade-in text-white">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">💰 Crypto Prices</h2>
          {dashboardData.crypto.error ? (
            <p className="text-red-400">{dashboardData.crypto.error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-500/20 to-green-700/20 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">₿</span>
                  <div>
                    <p className="text-sm text-gray-300">Bitcoin</p>
                    <p className="text-xl font-bold">${dashboardData.crypto.bitcoin?.toFixed(2)}</p>
                  </div>
                </div>
                <span className={`text-2xl ${cryptoTrend.bitcoin > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {cryptoTrend.bitcoin > 0 ? '↑' : '↓'}
                </span>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-700/20 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">Ξ</span>
                  <div>
                    <p className="text-sm text-gray-300">Ethereum</p>
                    <p className="text-xl font-bold">${dashboardData.crypto.ethereum?.toFixed(2)}</p>
                  </div>
                </div>
                <span className={`text-2xl ${cryptoTrend.ethereum > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {cryptoTrend.ethereum > 0 ? '↑' : '↓'}
                </span>
              </div>
              {lastCryptoUpdate && (
                <p className="text-sm text-gray-400 mt-2 text-center">Last Updated: {lastCryptoUpdate}</p>
              )}
            </div>
          )}
        </div>

        {/* News Section */}
        <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all duration-300 animate-fade-in text-white">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400">📰 Latest News</h2>
          {dashboardData.news.error ? (
            <p className="text-red-400">{dashboardData.news.error}</p>
          ) : (
            <div className="space-y-4">
              {dashboardData.news.map((article, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all duration-300 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📢</span>
                    <div>
                      <p className="text-lg font-medium">{article.title}</p>
                      <p className="text-sm text-gray-400">{article.source}</p>
                    </div>
                  </div>
                  <a
  href={article.url}
  target="_blank"
  rel="noopener noreferrer"
  className="h-10 w-32 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
>
  Read More 📖
</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;