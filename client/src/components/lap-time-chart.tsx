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
    <Card className="p-6">
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Lap Time Analysis</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="p-2 rounded bg-green-50 dark:bg-green-900/20">
            <div className="text-green-600 dark:text-green-400">Best Lap</div>
            <div className="font-mono">{formatSecondsToTime(bestLap)}</div>
          </div>
          <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20">
            <div className="text-blue-600 dark:text-blue-400">Average</div>
            <div className="font-mono">{formatSecondsToTime(avgLap)}</div>
          </div>
          <div className="p-2 rounded bg-red-50 dark:bg-red-900/20">
            <div className="text-red-600 dark:text-red-400">Worst Lap</div>
            <div className="font-mono">{formatSecondsToTime(worstLap)}</div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="lap"
            label={{ value: "Lap Number", position: "bottom" }}
          />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={(value) => formatSecondsToTime(value)}
            label={{
              value: "Lap Time",
              angle: -90,
              position: "insideLeft"
            }}
          />
          <Tooltip
            formatter={(value: number) => [formatSecondsToTime(value), "Lap Time"]}
            labelFormatter={(label) => `Lap ${label}`}
          />
          <ReferenceLine
            y={bestLap}
            stroke="green"
            strokeDasharray="3 3"
            label={{ value: "Best Lap", position: "right" }}
          />
          <ReferenceLine
            y={avgLap}
            stroke="blue"
            strokeDasharray="3 3"
            label={{ value: "Average", position: "right" }}
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