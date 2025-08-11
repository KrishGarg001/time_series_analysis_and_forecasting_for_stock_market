import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

interface IndicatorData {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'hold';
  strength: number; // 0-100
  description: string;
}

interface TechnicalIndicatorsProps {
  indicators: IndicatorData[];
}

export const TechnicalIndicators = ({ indicators }: TechnicalIndicatorsProps) => {
  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'buy': return <TrendingUp className="h-3 w-3" />;
      case 'sell': return <TrendingDown className="h-3 w-3" />;
      default: return <Minus className="h-3 w-3" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy': return 'bg-success text-success-foreground';
      case 'sell': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 70) return 'bg-success';
    if (strength >= 40) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Technical Indicators
        </CardTitle>
        <CardDescription>
          Key technical analysis indicators and trading signals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {indicators.map((indicator, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">{indicator.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {indicator.description}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-mono text-sm">{indicator.value.toFixed(2)}</div>
                  <Badge className={getSignalColor(indicator.signal)}>
                    {getSignalIcon(indicator.signal)}
                    {indicator.signal.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Signal Strength</span>
                  <span>{indicator.strength}%</span>
                </div>
                <Progress 
                  value={indicator.strength} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};