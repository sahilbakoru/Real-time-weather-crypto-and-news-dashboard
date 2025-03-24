require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// API Keys
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

if (!NEWSAPI_KEY || !COINMARKETCAP_API_KEY) {
  console.error('Missing API keys in .env');
  process.exit(1);
}

// Fetch data from APIs
const fetchWeather = async (lat = 51.5074, lon = -0.1278) => {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weathercode`
    );
    const current = response.data.current;
    return {
      city: 'London',
      temp: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      description: weatherCodeToDescription(current.weathercode),
    };
  } catch (error) {
    console.error('Open-Meteo API error:', error.message);
    return { error: 'Failed to fetch weather data' };
  }
};

const weatherCodeToDescription = (code) => {
  const codes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    61: 'Rain',
    80: 'Showers',
  };
  return codes[code] || 'Unknown';
};

const fetchCrypto = async () => {
  try {
    const response = await axios.get(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      {
        headers: { 'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY },
        params: { symbol: 'BTC,ETH', convert: 'USD' },
      }
    );
    return {
      bitcoin: response.data.data.BTC.quote.USD.price,
      ethereum: response.data.data.ETH.quote.USD.price,
    };
  } catch (error) {
    console.error('CoinMarketCap API error:', error.response?.data || error.message);
    return { error: 'Failed to fetch crypto data' };
  }
};

const fetchNews = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=technology&apiKey=${NEWSAPI_KEY}&pageSize=5`
    );
    return response.data.articles.map(article => ({
      title: article.title,
      source: article.source.name,
      url: article.url,
    }));
  } catch (error) {
    console.error('News API error:', error.message);
    return { error: 'Failed to fetch news data' };
  }
};

// Aggregate data
const getDashboardData = async () => {
  const [weather, crypto, news] = await Promise.all([
    fetchWeather(),
    fetchCrypto(),
    fetchNews(),
  ]);
  return { weather, crypto, news };
};

// Serve dashboard data via GET endpoint
app.get('/dashboard', async (req, res) => {
  const data = await getDashboardData();
  res.json(data);
});

// Real-time crypto updates via WebSockets
const updateCrypto = async () => {
  const crypto = await fetchCrypto();
  io.emit('crypto update', crypto);
};

// Update crypto every 30 seconds
setInterval(updateCrypto, 30000);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});