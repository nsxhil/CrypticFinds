import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface LeaderboardEntry {
  username: string;
  score: number;
  timeTaken: number; // time taken in milliseconds
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchuser = async () => {
      const leaderboarddata = await axios.get(`${API_URL}/api/auth/getalluser`);
      setLeaderboard(leaderboarddata.data);
    };
    fetchuser();
  }, []);
  console.log(leaderboard);

  // Function to convert milliseconds to "HH:MM:SS"
  const formatTime = (milliseconds: number) => {
    if (milliseconds === 0) {
      return "Not Completed";
    }
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    // Format time string
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className={cn("max-w-md w-full ")}>
        <CardHeader>
          <CardTitle className="text-2xl">Global Leaderboard</CardTitle>
          <CardDescription>Top scores from all players</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400/30 scrollbar-track-transparent">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-right">High Score</TableHead>
                  <TableHead className="text-right">Time Taken</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry, index) => (
                  <TableRow key={entry.username}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{entry.username}</TableCell>
                    <TableCell className="text-right">{entry.score}</TableCell>
                    <TableCell className="text-right">
                      {formatTime(entry.timeTaken)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-between">
            <Button onClick={() => navigate("/")}>Home</Button>
            <Button onClick={() => navigate("/game")}>Play Game</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
