import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Progress } from "@/components/ui/progress";
import {
  Card,

  CardFooter,

} from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircle, Axis3D } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TypeWriter from "./ui/TypeWriter";
import TypeWriterNormal from "./ui/TypeWriternormal";
import TypeWriterBottom from "./ui/TypeWriterBottom";
// import axios from "axios";
  const gameStartTime = new Date('2024-10-18T18:30:00Z');
  // const gameStartTime = new Date('2024-10-18T18:30:00Z');

  // const API_URL = import.meta.env.VITE_API_URL;

// interface Question {
//   id: number;
//   text: string;
//   answer: string;
//   points: number;
//   story: string;
// }

const CrypticFinds: React.FC = () => {
  const { user } = useAuth();
  // const [questions, setQuestions] = useState();
  const [showButtons, setShowButtons] = useState(false); // State to control button visibility
  const navigate = useNavigate();


  const startGame = () => {
    const currTime = new Date();
    if (currTime >= gameStartTime) {
      navigate("/chapter1");
    } else {
      const startTimeStr = gameStartTime.toLocaleString();
      alert(`The game starts at ${startTimeStr}. Please come back later!`);
    }

    // navigate("/chapter1");
  };

  // Add a delay before showing the buttons
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 500); // Adjust the delay time (2000ms = 2 seconds)

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  return (
    <div className="flex items-center justify-center">
      <Card className="w-[500px] h-[300px] text-center top-[30vh] bg-[url('/bg4.png')] px-5">
        <TypeWriter  />
        <TypeWriterNormal />
        <TypeWriterBottom user={{ username: user?.username }} />
        {showButtons && (
          <CardFooter className="flex justify-center gap-5 animate-fadeIn ">
            <Button onClick={startGame}>Start Adventure</Button>
            <Link to="/leaderboard">
              <Button>Leaderboard</Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default CrypticFinds;
