import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

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
      const response = await fetch(`http://localhost:8000/race-data/${username}`);
      if (!response.ok) throw new Error('Failed to fetch race data');
      
      const jsonData = await response.json();
      await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData)
      });

      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch race data. Please check the username and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
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
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              ) : (
                "Load Race Data"
              )}
            </Button>
          </form>

          {isLoading && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-center">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary rounded-full animate-spin-slow border-t-transparent"></div>
                  <div className="absolute inset-2 border-4 border-primary/40 rounded-full animate-spin border-t-transparent animate-reverse"></div>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground animate-pulse">
                Fetching your race data...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}