import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StockDataPoint {
  date: string;
  price: number;
  prediction?: number;
  volume?: number;
}

interface StockChartProps {
  data: StockDataPoint[];
  title: string;
  symbol: string;
  showPrediction?: boolean;
}

export const StockChart = ({ data, title, symbol, showPrediction = false }: StockChartProps) => {
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-mono text-muted-foreground">{symbol}</span>
        </CardTitle>
        <CardDescription>
          Historical price data and forecasting analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                className="text-xs"
              />
              <YAxis 
                tickFormatter={formatCurrency}
                className="text-xs"
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip 
                labelFormatter={formatDate}
                formatter={(value: number, name: string) => [
                  formatCurrency(value), 
                  name === 'price' ? 'Actual Price' : 'Predicted Price'
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#priceGradient)"
                strokeWidth={2}
              />
              {showPrediction && (
                <Area
                  type="monotone"
                  dataKey="prediction"
                  stroke="hsl(var(--chart-2))"
                  strokeDasharray="5 5"
                  fillOpacity={1}
                  fill="url(#predictionGradient)"
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};