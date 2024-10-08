import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from './AuthContext'

const HomePage: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to Cryptic Finds</CardTitle>
          <CardDescription>
            {user ? 'Ready to play or check the leaderboard?' : 'Sign in or create a new account to start playing'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {user ? (
            <>
              <Link to="/game">
                <Button className="w-full">Play Game</Button>
              </Link>
              <Link to="/leaderboard">
                <Button className="w-full" variant="outline">Leaderboard</Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/signin">
                <Button className="w-full">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="w-full" variant="outline">Sign Up</Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePage