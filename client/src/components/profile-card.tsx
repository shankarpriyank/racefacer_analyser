import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, MapPin, Clock, Route } from "lucide-react";
import type { RaceDataJson } from "@shared/schema";

interface ProfileCardProps {
  profile: RaceDataJson["profile_info"];
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const stats = [
    {
      label: "Total Distance",
      value: profile.Statistics["Total Distance"],
      icon: Route,
    },
    {
      label: "Drive Hours",
      value: profile.Statistics["Total Drive Hours"],
      icon: Clock,
    },
    {
      label: "Total Races",
      value: profile["Total Races"].toString(),
      icon: Trophy,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          {profile["Driver Name"]}
          <div className="text-sm font-normal text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {profile.Location}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
            >
              <Icon className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
