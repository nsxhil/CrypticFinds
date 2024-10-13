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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Axis3D } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TypeWriter from "./ui/TypeWriter";
import TypeWriterNormal from "./ui/TypeWriternormal";
import TypeWriterBottom from "./ui/TypeWriterBottom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface Question {
  id: number;
  text: string;
  answer: string;
  points: number;
  story: string;
}

const CrypticFinds: React.FC = () => {
  const { user, updateHighScore } = useAuth();
  const [questions, setQuestions] = useState();
  const navigate = useNavigate();

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

  console.log(questions);

  const startGame = () => {
    navigate("/chapter1");
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="max-w-md bg-blue-500 text-center animate-fadeIn top-[30vh]">
        <TypeWriter />
        <TypeWriterNormal />
        <TypeWriterBottom user={{ username: user?.username }} />
        <CardFooter className="flex justify-center gap-5">
          <Button onClick={startGame}>Start Adventure</Button>
          <Link to="/leaderboard">
            <Button>Leaderboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CrypticFinds;
