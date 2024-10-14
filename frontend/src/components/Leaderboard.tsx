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

  return (
    <Card className={cn("absolute top-[30%] right-[40%] max-w-md w-full")}>
      <CardHeader>
        <CardTitle className="text-2xl">Global Leaderboard</CardTitle>
        <CardDescription>Top scores from all players</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Rank</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="text-right">High Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry, index) => (
              <TableRow key={entry.username}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{entry.username}</TableCell>
                <TableCell className="text-right">{entry.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-between">
          <Button onClick={() => navigate("/")}>Home</Button>
          <Button onClick={() => navigate("/game")}>Play Game</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
