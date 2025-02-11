import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Trophy, Car } from "lucide-react";
import LapTimeChart from "./lap-time-chart";
import type { RaceDataJson } from "@shared/schema";

interface RaceDetailsProps {
  race: RaceDataJson["races_data"][0];
}

export default function RaceDetails({ race }: RaceDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{race.track}</h3>
        <Badge variant="secondary">
          <Trophy className="h-4 w-4 mr-1" />
          {race.position}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {race.date}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {race.time}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Car className="h-4 w-4" />
          {race.kart}
        </div>
        <div className="text-sm font-medium">
          Best Time: {race.best_time}
        </div>
      </div>

      <LapTimeChart lapTimes={race.lap_times} />
    </div>
  );
}
