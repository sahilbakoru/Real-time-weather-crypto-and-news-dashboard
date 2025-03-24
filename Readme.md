
![Screenshot 2025-03-24 at 12 57 46 PM](https://github.com/user-attachments/assets/ac218dba-9fa4-4497-aeb3-a2be69524c9c)

Overview
--------

The Data Aggregation Dashboard fetches and displays real-time data from multiple APIs:

*   Weather: Open-Meteo (for current weather in a specified city).
    
*   Cryptocurrency Prices: CoinMarketCap (for Bitcoin and Ethereum prices, updated every 30 seconds).
    
*   News: NewsAPI (for the latest technology headlines).
    

The dashboard uses Socket.io for real-time crypto price updates and features a modern glassmorphism design with neon glows and emojis.

Setup
-----

1.  Clone the Repository (if not already done):git clone cd
    
2.  Install Dependencies:Navigate to the project root and install the required packages:npm install
    
3.  Set Up Environment Variables:Create a .env file in the root directory and add your API keys:NEWSAPI\_KEY=your\_newsapi\_keyCOINMARKETCAP\_API\_KEY=your\_coinmarketcap\_key
    
    *   Get your NewsAPI key from NewsAPI ([https://newsapi.org/](https://newsapi.org/)).
        
    *   Get your CoinMarketCap API key from CoinMarketCap ([https://coinmarketcap.com/api/](https://coinmarketcap.com/api/)).
        
    *   Open-Meteo does not require an API key.
        
4.  Run the Application:
    
    *   Start the backend:node server.js
        
    *   In a separate terminal, start the frontend:npm start
        

Usage
-----

*   Open [http://localhost:3001](http://localhost:3001) in your browser.
    
*   The dashboard displays:
    
    *   Weather for London (hardcoded).
        
    *   Bitcoin and Ethereum prices, updated every 30 seconds via WebSockets.
        
    *   Latest technology news headlines.
        
*   Click the "Refresh" button to manually update the data.
    
*   Click "Read More" on news articles to visit the source.
    
*   The "Readme" button in the header is a placeholder for documentation (not linked).
    

File Structure
--------------

*   server.js: Backend server with API aggregation (Open-Meteo, CoinMarketCap, NewsAPI) and Socket.io for real-time updates.
    
*   src/App.jsx: Frontend React component for the dashboard interface.
    
*   src/index.css: Custom CSS with Tailwind animations.
