import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { BinaryRaceAnimation } from "./RaceAnimation";

export default function Upload() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const raceDataUrl = `http://localhost:8000/race-data/${encodeURIComponent(username)}`;
      const response = await fetch(raceDataUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch race data: ${response.statusText}`);
      }

      const raceData = await response.json();
      // Store the race data in sessionStorage for the dashboard
      sessionStorage.setItem('raceData', JSON.stringify(raceData));
      setLocation("/dashboard");
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch race data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {isLoading ? (
        <BinaryRaceAnimation />
      ) : (
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Race Data Analyzer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter your username (e.g., priyank.shankar)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full relative" 
                disabled={isLoading}
              >
                Load Race Data
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}