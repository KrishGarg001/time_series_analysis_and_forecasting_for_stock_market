import { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: string;
}

interface StockSelectorProps {
  onStockSelect: (stock: Stock) => void;
  selectedStock?: Stock;
}

export const StockSelector = ({ onStockSelect, selectedStock }: StockSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const popularStocks: Stock[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 185.42, change: 2.34, changePercent: 1.28, marketCap: '2.9T' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 342.15, change: -1.23, changePercent: -0.36, marketCap: '2.5T' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 125.67, change: 3.45, changePercent: 2.82, marketCap: '1.6T' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 142.33, change: 1.89, changePercent: 1.35, marketCap: '1.5T' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 218.45, change: -5.67, changePercent: -2.53, marketCap: '692B' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 456.78, change: 12.34, changePercent: 2.78, marketCap: '1.1T' },
    { symbol: 'META', name: 'Meta Platforms', price: 298.34, change: 4.56, changePercent: 1.55, marketCap: '780B' },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 432.10, change: -2.15, changePercent: -0.49, marketCap: '192B' },
  ];

  const filteredStocks = popularStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Stock Selection
        </CardTitle>
        <CardDescription>
          Choose a stock for time series analysis and forecasting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stocks by symbol or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {selectedStock && (
          <div className="p-3 bg-accent rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{selectedStock.symbol}</div>
                <div className="text-sm text-muted-foreground">{selectedStock.name}</div>
              </div>
              <div className="text-right">
                <div className="font-mono">${selectedStock.price.toFixed(2)}</div>
                <div className={`text-sm ${selectedStock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} 
                  ({selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-2 max-h-[400px] overflow-y-auto">
          {filteredStocks.map((stock) => (
            <Button
              key={stock.symbol}
              variant={selectedStock?.symbol === stock.symbol ? "default" : "ghost"}
              className="h-auto p-3 justify-between"
              onClick={() => onStockSelect(stock)}
            >
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground">{stock.name}</div>
                </div>
                {stock.marketCap && (
                  <Badge variant="secondary" className="text-xs">
                    {stock.marketCap}
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <div className="font-mono text-sm">${stock.price.toFixed(2)}</div>
                <div className={`text-xs ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};