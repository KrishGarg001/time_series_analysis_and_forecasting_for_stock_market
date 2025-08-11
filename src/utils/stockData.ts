// Utility functions for generating mock stock data and forecasting

export interface StockDataPoint {
  date: string;
  price: number;
  volume?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

export interface ForecastResult {
  date: string;
  price: number;
  prediction: number;
  lower: number;
  upper: number;
  confidence: number;
}

// Generate realistic stock price data with trends and volatility
export const generateStockData = (
  symbol: string, 
  days: number = 365, 
  basePrice: number = 100
): StockDataPoint[] => {
  const data: StockDataPoint[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  let currentPrice = basePrice;
  const trend = (Math.random() - 0.5) * 0.001; // Small daily trend
  const volatility = 0.02; // 2% daily volatility
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Add some seasonality (simplified)
    const seasonality = Math.sin((i / 365) * 2 * Math.PI) * 0.1;
    
    // Random walk with trend and seasonality
    const dailyReturn = trend + seasonality + (Math.random() - 0.5) * volatility;
    currentPrice *= (1 + dailyReturn);
    
    // Add some noise to make it more realistic
    const noise = (Math.random() - 0.5) * 0.005;
    const price = currentPrice * (1 + noise);
    
    // Generate OHLC data
    const open = price * (1 + (Math.random() - 0.5) * 0.01);
    const close = price;
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    const volume = Math.floor(Math.random() * 1000000) + 100000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: close,
      open,
      high,
      low,
      close,
      volume
    });
  }
  
  return data;
};

// Mock ARIMA forecasting
export const generateARIMAForecast = (
  historicalData: StockDataPoint[], 
  forecastDays: number,
  confidence: number = 95
): ForecastResult[] => {
  const lastPrice = historicalData[historicalData.length - 1].price;
  const predictions: ForecastResult[] = [];
  
  let currentPrice = lastPrice;
  const drift = 0.0005; // Small upward drift
  const volatility = 0.015;
  
  for (let i = 1; i <= forecastDays; i++) {
    const date = new Date(historicalData[historicalData.length - 1].date);
    date.setDate(date.getDate() + i);
    
    // ARIMA-like prediction with mean reversion
    const meanReversion = (lastPrice - currentPrice) * 0.1;
    const randomWalk = (Math.random() - 0.5) * volatility;
    
    currentPrice *= (1 + drift + meanReversion + randomWalk);
    
    const confidenceRange = currentPrice * (volatility * Math.sqrt(i)) * (confidence / 100);
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      price: historicalData[historicalData.length - 1].price, // Keep historical price
      prediction: currentPrice,
      lower: currentPrice - confidenceRange,
      upper: currentPrice + confidenceRange,
      confidence
    });
  }
  
  return predictions;
};

// Mock Prophet forecasting (with seasonality)
export const generateProphetForecast = (
  historicalData: StockDataPoint[], 
  forecastDays: number,
  confidence: number = 95
): ForecastResult[] => {
  const lastPrice = historicalData[historicalData.length - 1].price;
  const predictions: ForecastResult[] = [];
  
  let currentPrice = lastPrice;
  const trend = 0.0008; // Slightly higher trend than ARIMA
  const volatility = 0.012;
  
  for (let i = 1; i <= forecastDays; i++) {
    const date = new Date(historicalData[historicalData.length - 1].date);
    date.setDate(date.getDate() + i);
    
    // Add seasonality component
    const seasonality = Math.sin((i / 365) * 2 * Math.PI) * 0.005;
    const weeklyPattern = Math.sin((i / 7) * 2 * Math.PI) * 0.002;
    
    const dailyChange = trend + seasonality + weeklyPattern + (Math.random() - 0.5) * volatility;
    currentPrice *= (1 + dailyChange);
    
    const confidenceRange = currentPrice * (volatility * Math.sqrt(i)) * (confidence / 100);
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      price: historicalData[historicalData.length - 1].price,
      prediction: currentPrice,
      lower: currentPrice - confidenceRange,
      upper: currentPrice + confidenceRange,
      confidence
    });
  }
  
  return predictions;
};

// Mock LSTM forecasting
export const generateLSTMForecast = (
  historicalData: StockDataPoint[], 
  forecastDays: number,
  confidence: number = 95
): ForecastResult[] => {
  const lastPrice = historicalData[historicalData.length - 1].price;
  const predictions: ForecastResult[] = [];
  
  // LSTM would use recent patterns - simulate this with moving averages
  const recentPrices = historicalData.slice(-10).map(d => d.price);
  const recentTrend = (recentPrices[recentPrices.length - 1] - recentPrices[0]) / recentPrices.length;
  
  let currentPrice = lastPrice;
  const volatility = 0.018; // LSTM might have higher uncertainty
  
  for (let i = 1; i <= forecastDays; i++) {
    const date = new Date(historicalData[historicalData.length - 1].date);
    date.setDate(date.getDate() + i);
    
    // Simulate LSTM learning recent patterns
    const patternInfluence = recentTrend * 0.5;
    const randomComponent = (Math.random() - 0.5) * volatility;
    
    currentPrice *= (1 + patternInfluence + randomComponent);
    
    const confidenceRange = currentPrice * (volatility * Math.sqrt(i)) * (confidence / 100);
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      price: historicalData[historicalData.length - 1].price,
      prediction: currentPrice,
      lower: currentPrice - confidenceRange,
      upper: currentPrice + confidenceRange,
      confidence
    });
  }
  
  return predictions;
};

// Calculate technical indicators
export const calculateTechnicalIndicators = (data: StockDataPoint[]) => {
  const prices = data.map(d => d.price);
  const latest = prices[prices.length - 1];
  
  // Simple Moving Averages
  const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const sma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / 50;
  
  // RSI calculation (simplified)
  const gains = [];
  const losses = [];
  for (let i = 1; i < Math.min(15, prices.length); i++) {
    const change = prices[prices.length - i] - prices[prices.length - i - 1];
    if (change > 0) gains.push(change);
    else losses.push(Math.abs(change));
  }
  const avgGain = gains.reduce((a, b) => a + b, 0) / gains.length || 0;
  const avgLoss = losses.reduce((a, b) => a + b, 0) / losses.length || 0;
  const rs = avgGain / (avgLoss || 1);
  const rsi = 100 - (100 / (1 + rs));
  
  return [
    {
      name: 'SMA 20',
      value: sma20,
      signal: latest > sma20 ? 'buy' : 'sell' as const,
      strength: Math.min(100, Math.abs((latest - sma20) / sma20) * 1000),
      description: '20-day Simple Moving Average'
    },
    {
      name: 'SMA 50',
      value: sma50,
      signal: latest > sma50 ? 'buy' : 'sell' as const,
      strength: Math.min(100, Math.abs((latest - sma50) / sma50) * 1000),
      description: '50-day Simple Moving Average'
    },
    {
      name: 'RSI',
      value: rsi,
      signal: rsi > 70 ? 'sell' : rsi < 30 ? 'buy' : 'hold' as const,
      strength: rsi > 70 ? (rsi - 70) * 3.33 : rsi < 30 ? (30 - rsi) * 3.33 : 50,
      description: 'Relative Strength Index'
    },
    {
      name: 'MACD Signal',
      value: latest - sma20,
      signal: sma20 > sma50 ? 'buy' : 'sell' as const,
      strength: Math.min(100, Math.abs((sma20 - sma50) / sma50) * 1000),
      description: 'Moving Average Convergence Divergence'
    }
  ];
};