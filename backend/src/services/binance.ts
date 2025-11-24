import { MarketData, BinanceTickerResponse } from '../types/market';

const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/24hr';

// Cache for market data - persists for 30 minutes since server start
let cachedMarketData: MarketData[] | null = null;
let serverStartTime = Date.now();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  maxRetries: number = 3,
  retryDelay: number = 2000
): Promise<Response> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url);

    if (response.status === 429) {
      // Rate limited - exponential backoff
      const backoffTime = retryDelay * Math.pow(2, attempt);
      console.warn(`Rate limited (429). Retrying in ${backoffTime}ms... (attempt ${attempt + 1}/${maxRetries})`);
      await sleep(backoffTime);
      continue;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  throw new Error(`Failed after ${maxRetries} retries due to rate limiting`);
}

export async function fetchMarketData(): Promise<MarketData[]> {
  // Check if we have cached data and if it's still valid (within 30 minutes of server start)
  const timeSinceServerStart = Date.now() - serverStartTime;
  if (cachedMarketData && timeSinceServerStart < CACHE_DURATION) {
    console.log('Using cached market data (within 30 minute window)');
    return cachedMarketData;
  }

  try {
    const response = await fetchWithRetry(BINANCE_API_URL);
    const data = await response.json() as BinanceTickerResponse[];
    
    const coinCount = data.length;
    console.log(`Binance API returned ${coinCount} coins`);
    
    // Filter USDT pairs, sort by quoteVolume (descending), and take top 20
    const usdtPairs = data.filter((ticker) => ticker.symbol.endsWith('USDT'));
    
    // Sort by quoteVolume (descending) and take top 20
    const top20ByVolume = usdtPairs
      .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
      .slice(0, 20);
    
    console.log(`Top 20 coins by volume selected`);
    
    // Map to MarketData format
    const marketDataResults: MarketData[] = top20ByVolume.map((ticker) => {
      // Extract base symbol (e.g., "BTCUSDT" -> "BTC")
      const baseSymbol = ticker.symbol.replace('USDT', '');
      
      return {
        symbol: baseSymbol,
        price: parseFloat(ticker.lastPrice).toFixed(2),
        changePercent: parseFloat(ticker.priceChangePercent),
      };
    });

    // Update cache on successful fetch
    if (marketDataResults.length > 0) {
      cachedMarketData = marketDataResults;
      console.log('Market data cached successfully');
    }

    return marketDataResults.length > 0 ? marketDataResults : [];
  } catch (error) {
    console.error('Error fetching market data:', error);
    
    // Return cached data if available (even if expired, better than nothing)
    if (cachedMarketData) {
      console.log('Using cached market data due to API error');
      return cachedMarketData;
    }
    
    throw error;
  }
}

