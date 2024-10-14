import React, { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";

const TypingEffect: React.FC = () => {
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTypewriter(true); // Show the typewriter after the delay
    }, 1000); // 2 second delay

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  return (
    <div className="text-center my-8">
      <h1 className="text-2xl text-green-500 font-bold">
        {showTypewriter && (
          <Typewriter
            words={["Welcome to Cryptic Finds"]}
            loop={1} // Loop once
            cursor // Show cursor while typing
            cursorStyle="|" // Default cursor style
            typeSpeed={70}
            delaySpeed={2000}
          />
        )}
      </h1>
    </div>
  );
};

export default TypingEffect;
