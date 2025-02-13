import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Search, Loader2, X } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import type { RaceDataJson } from "@shared/schema";

interface ComparisonUser {
  username: string;
  races: RaceDataJson["races_data"];
  selectedRaces: string[];
}

interface RaceComparisonProps {
  races: RaceDataJson["races_data"];
}

const parseTimeToSeconds = (time: string | number): number => {
  if (typeof time === 'number') return time;
  
  // Handle MM:SS.mmm format
  const [minutes, seconds] = time.split(':').map(parseFloat);
  return minutes * 60 + (seconds || 0);
};

const formatSecondsToTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(3);
  return minutes > 0 
    ? `${minutes}:${remainingSeconds.padStart(6, '0')}`
    : remainingSeconds;
};

export default function RaceComparison({ races }: RaceComparisonProps) {
  const [mySelectedRaces, setMySelectedRaces] = useState<string[]>([]);
  const [compareUsername, setCompareUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonUsers, setComparisonUsers] = useState<ComparisonUser[]>([]);
  const { toast } = useToast();

  const handleMyRaceToggle = (raceId: string) => {
    setMySelectedRaces(prev =>
      prev.includes(raceId)
        ? prev.filter(id => id !== raceId)
        : [...prev, raceId]
    );
  };

  const handleComparisonRaceToggle = (username: string, raceId: string) => {
    setComparisonUsers(prev => prev.map(user => 
      user.username === username
        ? {
            ...user,
            selectedRaces: user.selectedRaces.includes(raceId)
              ? user.selectedRaces.filter(id => id !== raceId)
              : [...user.selectedRaces, raceId]
          }
        : user
    ));
  };

  const handleCompareUser = async () => {
    if (!compareUsername.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username to compare with",
        variant: "destructive"
      });
      return;
    }

    // Check if user is already added
    if (comparisonUsers.some(u => u.username === compareUsername)) {
      toast({
        title: "Error",
        description: "This user is already added for comparison",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/race-data/${encodeURIComponent(compareUsername)}`);
      if (!response.ok) throw new Error('Failed to fetch comparison data');
      
      const data: RaceDataJson = await response.json();
      setComparisonUsers(prev => [...prev, {
        username: compareUsername,
        races: data.races_data,
        selectedRaces: []
      }]);
      
      setCompareUsername("");
      toast({
        title: "Success",
        description: `Added ${compareUsername}'s races for comparison`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load comparison data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeComparisonUser = (username: string) => {
    setComparisonUsers(prev => prev.filter(u => u.username !== username));
  };

  // Update the formatRaceData function
  const formatRaceData = (race: RaceDataJson["races_data"][0], source: string, username: string) => {
    // Ensure lap numbers are properly parsed and sorted
    const formattedData = race.lap_times
      .map(([lap, time]) => ({
        lap: typeof lap === 'string' ? parseInt(lap.split(' ')[1]) : lap,
        time: parseTimeToSeconds(time),
      }))
      .sort((a, b) => a.lap - b.lap);

    const bestLap = Math.min(...formattedData.map(d => d.time));
    const worstLap = Math.max(...formattedData.map(d => d.time));
    const avgLap = formattedData.reduce((sum, d) => sum + d.time, 0) / formattedData.length;

    return {
      raceId: `${username}_${race.race_id}`,
      data: formattedData,
      source: `${source} - ${race.track}`,
      track: race.track,
      date: race.date,
      time: race.time,
      stats: { bestLap, worstLap, avgLap }
    };
  };

  // Update the data preparation section
  const allSelectedRaces = [
    ...races
      .filter(race => mySelectedRaces.includes(race.race_id))
      .map(race => formatRaceData(race, 'Your races', 'you')),
    ...comparisonUsers.flatMap(user => 
      user.races
        .filter(race => user.selectedRaces.includes(race.race_id))
        .map(race => formatRaceData(race, `${user.username}'s races`, user.username))
    )
  ];

  // Get all unique lap numbers across all races
  const allLaps = Array.from(
    new Set(
      allSelectedRaces.flatMap(race => 
        race.data.map(d => d.lap)
      )
    )
  ).sort((a, b) => a - b);

  // Create a normalized dataset where each race has data points for all laps
  const combinedData = allLaps.map(lap => {
    const dataPoint: any = { lap };
    allSelectedRaces.forEach(race => {
      const lapData = race.data.find(d => d.lap === lap);
      dataPoint[race.raceId] = lapData ? lapData.time : null;
    });
    return dataPoint;
  });

  // Find the overall min and max times for consistent Y-axis scaling
  const allTimes = allSelectedRaces.flatMap(race => 
    race.data.map(d => d.time)
  );
  const overallMinTime = Math.min(...allTimes);
  const overallMaxTime = Math.max(...allTimes);
  const yAxisDomain = [
    Math.floor(overallMinTime) - 1,
    Math.ceil(overallMaxTime) + 1
  ];

  // Use existing allLaps for min and max
  const minLap = Math.min(...allLaps);
  const maxLap = Math.max(...allLaps);

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Compare user input */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Enter username to compare with"
          value={compareUsername}
          onChange={(e) => setCompareUsername(e.target.value)}
          className="max-w-xs"
        />
        <Button 
          onClick={handleCompareUser}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Add User
        </Button>
      </div>

      {/* Your races selection */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Your Races</h3>
        <div className="flex flex-wrap gap-4">
          {races.map((race) => (
            <div
              key={race.race_id}
              className="flex items-start space-x-2 p-2 rounded-lg hover:bg-accent border border-border"
            >
              <Checkbox
                id={`my-${race.race_id}`}
                checked={mySelectedRaces.includes(race.race_id)}
                onCheckedChange={() => handleMyRaceToggle(race.race_id)}
              />
              <Label htmlFor={`my-${race.race_id}`} className="text-sm cursor-pointer">
                <div className="font-medium">{race.track}</div>
                <div className="text-muted-foreground">Position: {race.position}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {race.date} - {race.time}
                </div>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison users' races */}
      {comparisonUsers.map((user) => (
        <div key={user.username} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">{user.username}'s Races</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeComparisonUser(user.username)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            {user.races.map((race) => (
              <div
                key={race.race_id}
                className="flex items-start space-x-2 p-2 rounded-lg hover:bg-accent border border-border"
              >
                <Checkbox
                  id={`${user.username}-${race.race_id}`}
                  checked={user.selectedRaces.includes(race.race_id)}
                  onCheckedChange={() => handleComparisonRaceToggle(user.username, race.race_id)}
                />
                <Label htmlFor={`${user.username}-${race.race_id}`} className="text-sm cursor-pointer">
                  <div className="font-medium">{race.track}</div>
                  <div className="text-muted-foreground">Position: {race.position}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {race.date} - {race.time}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Update the Chart section */}
      {allSelectedRaces.length > 0 && (
        <Card className="p-8">
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Race Comparison</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {allSelectedRaces.map((race, index) => (
                <div 
                  key={race.raceId}
                  className="p-3 rounded-lg bg-muted/50"
                >
                  <div className="text-sm font-medium mb-1" style={{ color: colors[index % colors.length] }}>
                    {race.source}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                    <div>Best: {formatSecondsToTime(race.stats.bestLap)}</div>
                    <div>Avg: {formatSecondsToTime(race.stats.avgLap)}</div>
                    <div>Worst: {formatSecondsToTime(race.stats.worstLap)}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {race.date} - {race.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={700}>
            <LineChart 
              data={combinedData}
              margin={{ 
                top: 30, 
                right: 100, 
                bottom: 180,
                left: 70 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="lap"
                type="number"
                domain={[Math.min(...allLaps), Math.max(...allLaps)]}
                allowDataOverflow={false}
                label={{ 
                  value: "Lap Number", 
                  position: "bottom",
                  offset: 25
                }}
                tick={{ fontSize: 12 }}
                tickMargin={20}
              />
              <YAxis
                domain={yAxisDomain}
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
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  paddingTop: "60px",
                  width: "100%",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              />
              {allSelectedRaces.map((race, index) => (
                <Line
                  key={race.raceId}
                  type="monotone"
                  dataKey={race.raceId}
                  name={race.source}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  connectNulls={true}
                  dot={{
                    r: 2,
                    strokeWidth: 1,
                    fill: "white",
                    strokeOpacity: 0.8
                  }}
                  activeDot={{
                    r: 6,
                    stroke: colors[index % colors.length],
                    strokeWidth: 2,
                    fill: "white",
                    strokeOpacity: 1
                  }}
                  opacity={0.7}
                  onMouseEnter={(data, index) => {
                    // Optional: You could add hover effects here
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}
