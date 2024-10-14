import React, { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";

const TypeWriterNormal: React.FC = () => {
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTypewriter(true); // Show the typewriter after the delay
    }, 3000); // 2 second delay

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);
  return (
    <div className="text-center my-8">
      {" "}
      {/* Align center and add margin */}
      <h1 className=" text-sm text-green-500">
        {showTypewriter && (
          <Typewriter
            words={["Solve riddles, uncover the story, earn points!"]}
            loop={1} // You can define how many times the animation should loop
            cursor
            cursorStyle={cursorVisible ? "|" : " "} // Change cursor style based on visibility
            typeSpeed={70}
            delaySpeed={2000}
            onLoopDone={() => setCursorVisible(false)}
          />
        )}
      </h1>
      {/* Subheading with orange color */}
    </div>
  );
};

export default TypeWriterNormal;
