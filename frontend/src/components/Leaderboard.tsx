import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LeaderboardEntry {
  username: string
  highScore: number
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '{}')
    const leaderboardData =
      Object.entries(users)
        .map(([username, data]: [string, any]) => ({
          username,
          highScore: data.highScore || 0
        }))
        .sort((a, b) => b.highScore - a.highScore)
    setLeaderboard(leaderboardData)
  }, [])

  return (
    <Card className={cn('absolute top-[30%] right-[40%] max-w-md w-full')}>
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
                <TableCell className="text-right">{entry.highScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-between">
          <Button onClick={() => navigate('/')}>Home</Button>
          <Button onClick={() => navigate('/game')}>Play Game</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Leaderboard