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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { parseTimeToSeconds, formatSecondsToTime } from "@/lib/utils";
import { useState } from "react";
import type { RaceDataJson } from "@shared/schema";

interface RaceComparisonProps {
  races: RaceDataJson["races_data"];
}

export default function RaceComparison({ races }: RaceComparisonProps) {
  const [selectedRaces, setSelectedRaces] = useState<string[]>([]);

  const handleRaceToggle = (raceId: string) => {
    setSelectedRaces(prev =>
      prev.includes(raceId)
        ? prev.filter(id => id !== raceId)
        : [...prev, raceId]
    );
  };

  const filteredRaces = races.filter(race => selectedRaces.includes(race.race_id));
  const maxLaps = Math.max(...filteredRaces.map(race => race.lap_times.length), 1);

  const data = Array.from({ length: maxLaps }, (_, i) => {
    const lapData: Record<string, any> = {
      lap: i + 1
    };

    filteredRaces.forEach(race => {
      const lapTime = race.lap_times[i];
      if (lapTime) {
        lapData[race.race_id] = parseTimeToSeconds(lapTime[1]);
      }
    });

    return lapData;
  });

  const formatDate = (dateStr: string, timeStr: string) => {
    const [day, month, year] = dateStr.split('.');
    return `${day}/${month}/${year} - ${timeStr}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {races.map((race) => (
          <div
            key={race.race_id}
            className="flex items-start space-x-2 p-2 rounded-lg hover:bg-accent"
          >
            <Checkbox
              id={race.race_id}
              checked={selectedRaces.includes(race.race_id)}
              onCheckedChange={() => handleRaceToggle(race.race_id)}
            />
            <Label htmlFor={race.race_id} className="text-sm cursor-pointer">
              <div className="font-medium">{formatDate(race.date, race.time)}</div>
              <div className="text-muted-foreground">Position: {race.position}</div>
            </Label>
          </div>
        ))}
      </div>

      {selectedRaces.length > 0 ? (
        <Card className="p-8">
          <ResponsiveContainer width="100%" height={500}>
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
                domain={['auto', 'auto']}
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
              <Legend
                formatter={(value) => {
                  const race = races.find(r => r.race_id === value);
                  return race ? formatDate(race.date, race.time) : value;
                }}
                wrapperStyle={{
                  paddingTop: "20px"
                }}
              />
              {filteredRaces.map((race, index) => (
                <Line
                  key={race.race_id}
                  type="monotone"
                  dataKey={race.race_id}
                  name={race.race_id}
                  stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    fill: "white"
                  }}
                  activeDot={{
                    r: 6,
                    stroke: `hsl(var(--chart-${(index % 5) + 1}))`,
                    strokeWidth: 2,
                    fill: "white"
                  }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      ) : (
        <Card className="p-6 text-center text-muted-foreground">
          Select races to compare their lap times
        </Card>
      )}
    </div>
  );
}