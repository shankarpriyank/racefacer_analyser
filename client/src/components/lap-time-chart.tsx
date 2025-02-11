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

  // Calculate Y-axis domain for every second
  const minTime = Math.floor(Math.min(...data.map(d => d.time)));
  const maxTime = Math.ceil(Math.max(...data.map(d => d.time)));
  const yTicks = Array.from(
    { length: maxTime - minTime + 1 },
    (_, i) => minTime + i
  );

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
            interval={0}  // Show all lap numbers
          />
          <YAxis
            domain={[minTime - 1, maxTime + 1]}
            ticks={yTicks}
            tickFormatter={(value) => formatSecondsToTime(value)}
            label={{
              value: "Lap Time",
              angle: -90,
              position: "insideLeft",
              offset: -50
            }}
            tick={{ fontSize: 12 }}
            tickMargin={10}
            allowDataOverflow={true}
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
          {/* Best Lap Reference Line */}
          <ReferenceLine
            y={bestLap}
            stroke="rgb(34, 197, 94)"  // Green-500
            strokeDasharray="3 3"
            label={{ 
              value: "Best Lap", 
              position: "right",
              fill: "rgb(34, 197, 94)",
              fontSize: 12
            }}
          />
          {/* Average Lap Reference Line */}
          <ReferenceLine
            y={avgLap}
            stroke="rgb(59, 130, 246)"  // Blue-500
            strokeDasharray="3 3"
            label={{ 
              value: "Average", 
              position: "right",
              fill: "rgb(59, 130, 246)",
              fontSize: 12
            }}
          />
          {/* Worst Lap Reference Line */}
          <ReferenceLine
            y={worstLap}
            stroke="rgb(239, 68, 68)"  // Red-500
            strokeDasharray="3 3"
            label={{ 
              value: "Worst Lap", 
              position: "right",
              fill: "rgb(239, 68, 68)",
              fontSize: 12
            }}
          />
          <Line
            type="monotone"
            dataKey="time"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{
              r: 4,
              strokeWidth: 2,
              fill: "white"
            }}
            activeDot={{
              r: 6,
              stroke: "hsl(var(--primary))",
              strokeWidth: 2,
              fill: "white"
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}