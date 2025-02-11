import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card } from "@/components/ui/card";

interface LapTimeChartProps {
  lapTimes: [string, string][];
}

export default function LapTimeChart({ lapTimes }: LapTimeChartProps) {
  const data = lapTimes.map(([lap, time]) => ({
    lap: parseInt(lap.split(" ")[1]),
    time: parseFloat(time.split(":")[1])
  }));

  return (
    <Card className="p-4">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="lap"
            label={{ value: "Lap Number", position: "bottom" }}
          />
          <YAxis
            label={{
              value: "Lap Time (seconds)",
              angle: -90,
              position: "insideLeft"
            }}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(3)}s`, "Lap Time"]}
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
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
