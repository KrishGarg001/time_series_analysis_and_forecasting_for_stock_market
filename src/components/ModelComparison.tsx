import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, Brain } from 'lucide-react';

interface ModelMetrics {
  name: string;
  accuracy: number;
  mse: number;
  mae: number;
  rmse: number;
  type: 'statistical' | 'ml' | 'deep';
  description: string;
  lastPrediction: number;
  trend: 'up' | 'down' | 'neutral';
}

interface ModelComparisonProps {
  models: ModelMetrics[];
}

export const ModelComparison = ({ models }: ModelComparisonProps) => {
  const getModelIcon = (type: string) => {
    switch (type) {
      case 'statistical': return <Activity className="h-4 w-4" />;
      case 'ml': return <TrendingUp className="h-4 w-4" />;
      case 'deep': return <Brain className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'statistical': return 'bg-chart-1 text-white';
      case 'ml': return 'bg-chart-2 text-white';
      case 'deep': return 'bg-chart-3 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-success" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-destructive" />;
      default: return <Activity className="h-3 w-3 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Performance Comparison</CardTitle>
        <CardDescription>
          Compare accuracy and metrics across different forecasting models
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {models.map((model, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(model.type)}>
                    {getModelIcon(model.type)}
                    {model.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {model.description}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(model.trend)}
                  <span className="text-sm font-mono">
                    ${model.lastPrediction.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Accuracy</span>
                    <span>{model.accuracy.toFixed(1)}%</span>
                  </div>
                  <Progress value={model.accuracy} className="h-2" />
                </div>
                
                <div className="text-xs space-y-1">
                  <div className="text-muted-foreground">MSE</div>
                  <div className="font-mono">{model.mse.toFixed(3)}</div>
                </div>
                
                <div className="text-xs space-y-1">
                  <div className="text-muted-foreground">MAE</div>
                  <div className="font-mono">{model.mae.toFixed(3)}</div>
                </div>
                
                <div className="text-xs space-y-1">
                  <div className="text-muted-foreground">RMSE</div>
                  <div className="font-mono">{model.rmse.toFixed(3)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};