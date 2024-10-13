import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import Navbar from "./ui/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

interface Question {
  _id: string;
  storyDesc: string;
  questionID: string;
  questionDesc: string;
  answer: string;
  hint: string;
}

const Chapter1: React.FC = () => {
  const [gameState, setGameState] = useState<
    "start" | "playing" | "congrats" | "end"
  >("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showError, setShowError] = useState(false);
  const { user, updateHighScore } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/questions`);
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (gameState === "end") {
      updateHighScore(score);
    }
  }, [gameState, score, updateHighScore]);

  const currentQuestion = questions[currentQuestionIndex];

  const startGame = () => {
    setGameState("playing");
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const checkAnswer = () => {
    if (answer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
      setScore(score + 10); 
      setGameState("congrats");
      setShowError(false);
      setTimeout(() => {
        if (currentQuestionIndex + 1 < questions.length) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setAnswer("");
          setGameState("playing");
        } else {
          setGameState("end");
        }
      }, 2000);
    } else {
      setShowError(true);
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case "start":
        return (
          <Card className="max-w-2xl p-2 text-center animate-fadeIn bg-blue-500 bg-opacity-100">
            <CardTitle className="text-3xl">
              Chapter 1: Gates at Dwarka
            </CardTitle>
            <CardContent className="p-4">
              <p className="mb-4">Welcome to the first chapter of your adventure. Are you ready to begin?</p>
            </CardContent>
            <CardFooter className="flex justify-center gap-5">
              <Button onClick={startGame}>Start Adventure</Button>
            </CardFooter>
          </Card>
        );
      case "playing":
        return (
          <Card key={currentQuestion?._id} className="max-w-md animate-fadeIn">
            <CardHeader>
              <CardTitle className="text-xl">
                Question {currentQuestion?.questionID}
              </CardTitle>
              <CardDescription>{currentQuestion?.storyDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{currentQuestion?.questionDesc}</p>
              <Input
                type="text"
                placeholder="Your answer"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  if (showError) setShowError(false);
                }}
                className={`${showError ? "animate-shake border-red-500" : ""}`}
              />
              {showError && (
                <Alert className="mt-1" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Incorrect answer. Hint: {currentQuestion?.hint}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="font-semibold">Score: {score}</div>
              <Button onClick={checkAnswer}>Submit Answer</Button>
            </CardFooter>
          </Card>
        );
      case "congrats":
        return (
          <Card className="max-w-md animate-fadeIn">
            <CardHeader>
              <CardTitle className="text-2xl">Congratulations!</CardTitle>
              <CardDescription>
                Correct! Get ready for the next question...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-xl font-bold">
                Current score: {score}
              </p>
            </CardContent>
          </Card>
        );
      case "end":
        return (
          <Card className="max-w-md animate-fadeIn">
            <CardHeader>
              <CardTitle className="text-2xl">Congratulations!</CardTitle>
              <CardDescription>You've completed Cryptic Finds</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-xl font-bold">
                Your final score: {score}
              </p>
              <p className="text-center mt-4">Thank you for playing!</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => setGameState("start")}>Play Again</Button>
            </CardFooter>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen w-screen relative bg-gradient-to-t from-black to-[#000021] flex flex-col items-center justify-center p-4">
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src="img.webp"
        alt="Background"
      />
      <div className="relative z-10 w-full flex flex-col items-center">
        <Navbar />
        {renderContent()}
        {gameState === "playing" && questions.length > 0 && (
          <div className="mt-4 w-full max-w-md">
            <Progress
              value={((currentQuestionIndex + 1) / questions.length) * 100}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chapter1;
