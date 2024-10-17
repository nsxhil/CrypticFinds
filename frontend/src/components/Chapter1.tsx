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
  | "merging"
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
const currentD = new Date();

const Chapter1: React.FC = () => {
  const { user, updateUser, updateStartTime, updateTimeTaken } = useAuth();
  const [answer, setAnswer] = useState<string>("");
  const [Buttonvalue, setButtonvalue] = useState<string>("Submit Answer");
  const [elapsedTime, setElapsedTime] = useState<string>("Loading...");
  const [showError, setShowError] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [hint, setHint] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false); // Track the update process

  const backgroundImages: { [key in GameState]: string } = {
    start: "url('/img.webp')",
    ch0: "url('/img.webp')",
    choosebranch: "url('/redditwallpaper.jpg')",
    space: "url('/bg1.webp')",
    land: "url('/bg5.webp')",
    merge: "url('/bg_final.webp')",
    merging: "url('/merging.webp')",
    congrats: "url('/backgrounds/congrats-bg.webp')",
    end: "url('/backgrounds/end-bg.webp')",
  };
  type BackgroundState = keyof typeof backgroundImages;
  const elapsedTimeClass =
    user?.currentState === "space"
      ? "text-yellow-400 bg-black rounded p-2"
      : "text-gray-100";

  // Fetch questions on initial load
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const currentState = user?.currentState || "start"; // Default to "start" if undefined
        if (currentState === "ch0") {
          const response = await axios.get(`${API_URL}/api/questions/ch0`);
          setQuestions(response.data);
        } else if (currentState === "space") {
          const spaceResponse = await axios.get(
            `${API_URL}/api/questions/branch1`
          );
          setQuestions(spaceResponse.data);
        } else if (currentState === "land") {
          const landResponse = await axios.get(
            `${API_URL}/api/questions/landqs`
          );
          setQuestions(landResponse.data);
        } else if (currentState === "merging") {
          setAnswer("");
          const timer = setTimeout(() => {
            updateUser(
              `${user?.score || "0"}`,
              `${user?.questionNo || "0"}`,
              "merge",
              user?.startTime || currentD
            );
          }, 4000);
          return () => clearTimeout(timer);
        } else if (currentState === "merge") {
          const chapterResponse = await axios.get(
            `${API_URL}/api/questions/chapterqs`
          );
          setQuestions(chapterResponse.data);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [user?.currentState]);

  const currentQuestion =
    questions[parseInt(user?.questionNo ? user.questionNo : "0")];

  useEffect(() => {
    // Timer for elapsed time
    const starttime = user?.startTime ? new Date(user.startTime) : new Date();

    const updateElapsedTime = () => {
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
    };

    const intervalId = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(intervalId);
  }, [user?.startTime]);

  // console.log(user);
  const startGame = () => {
    const currentDateTime = new Date();
    const accessStartTime = new Date("2024-10-18T00:00:00");
    const accessEndTime = new Date("2024-10-18T23:59:59");

    if (
      currentDateTime >= accessStartTime &&
      currentDateTime <= accessEndTime
    ) {
      updateStartTime(currentDateTime);
      const formattedTime = "00:00:00";
      setElapsedTime(formattedTime);

      if (user?.currentState === "start") {
        updateUser(
          `${user.score || "0"}`,
          `${user.questionNo || "0"}`,
          "ch0",
          user?.startTime || currentDateTime
        );
      }
    } else {
      alert(
        "The game is only accessible between October from 18th October from 00:00 to 23:59"
      );
    }
  };

  const checkAnswer = async () => {
    setButtonvalue("Checking...");

    try {
      const response = await axios.post(`${API_URL}/api/questions/checkans`, {
        questionId: questions[Number(user?.questionNo) || 0]?.questionID,
        userAnswer: answer,
        gameState: user?.currentState,
      });

      setButtonvalue("Submit Answer");
      if (response.data.correct) {
        const newScore = (parseInt(user?.score || "0") + 1).toString();
        const nextQuestionIndex = (
          parseInt(user?.questionNo || "0") + 1
        ).toString();

        setShowError(false);
        setIsUpdating(true);
        setTimeout(() => {
          if (parseInt(nextQuestionIndex) < questions.length) {
            updateUser(
              newScore,
              nextQuestionIndex,
              user?.currentState || "start",
              user?.startTime || currentD
            );
            setAnswer("");
          } else {
            if (user?.currentState === "ch0") {
              setAnswer("");
              updateUser(
                newScore,
                "0",
                "choosebranch",
                user?.startTime || currentD
              );
            } else if (
              user?.currentState === "land" ||
              user?.currentState === "space"
            ) {
              updateUser(newScore, "0", "merging", user?.startTime || currentD);
            } else if (user?.currentState === "merge") {
              updateUser(newScore, "0", "end", user?.startTime || currentD);
              const endtime = new Date();
              const starttime = new Date(user?.startTime ? user.startTime : 0);
              const timeTakenInMilliseconds =
                endtime.getTime() - starttime.getTime();
              updateTimeTaken(timeTakenInMilliseconds);
            }
          }
          setIsUpdating(false); // Reset the update state after updating
        }, 2000);
      } else {
        setShowError(true);
        setHint(response.data.hint);
      }
    } catch (error) {
      console.error("Error checking answer:", error);
      setShowError(true);
    }
  };

  const handleSelection = (branch: GameState) => {
    updateUser(
      `${user?.score || "0"}`,
      "0",
      branch,
      user?.startTime || currentD
    );
  };

  const renderContent = () => {
    // Show "Congrats" screen when updating
    if (isUpdating) {
      return (
        <div className="flex flex-col justify-center items-center">
          <Card className="max-w-md animate-fadeIn ">
            <CardHeader>
              <CardTitle className="text-2xl">Congratulations!</CardTitle>
              <CardDescription>
                Correct! Get ready for the next question...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-xl font-bold">
                Current score: {parseInt(user?.score ? user.score : "0") + 1}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    switch (user?.currentState) {
      case "start":
        return (
          <div className="flex justify-center items-center">
            <Card className="max-w-2xl p-2 text-center animate-fadeIn bg-blue-500 bg-opacity-100 bg-[url('/scroll.png')]">
              <CardTitle className="text-3xl">
                Chapter 1: Gates at Dwarka
              </CardTitle>
              <CardContent className="p-4">
                <p className="mb-4">
                  Welcome to the first chapter of your adventure. Are you ready
                  to begin?
                </p>
              </CardContent>
              <CardFooter className="flex justify-center gap-5">
                <Button className="" onClick={startGame}>
                  Start Adventure
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
      case "ch0":
      case "space":
      case "land":
      case "merge":
        return currentQuestion ? (
          <div className="flex flex-col justify-center items-center">
            <h1
              className={`${elapsedTimeClass} text-2xl text-black font-bold mb-4 animate-fadeIn `}
            >
              Elapsed Time: {elapsedTime}
            </h1>
            <Card
              key={currentQuestion?._id}
              className="max-w-2xl  animate-fadeIn overflow-y-auto max-h-[700px] scrollbar-thin scrollbar-thumb-gray-400/30 scrollbar-track-transparent"
            >
              <CardHeader>
                <CardTitle className="text-xl">
                  Question {currentQuestion?.questionID}
                </CardTitle>
                <CardDescription>{currentQuestion?.storyDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-medium break-words ">
                  {currentQuestion?.questionDesc}
                </p>

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
                {currentQuestion?.questionID === "5" &&
                  user.currentState === "ch0" && (
                    <div className="text-white">32A53R44J32F</div>
                  )}
                {showError && (
                  <Alert className="mt-1" variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Incorrect answer. Hint: {hint}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="font-semibold">Score: {user.score}</div>
                <Button onClick={checkAnswer}>{Buttonvalue}</Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="flex justify-center">
            <p className="text-white font-bold">Loading questions...</p>
          </div>
        );
      case "choosebranch":
        return (
          <div className="flex justify-center items-center">
            <Card className="max-w-2xl p-2 text-center animate-fadeIn bg-blue-500 bg-opacity-100 bg-[url('/scifi.png')] bg-cover bg-center">
              <CardTitle className="text-2xl text-white">
                Choose your destiny.
              </CardTitle>
              <CardContent className="p-4  text-white">
                <p className="mb-4">
                  As you stand at the crossroads of destiny, two paths unfold
                  before you, each leading to a journey unlike any other. To
                  your left, the cosmos beckons. The vastness of space stretches
                  out, shimmering with stars and the unknown. Here, you'll soar
                  through galaxies, navigate asteroid fields, and perhaps even
                  encounter alien civilizations. The silence of the stars is
                  both eerie and beautiful, promising mysteries that only the
                  bravest dare to unravel. The infinite possibilities of new
                  worlds, forgotten relics of ancient species, and the thrill of
                  exploring the final frontier await. To your right, the pulse
                  of the city calls. Streets illuminated by the neon glow,
                  bustling with life, offer secrets hidden in the shadows. The
                  city's skyline is a maze of towering skyscrapers, each with
                  its own story. Every corner promises a new
                  adventure—unraveling underground conspiracies, making unlikely
                  alliances, or chasing down a lead in a high-speed chase. The
                  rhythm of the metropolis, the hum of technology, and the
                  energy of a city that never sleeps push you to explore its
                  many layers. Which path will you choose: the boundless expanse
                  of space or the vibrant, unpredictable city?
                </p>
              </CardContent>
              <CardFooter className="flex justify-center gap-5">
                <div className="flex flex-col md:flex-row gap-8 ">
                  <BranchOption
                    title="Land"
                    icon={<Globe className="w-10 h-10 mb-4" />}
                    description="Stay in city"
                    onClick={() => handleSelection("land")}
                  />
                  <BranchOption
                    title="Space"
                    icon={<Rocket className="w-10 h-10 mb-4" />}
                    description="Go to space"
                    onClick={() => handleSelection("space")}
                  />
                </div>
              </CardFooter>
            </Card>
          </div>
        );
      case "merging":
        return (
          <div className="flex justify-center items-center">
            <Card className="max-w-2xl  text-center animate-fadeIn  bg-opacity-100 bg-[url('/merging.webp')] p-10">
              <CardTitle className="text-3xl text-white">
                Merging Both the worlds
              </CardTitle>
              <CardContent className="p-4">
                <p className="mb-4 text-white">
                  Congratulations You have completed your quest on your selected
                  path now its time to come back
                </p>
              </CardContent>
              <CardFooter className="flex justify-center gap-5">
                <p className="text-bold text-white">Loading ...</p>
              </CardFooter>
            </Card>
          </div>
        );
      case "end":
        return (
          <div className="flex justify-center items-center">
            <Card className="max-w-md animate-fadeIn">
              <CardHeader>
                <CardTitle className="text-2xl">Congratulations!</CardTitle>
                <CardDescription>
                  You've completed Cryptic Finds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-xl font-bold">
                  Your final score: {user.score}
                </p>
                <p className="text-center mt-4">Thank you for playing!</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Link to="/">
                  <Button>Return Home</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        );
      default:
        return (
          <div className="flex justify-center items-center">
            <p className="text-white text-5xl">Unknown state</p>
          </div>
        );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: user?.currentState
          ? backgroundImages[user?.currentState as BackgroundState]
          : backgroundImages["start"],
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />
      <div className="p-4 w-full max-w-4xl animate-fadeIn">
        {renderContent()}
      </div>
    </div>
  );
};

export default Chapter1;
