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
import { Link } from "react-router-dom";
import TypeWriter from "./ui/TypeWriter";
import TypeWriterNormal from "./ui/TypeWriternormal";
import TypeWriterBottom from "./ui/TypeWriterBottom";
import axios from "axios";
import Navbar from "./ui/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

interface Question {
  id: number;
  text: string;
  answer: string;
  points: number;
  story: string;
}

const Questions: Question[] = [
  {
    id: 1,
    text: "What has keys, but no locks; space, but no room; you can enter, but not go in?",
    answer: "keyboard",
    points: 10,
    story:
      "You find yourself in a dimly lit room. On a desk, you see an old computer...",
  },
  {
    id: 2,
    text: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
    answer: "fire",
    points: 15,
    story:
      "As you solve the first riddle, a secret compartment opens, revealing a matchbox...",
  },
  {
    id: 3,
    text: "The more you take, the more you leave behind. What am I?",
    answer: "footsteps",
    points: 20,
    story:
      "With the light from the fire, you notice strange markings on the floor...",
  },
];

const Chapter1: React.FC = () => {
  const [gameState, setGameState] = useState<
    "start" | "playing" | "congrats" | "end"
  >("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showError, setShowError] = useState(false);
  const { user, updateHighScore } = useAuth();
  const [questions, setQuestions] = useState();

  const currentQuestion = Questions[currentQuestionIndex];

  useEffect(() => {
    if (gameState === "end") {
      updateHighScore(score);
    }
  }, [gameState, score, updateHighScore]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionResponse = await axios.get(`${API_URL}/questions`);
        const questionData = await questionResponse;
        setQuestions(questionData.data);
      } catch (err) {
        console.log("internal Error Occured", err);
      }
    };
    fetchData();
  }, []);

  const startGame = () => {
    setGameState("playing");
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const checkAnswer = () => {
    if (answer.toLowerCase() === currentQuestion.answer) {
      setScore(score + currentQuestion.points);
      setGameState("congrats");
      setShowError(false);
      setTimeout(() => {
        if (currentQuestionIndex + 1 < Questions.length) {
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
          <Card
            className="max-w-2xl p-2 text-center animate-fadeIn bg-blue-500 bg-opacity-100"
            backgroundImage="scroll.png"
          >
            <CardTitle className="text-3xl">
              Chapter 1: Gates at Dwarka
            </CardTitle>
            <CardContent className="p-4">
              It’s the year 4114, most countries have collapsed, leaving only a
              few cities struggling to survive with limited resources. Standing
              at the gates of Dwarka, you feel a mix of hope and fear, having
              come here as the last member of your tribe, which has vanished due
              to scarcity and hardship. Once part of a vibrant community, you
              now carry their memories and stories as you seek refuge in this
              city, uncertain if it can provide the safety and sustenance you
              desperately need in this changed world. As you stand before the
              towering gates of Dwarka, worn and tired from your journey, you
              take in the imposing structure before you. The gates loom high,
              their ancient metal surface etched with intricate designs that
              speak of a long and storied history. The air around you is thick
              with anticipation and the faint scent of rust and oil. Suddenly, a
              metallic voice crackles to life from an unseen intercom, startling
              you from your reverie. The voice, though artificial, carries a
              calm yet authoritative tone that demands attention. It echoes off
              the surrounding walls, creating an eerie atmosphere that sends a
              shiver down your spine. The voice addresses you directly, its
              words crisp and clear despite the static. It informs you of a
              challenge that stands between you and entry into the city. The
              concept of a secret code intrigues you, adding an air of mystery
              to your already uncertain situation. You find yourself wondering
              about the nature of this code and what it might reveal about the
              society that lies beyond these formidable gates.
            </CardContent>
            <CardFooter className="flex justify-center gap-5">
              <Button onClick={startGame}>Start Adventure</Button>
            </CardFooter>
          </Card>
        );
      case "playing":
        return (
          <Card key={currentQuestion.id} className="max-w-md animate-fadeIn">
            <CardHeader>
              <CardTitle className="text-xl">
                Question {currentQuestion.id}
              </CardTitle>
              <CardDescription>{currentQuestion.story}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{currentQuestion.text}</p>
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
        {gameState === "playing" && (
          <div className="mt-4 w-full max-w-md">
            <Progress
              value={(currentQuestionIndex / Questions.length) * 100}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chapter1;
