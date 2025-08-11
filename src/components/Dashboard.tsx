import { useState, useEffect } from 'react';
import { StockChart } from './StockChart';
import { ModelComparison } from './ModelComparison';
import { StockSelector } from './StockSelector';
import { TechnicalIndicators } from './TechnicalIndicators';
import { ForecastSettings, ForecastConfig } from './ForecastSettings';
import { 
  generateStockData, 
  generateARIMAForecast, 
  generateProphetForecast, 
  generateLSTMForecast,
  calculateTechnicalIndicators,
  StockDataPoint,
  ForecastResult 
} from '@/utils/stockData';
import { useToast } from '@/hooks/use-toast';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: string;
}

export const Dashboard = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | undefined>();
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [forecastData, setForecastData] = useState<(StockDataPoint & { prediction?: number })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<any[]>([]);
  const [indicators, setIndicators] = useState<any[]>([]);
  const { toast } = useToast();

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    const historicalData = generateStockData(stock.symbol, 365, stock.price);
    setStockData(historicalData);
    
    const techIndicators = calculateTechnicalIndicators(historicalData);
    setIndicators(techIndicators);

    setForecastData(historicalData);
    setModels([]);

    toast({
      title: "Stock Data Loaded",
      description: `Loaded historical data for ${stock.symbol} (${stock.name})`,
    });
  };

  const handleRunForecast = async (config: ForecastConfig) => {
    if (!selectedStock || stockData.length === 0) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const forecastResults: { [key: string]: ForecastResult[] } = {};
      const modelMetrics: any[] = [];

      if (config.models.includes('arima')) {
        const arimaResults = generateARIMAForecast(stockData, config.forecastDays, config.confidenceInterval);
        forecastResults.arima = arimaResults;
        
        modelMetrics.push({
          name: 'ARIMA',
          accuracy: 85.4 + Math.random() * 10,
          mse: 0.045 + Math.random() * 0.02,
          mae: 0.032 + Math.random() * 0.015,
          rmse: 0.212 + Math.random() * 0.05,
          type: 'statistical',
          description: 'Auto-Regressive Integrated Moving Average',
          lastPrediction: arimaResults[arimaResults.length - 1]?.prediction || 0,
          trend: arimaResults[arimaResults.length - 1]?.prediction > stockData[stockData.length - 1].price ? 'up' : 'down'
        });
      }

      if (config.models.includes('prophet')) {
        const prophetResults = generateProphetForecast(stockData, config.forecastDays, config.confidenceInterval);
        forecastResults.prophet = prophetResults;
        
        modelMetrics.push({
          name: 'Prophet',
          accuracy: 88.2 + Math.random() * 8,
          mse: 0.038 + Math.random() * 0.02,
          mae: 0.028 + Math.random() * 0.015,
          rmse: 0.195 + Math.random() * 0.05,
          type: 'ml',
          description: 'Facebook Prophet Time Series',
          lastPrediction: prophetResults[prophetResults.length - 1]?.prediction || 0,
          trend: prophetResults[prophetResults.length - 1]?.prediction > stockData[stockData.length - 1].price ? 'up' : 'down'
        });
      }

      if (config.models.includes('lstm')) {
        const lstmResults = generateLSTMForecast(stockData, config.forecastDays, config.confidenceInterval);
        forecastResults.lstm = lstmResults;
        
        modelMetrics.push({
          name: 'LSTM',
          accuracy: 91.7 + Math.random() * 6,
          mse: 0.031 + Math.random() * 0.015,
          mae: 0.024 + Math.random() * 0.012,
          rmse: 0.176 + Math.random() * 0.04,
          type: 'deep',
          description: 'Long Short-Term Memory Neural Network',
          lastPrediction: lstmResults[lstmResults.length - 1]?.prediction || 0,
          trend: lstmResults[lstmResults.length - 1]?.prediction > stockData[stockData.length - 1].price ? 'up' : 'down'
        });
      }

      const bestModel = Object.keys(forecastResults)[0];
      if (bestModel) {
        const combinedData = [
          ...stockData,
          ...forecastResults[bestModel].map(forecast => ({
            date: forecast.date,
            price: forecast.prediction,
            prediction: forecast.prediction
          }))
        ];
        setForecastData(combinedData);
      }

      setModels(modelMetrics);

      toast({
        title: "Forecast Complete",
        description: `Generated ${config.forecastDays}-day forecast using ${config.models.length} model(s)`,
      });

    } catch (error) {
      toast({
        title: "Forecast Failed",
        description: "Unable to generate forecast. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Time Series Forecasting System
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced stock market analysis using statistical and deep learning models including ARIMA, Prophet, and LSTM
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <StockSelector 
              onStockSelect={handleStockSelect}
              selectedStock={selectedStock}
            />
            
            <ForecastSettings 
              onRunForecast={handleRunForecast}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {selectedStock && stockData.length > 0 ? (
              <>
                <StockChart
                  data={forecastData}
                  title={`${selectedStock.name} Stock Analysis`}
                  symbol={selectedStock.symbol}
                  showPrediction={models.length > 0}
                />
                
                {models.length > 0 && (
                  <ModelComparison models={models} />
                )}
                
                {indicators.length > 0 && (
                  <TechnicalIndicators indicators={indicators} />
                )}
              </>
            ) : (
              <div className="lg:col-span-2 flex items-center justify-center h-[500px] border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center space-y-2">
                  <div className="text-2xl text-muted-foreground">📊</div>
                  <h3 className="text-lg font-medium">Select a Stock to Begin</h3>
                  <p className="text-muted-foreground">
                    Choose a stock from the sidebar to start analyzing and forecasting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};