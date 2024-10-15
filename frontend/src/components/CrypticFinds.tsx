import React from "react";
import { useAuth } from "./AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import TypeWriter from "./ui/TypeWriter";
import TypeWriterNormal from "./ui/TypeWriternormal";
import TypeWriterBottom from "./ui/TypeWriterBottom";

const CrypticFinds: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const questionResponse = await axios.get(`${API_URL}/questions`);
  //       const questionData = await questionResponse;
  //       setQuestions(questionData.data);
  //     } catch (err) {
  //       console.log("internal Error Occured", err);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const startGame = () => {
    navigate("/chapter1");
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="max-w-md text-center animate-fadeIn top-[30vh]   bg-[url('bg4.png')]">
        <TypeWriter />
        <TypeWriterNormal />
        <TypeWriterBottom user={{ username: user?.username }} />
        <CardFooter className="flex justify-center gap-5">
          <Button className="tra" onClick={startGame}>
            Start Adventure
          </Button>
          <Link to="/leaderboard">
            <Button>Leaderboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CrypticFinds;
