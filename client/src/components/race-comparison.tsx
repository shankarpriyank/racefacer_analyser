import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card } from "@/components/ui/card";
import type { RaceDataJson } from "@shared/schema";

interface RaceComparisonProps {
  races: RaceDataJson["races_data"];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function RaceComparison({ races }: RaceComparisonProps) {
  const maxLaps = Math.max(...races.map(race => race.lap_times.length));
  
  const data = Array.from({ length: maxLaps }, (_, i) => {
    const lapData: Record<string, number> = {
      lap: i + 1
    };
    
    races.forEach((race, raceIndex) => {
      const lapTime = race.lap_times[i];
      if (lapTime) {
        lapData[`Race ${raceIndex + 1}`] = parseFloat(lapTime[1].split(":")[1]);
      }
    });
    
    return lapData;
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Lap Time Comparison</h3>
      
      <Card className="p-4">
        <ResponsiveContainer width="100%" height={400}>
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
            <Legend />
            {races.map((_, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={`Race ${index + 1}`}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
