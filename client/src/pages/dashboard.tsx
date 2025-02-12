import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import ProfileCard from "@/components/profile-card";
import RaceDetails from "@/components/race-details";
import RaceComparison from "@/components/race-comparison";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { RaceDataJson } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<RaceDataJson | null>(null);

  useEffect(() => {
    // Get the race data from sessionStorage
    const storedData = sessionStorage.getItem('raceData');
    if (!storedData) {
      setLocation("/");
      return;
    }
    setData(JSON.parse(storedData));
  }, [setLocation]);

  if (!data) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <ProfileCard profile={data.profile_info} />

        <Tabs defaultValue="races" className="w-full">
          <TabsList>
            <TabsTrigger value="races">Individual Races</TabsTrigger>
            <TabsTrigger value="comparison">Race Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="races">
            <div className="space-y-6">
              {data.races_data.map((race) => (
                <Card key={race.race_id}>
                  <CardContent className="p-6">
                    <RaceDetails race={race} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardContent className="p-6">
                <RaceComparison races={data.races_data} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}