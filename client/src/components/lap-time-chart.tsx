import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { Card } from "@/components/ui/card";
import { parseTimeToSeconds, formatSecondsToTime } from "@/lib/utils";

interface LapTimeChartProps {
  lapTimes: [string, string][];
}

export default function LapTimeChart({ lapTimes }: LapTimeChartProps) {
  const data = lapTimes.map(([lap, time]) => ({
    lap: parseInt(lap.split(" ")[1]),
    time: parseTimeToSeconds(time)
  }));

  const bestLap = Math.min(...data.map(d => d.time));
  const worstLap = Math.max(...data.map(d => d.time));
  const avgLap = data.reduce((sum, d) => sum + d.time, 0) / data.length;

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">Lap Time Analysis</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="text-green-600 dark:text-green-400 mb-1">Best Lap</div>
            <div className="font-mono text-lg">{formatSecondsToTime(bestLap)}</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="text-blue-600 dark:text-blue-400 mb-1">Average</div>
            <div className="font-mono text-lg">{formatSecondsToTime(avgLap)}</div>
          </div>
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
            <div className="text-red-600 dark:text-red-400 mb-1">Worst Lap</div>
            <div className="font-mono text-lg">{formatSecondsToTime(worstLap)}</div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart 
          data={data} 
          margin={{ top: 30, right: 100, bottom: 50, left: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="lap"
            label={{ 
              value: "Lap Number", 
              position: "bottom",
              offset: 30
            }}
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis
            domain={[
              (dataMin: number) => dataMin - 0.5,
              (dataMax: number) => dataMax + 0.5
            ]}
            tickFormatter={(value) => formatSecondsToTime(value)}
            label={{
              value: "Lap Time",
              angle: -90,
              position: "insideLeft",
              offset: -50
            }}
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <Tooltip
            formatter={(value: number) => [formatSecondsToTime(value), "Lap Time"]}
            labelFormatter={(label) => `Lap ${label}`}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              padding: "8px"
            }}
          />
          <ReferenceLine
            y={bestLap}
            stroke="hsl(var(--success))"
            strokeDasharray="3 3"
            label={{ 
              value: "Best Lap", 
              position: "right",
              fill: "hsl(var(--success))",
              fontSize: 12
            }}
          />
          <ReferenceLine
            y={avgLap}
            stroke="hsl(var(--primary))"
            strokeDasharray="3 3"
            label={{ 
              value: "Average", 
              position: "right",
              fill: "hsl(var(--primary))",
              fontSize: 12
            }}
          />
          <Line
            type="monotone"
            dataKey="time"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{
              stroke: "hsl(var(--primary))",
              strokeWidth: 2,
              r: 4,
              fill: "white"
            }}
            activeDot={{
              stroke: "hsl(var(--primary))",
              strokeWidth: 2,
              r: 6,
              fill: "white"
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}