import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Play, RotateCcw } from 'lucide-react';

interface ForecastSettingsProps {
  onRunForecast: (settings: ForecastConfig) => void;
  isLoading: boolean;
}

export interface ForecastConfig {
  models: string[];
  forecastDays: number;
  confidenceInterval: number;
  includeSeasonality: boolean;
  includeTrend: boolean;
  timeframe: string;
}

export const ForecastSettings = ({ onRunForecast, isLoading }: ForecastSettingsProps) => {
  const [config, setConfig] = useState<ForecastConfig>({
    models: ['arima', 'prophet'],
    forecastDays: 30,
    confidenceInterval: 95,
    includeSeasonality: true,
    includeTrend: true,
    timeframe: '1y'
  });

  const models = [
    { id: 'arima', name: 'ARIMA', description: 'Statistical time series model' },
    { id: 'sarima', name: 'SARIMA', description: 'Seasonal ARIMA model' },
    { id: 'prophet', name: 'Prophet', description: 'Facebook Prophet model' },
    { id: 'lstm', name: 'LSTM', description: 'Deep learning neural network' }
  ];

  const timeframes = [
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' },
    { value: '2y', label: '2 Years' },
    { value: '5y', label: '5 Years' }
  ];

  const handleModelToggle = (modelId: string) => {
    setConfig(prev => ({
      ...prev,
      models: prev.models.includes(modelId)
        ? prev.models.filter(m => m !== modelId)
        : [...prev.models, modelId]
    }));
  };

  const resetToDefaults = () => {
    setConfig({
      models: ['arima', 'prophet'],
      forecastDays: 30,
      confidenceInterval: 95,
      includeSeasonality: true,
      includeTrend: true,
      timeframe: '1y'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Forecast Settings
        </CardTitle>
        <CardDescription>
          Configure forecasting models and parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Models to Run</Label>
          <div className="grid grid-cols-2 gap-2">
            {models.map((model) => (
              <Button
                key={model.id}
                variant={config.models.includes(model.id) ? "default" : "outline"}
                size="sm"
                onClick={() => handleModelToggle(model.id)}
                className="h-auto p-3 flex-col items-start"
              >
                <div className="font-medium text-xs">{model.name}</div>
                <div className="text-xs opacity-70">{model.description}</div>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Historical Data Period</Label>
          <Select value={config.timeframe} onValueChange={(value) => 
            setConfig(prev => ({ ...prev, timeframe: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((tf) => (
                <SelectItem key={tf.value} value={tf.value}>
                  {tf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Forecast Horizon: {config.forecastDays} days
          </Label>
          <Slider
            value={[config.forecastDays]}
            onValueChange={([value]) => setConfig(prev => ({ ...prev, forecastDays: value }))}
            max={90}
            min={7}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Confidence Interval: {config.confidenceInterval}%
          </Label>
          <Slider
            value={[config.confidenceInterval]}
            onValueChange={([value]) => setConfig(prev => ({ ...prev, confidenceInterval: value }))}
            max={99}
            min={80}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium">Advanced Options</Label>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Include Seasonality</Label>
              <div className="text-xs text-muted-foreground">
                Account for seasonal patterns in data
              </div>
            </div>
            <Switch
              checked={config.includeSeasonality}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, includeSeasonality: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Include Trend</Label>
              <div className="text-xs text-muted-foreground">
                Account for long-term trends
              </div>
            </div>
            <Switch
              checked={config.includeTrend}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, includeTrend: checked }))
              }
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={() => onRunForecast(config)}
            disabled={isLoading || config.models.length === 0}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-2" />
            {isLoading ? 'Running Forecast...' : 'Run Forecast'}
          </Button>
          <Button
            variant="outline"
            onClick={resetToDefaults}
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
