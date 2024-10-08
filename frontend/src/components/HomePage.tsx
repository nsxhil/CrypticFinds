import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from './AuthContext'

const HomePage: React.FC = () => {
  const { user, signOut } = useAuth()

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to Cryptic Finds, {user.username}!</CardTitle>
          <CardDescription>
            Ready to play or check the leaderboard?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Link to="/game">
            <Button className="w-full">Play Game</Button>
          </Link>
          <Link to="/leaderboard">
            <Button className="w-full" variant="outline">Leaderboard</Button>
          </Link>
          <Button onClick={signOut} variant="ghost" className="w-full">Sign Out</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePage