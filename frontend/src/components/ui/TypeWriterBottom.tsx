import React, { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";

interface TypeWriterBottomProps {
  user: { username: string | undefined }; // Define the structure of the user object
}

const TypeWriterBottom: React.FC<TypeWriterBottomProps> = ({ user }) => {
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTypewriter(true); // Show the typewriter after the delay
    }, 5250); // 4-second delay

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  return (
    <div className="text-center my-8">
      {/* Align center and add margin */}
      <h1 className=" text-lg text-green-500">
        {showTypewriter && (
          <Typewriter
            words={[
              `Are you ready to embark on a mysterious journey, ${user.username}?`,
            ]} // Include user.username
            loop={1} // Loop only once
            cursor={cursorVisible}
            cursorStyle={cursorVisible ? "|" : " "} // Change cursor style based on visibility
            typeSpeed={70}
            delaySpeed={2000}
            onLoopDone={() => setCursorVisible(false)}
          />
        )}
      </h1>
    </div>
  );
};

export default TypeWriterBottom;
