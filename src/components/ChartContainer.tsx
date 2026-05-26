import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { normalizeChartData, EvaporationPoint } from '../utils/chartDataNormalizer';

interface ChartContainerProps {
  title: string;
  data: Array<{ [key: string]: number }> | EvaporationPoint[];
  dataKey: string;
  xAxisKey?: string;
  height?: number;
  description?: string;
  yAxisLabel?: string;
}

const ChartContainerComponent: React.FC<ChartContainerProps> = ({
  title,
  data,
  dataKey,
  xAxisKey = 'timeHours',
  height = 250,
  description,
  yAxisLabel
}) => {
  // Normalize data on every render (memoized below)
  const normalizedData = useMemo(() => {
    // Check if data contains evaporation points
    if (data.length > 0 && 'timeHours' in data[0] && 'volatilityPercent' in data[0]) {
      return normalizeChartData(data as EvaporationPoint[]);
    }
    return data;
  }, [data]);

  return (
    <div className={description ? 'mb-6' : ''}>
      <h4 className="text-[#6A7180] text-xs uppercase font-mono mb-3">{title}</h4>
      {description && <p className="text-[#6A7180] text-xs mb-3">{description}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={normalizedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3139" />
          <XAxis
            dataKey={xAxisKey}
            label={{ value: `Time (${xAxisKey === 'timeHours' ? 'hours' : 'units'})`, position: 'insideBottom', offset: -5, fill: '#6A7180' }}
            stroke="#6A7180"
          />
          <YAxis
            label={{
              value: yAxisLabel || (dataKey === 'volatilityPercent' ? 'Volatility (%)' : 'Radius (feet)'),
              angle: -90,
              position: 'insideLeft',
              fill: '#6A7180'
            }}
            stroke="#6A7180"
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0A0B0E', border: '1px solid #2D3139' }}
            labelStyle={{ color: '#E0E2E6' }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#0F9"
            dot={false}
            strokeWidth={2}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Memoize with custom comparison that accounts for normalized data
export const ChartContainer = React.memo(ChartContainerComponent, (prevProps, nextProps) => {
  // If data length differs, they're different
  if (prevProps.data.length !== nextProps.data.length) return false;

  // Normalize both and compare JSON
  const prevData = prevProps.data as EvaporationPoint[];
  const nextData = nextProps.data as EvaporationPoint[];
  const prevNormalized = JSON.stringify(normalizeChartData(prevData));
  const nextNormalized = JSON.stringify(normalizeChartData(nextData));

  // Check all props
  const propsEqual =
    prevNormalized === nextNormalized &&
    prevProps.title === nextProps.title &&
    prevProps.dataKey === nextProps.dataKey &&
    prevProps.xAxisKey === nextProps.xAxisKey &&
    prevProps.height === nextProps.height &&
    prevProps.description === nextProps.description &&
    prevProps.yAxisLabel === nextProps.yAxisLabel;

  // Return true if props are equal (skip re-render), false if different (re-render)
  return propsEqual;
});

ChartContainer.displayName = 'ChartContainer';
