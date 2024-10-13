import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Link } from 'react-router-dom'
// import Leaderboard from './Leaderboard'

interface Question {
  id: number
  text: string
  answer: string
  points: number
  story: string
}

const questions: Question[] = [
  {
    id: 1,
    text: "What has keys, but no locks; space, but no room; you can enter, but not go in?",
    answer: "keyboard",
    points: 10,
    story: "You find yourself in a dimly lit room. On a desk, you see an old computer..."
  },
  {
    id: 2,
    text: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
    answer: "fire",
    points: 15,
    story: "As you solve the first riddle, a secret compartment opens, revealing a matchbox..."
  },
  {
    id: 3,
    text: "The more you take, the more you leave behind. What am I?",
    answer: "footsteps",
    points: 20,
    story: "With the light from the fire, you notice strange markings on the floor..."
  },
]

const CrypticFinds: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answer, setAnswer] = useState('')
  const [showError, setShowError] = useState(false)
  const { user, updateHighScore, signOut } = useAuth()

  useEffect(() => {
    if (gameState === 'end') {
      updateHighScore(score)
    }
  }, [gameState, score, updateHighScore])

  const currentQuestion = questions[currentQuestionIndex]

  const startGame = () => {
    setGameState('playing')
    setCurrentQuestionIndex(0)
    setScore(0)
  }

  const checkAnswer = () => {
    if (answer.toLowerCase() === currentQuestion.answer) {
      setScore(score + currentQuestion.points)
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setAnswer('')
        setShowError(false)
      } else {
        setGameState('end')
      }
    } else {
      setShowError(true)
    }
  }

  const renderContent = () => {
    switch (gameState) {
      case 'start':
        return (
          <Card className="max-w-md bg-blue-500 text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to Cryptic Finds</CardTitle>
              <CardDescription className='text-black'> Solve riddles, uncover the story, earn points!</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center">Are you ready to embark on a mysterious journey, {user?.username}?</p>
            </CardContent>
            <CardFooter className="flex justify-center gap-5">
              <Button onClick={startGame}>Start Adventure</Button>
              <Link to='/leaderboard'>
              <Button >Leaderboard</Button>
              </Link>
            </CardFooter>
          </Card>
        )
      case 'playing':
        return (
          <Card className=" max-w-md">
            <CardHeader>
              <CardTitle className="text-xl">Question {currentQuestion.id}</CardTitle>
              <CardDescription>{currentQuestion.story}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">{currentQuestion.text}</p>
              <Input
                type="text"
                placeholder="Your answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              {showError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Incorrect answer. Try again!
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="font-semibold">Score: {score}</div>
              <Button onClick={checkAnswer}>Submit Answer</Button>
            </CardFooter>
          </Card>
        )
      case 'end':
        return (
          <Card className=" max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">Congratulations!</CardTitle>
              <CardDescription>You've completed Cryptic Finds</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-xl font-bold">Your final score: {score}</p>
              <p className="text-center mt-4">Thank you for playing!</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => setGameState('start')}>Play Again</Button>
            </CardFooter>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-t from-black  to-[#000021] flex flex-col items-center justify-center p-4">
  
      {renderContent()}
      {gameState === 'playing' && (
        <div className="mt-4 w-full max-w-md">
          <Progress value={(currentQuestionIndex / questions.length) * 100} className="w-full" />
        </div>
      )}
    </div>
  )
}

export default CrypticFinds