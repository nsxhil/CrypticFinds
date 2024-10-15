import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Globe, Rocket } from "lucide-react";
import axios from "axios";
import Navbar from "./ui/Navbar";
import BranchOption from "./ui/BranchOption";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

type GameState =
  | "start"
  | "ch0"
  | "choosebranch"
  | "space"
  | "land"
  | "merge"
  | "congrats"
  | "end";

interface Question {
  _id: string;
  storyDesc: string;
  questionID: string;
  questionDesc: string;
  answer: string;
  hint: string;
}

const Chapter1: React.FC = () => {
  const { user, updateUser, updateStartTime, updateTimeTaken } = useAuth();
  console.log(user);
  const savedScore = user?.score;
  const savedQuestionIndex = user?.questionNo;
  const savedGameState = user?.currentState;

  const [gameState, setGameState] = useState<GameState>(
    savedGameState as GameState
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    parseInt(savedQuestionIndex ? savedQuestionIndex : "0", 10)
  );
  const [score, setScore] = useState(
    parseInt(savedScore ? savedScore : "0", 10)
  );
  const [answer, setAnswer] = useState("");
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [showError, setShowError] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const elapsedTimeClass =
    gameState === "space" ? "text-yellow-400" : "text-gray-100";

  const backgroundImages: { [key in GameState]: string } = {
    start: "url('/img.webp')",
    ch0: "url('/img.webp')",
    choosebranch: "url('/image.webp')",
    space: "url('/bg1.webp')",
    land: "",
    merge: "url('/merge.webp')",
    congrats: "url('/backgrounds/congrats-bg.webp')",
    end: "url('/backgrounds/end-bg.webp')",
  };

  // Fetch questions on initial load
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (user?.currentState === "ch0") {
          const response = await axios.get(`${API_URL}/api/questions/ch0`);

          setQuestions(response.data);
        } else if (user?.currentState === "space") {
          try {
            const spaceResponse = await axios.get(
              `${API_URL}/api/questions/branch1`
            );
            setQuestions(spaceResponse.data);
          } catch (error) {
            console.error("Error fetching land questions:", error);
          }
        } else if (user?.currentState === "land") {
          try {
            const landResponse = await axios.get(
              `${API_URL}/api/questions/landqs`
            );
            setQuestions(landResponse.data);
          } catch (error) {
            console.error("Error fetching land questions:", error);
          }
        } else {
          try {
            const chapterResponse = await axios.get(
              `${API_URL}/api/questions/chapterqs`
            );
            setQuestions(chapterResponse.data);
          } catch (error) {
            console.error("Error fetching chapter questions:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [user?.currentState]);

  useEffect(() => {
    // Timer for elapsed time
    const starttime = user?.startTime ? new Date(user.startTime) : null;

    const updateElapsedTime = () => {
      if (starttime) {
        const now = new Date();
        const timeDifference = now.getTime() - starttime.getTime();

        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        const formattedTime = [
          String(hours).padStart(2, "0"),
          String(minutes).padStart(2, "0"),
          String(seconds).padStart(2, "0"),
        ].join(":");

        setElapsedTime(formattedTime);
      }
    };

    const intervalId = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(intervalId);
  }, [user?.startTime]);

  useEffect(() => {
    updateUser(score.toString(), currentQuestionIndex.toString(), gameState);
  }, [score, currentQuestionIndex, gameState]);

  const currentQuestion = questions[currentQuestionIndex];
  console.log(savedScore, savedQuestionIndex, savedGameState);

  const startGame = () => {
    const currentDateTime = new Date();
    updateStartTime(currentDateTime);

    // Immediately update the timer when transitioning to 'ch0'
    const now = new Date();
    const timeDifference = now.getTime() - currentDateTime.getTime();

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    const formattedTime = [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
    ].join(":");

    setElapsedTime(formattedTime);

    if (user?.currentState === "start") setGameState("ch0");
  };

  const checkAnswer = () => {
    let temp: GameState;
    if (answer.toLowerCase() === currentQuestion?.answer.toLowerCase()) {
      setScore(score + 1);
      temp = gameState;
      setGameState("congrats");
      setShowError(false);
      setTimeout(() => {
        setGameState(temp);
        if (currentQuestionIndex + 1 < questions.length) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setAnswer("");
        } else {
          setAnswer("");
          if (gameState === "ch0") {
            setGameState("choosebranch");
          } else if (gameState === "land" || gameState === "space") {
            setCurrentQuestionIndex(0);
            setAnswer("");
            setGameState("merge");
          }
          if (gameState === "merge") {
            setGameState("end");
            const endtime = new Date();
            const starttime = user?.startTime ? new Date(user.startTime) : null;
            if (starttime) {
              const timeTakenInMilliseconds =
                endtime.getTime() - starttime.getTime();

              updateTimeTaken(timeTakenInMilliseconds);
            }
          }
        }
      }, 2000);
    } else {
      setShowError(true);
    }
  };

  const handleSelection = async (branch: GameState) => {
    setGameState(branch);

    setCurrentQuestionIndex(0); // Reset question index for the branch
  };

  const renderContent = () => {
    switch (gameState) {
      case "start":
        return (
          <Card className="max-w-2xl p-2 text-center animate-fadeIn bg-blue-500 bg-opacity-100 bg-[url('scroll.png')]">
            <CardTitle className="text-3xl">
              Chapter 1: Gates at Dwarka
            </CardTitle>
            <CardContent className="p-4">
              <p className="mb-4">
                Welcome to the first chapter of your adventure. Are you ready to
                begin?
              </p>
            </CardContent>
            <CardFooter className="flex justify-center gap-5">
              <Button className="" onClick={startGame}>
                Start Adventure
              </Button>
            </CardFooter>
          </Card>
        );
      case "ch0":
      case "space":
      case "land":
      case "merge":
        return (
          <>
            <h1
              className={`${elapsedTimeClass} text-2xl font-bold mb-4 animate-fadeIn `}
            >
              Elapsed Time: {elapsedTime}
            </h1>
            <Card
              key={currentQuestion?._id}
              className="max-w-2xl max-h-full animate-fadeIn"
            >
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
                  className={`${
                    showError ? "animate-shake border-red-500" : ""
                  }`}
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
          </>
        );
      case "choosebranch":
        return (
          <div className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              Choose Your Destiny
            </h1>
            <div className="flex flex-col md:flex-row gap-8 ">
              <BranchOption
                title="Land"
                icon={<Globe className="w-16 h-16 mb-4" />}
                description="Stay on land"
                onClick={() => handleSelection("land")}
              />
              <BranchOption
                title="Space"
                icon={<Rocket className="w-16 h-16 mb-4" />}
                description="Go to space"
                onClick={() => handleSelection("space")}
              />
            </div>
          </div>
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
              <Link to="/">
                <Button>Return Home</Button>
              </Link>
            </CardFooter>
          </Card>
        );
    }
  };

  return (
    <div
      className="min-h-screen w-screen relative flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: backgroundImages[gameState],
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 w-full flex flex-col items-center">
        <Navbar />
        {renderContent()}
      </div>
    </div>
  );
};

export default Chapter1;
