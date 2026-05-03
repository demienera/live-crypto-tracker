import { useDashboardStore } from '@/store/dashboardStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatXAxis } from '@/lib/utils';

export const MiniChart = ({ symbol }: { symbol: string }) => {
  const chartData = useDashboardStore((state) => state.chartData);

  return (
    <Card className="bg-[#1a1d23] border-[#2b3139] rounded-xl shadow-sm flex flex-col h-[450px]">
      <CardHeader className="pb-2 shrink-0">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-[#7a8194]">
          {symbol.replace('USDT', '/USDT')} · Price
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-4">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#7a8194] text-sm">
            Waiting for data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2b3139"
                strokeOpacity={0.5}
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tickFormatter={formatXAxis}
                type="number"
                domain={['auto', 'auto']}
                scale="time"
                tick={{ fontSize: 11, fill: '#7a8194' }}
                axisLine={{ stroke: '#2b3139' }}
                tickLine={false}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#7a8194' }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e2128',
                  border: '1px solid #2b3139',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#e4e7ed',
                }}
                labelFormatter={(label) =>
                  new Date(label).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })
                }
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3772ff"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: '#3772ff',
                  stroke: '#1a1d23',
                  strokeWidth: 2,
                }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
