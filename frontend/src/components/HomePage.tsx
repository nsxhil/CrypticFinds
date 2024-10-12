import React, { Suspense, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import Earth from "../../public/Earth"; // Adjust path as necessary
import Navbar from "./ui/Navbar";

import { useAuth } from "./AuthContext";

/*const RotatingEarth: React.FC<{ mouseX: number; mouseY: number }> = ({
  mouseX,
  mouseY,
}) => {
  const earthRef = useRef<any>();

  // Rotate the Earth based on mouse movement
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y = mouseX * 0.001; // Adjust rotation sensitivity
      earthRef.current.rotation.x = mouseY * 0.001;
    }
  });

  return (
    <mesh ref={earthRef}>
      <Earth scale={2.5} />
    </mesh>
  );
};*/



const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [mouseX, setMouseX] = React.useState(0);
  const [mouseY, setMouseY] = React.useState(0);
  const aboutRef = useRef<HTMLDivElement | null>(null);

  const scrollOnClick = () : void  => {
    if(aboutRef.current){
    aboutRef.current.scrollIntoView({behavior: 'smooth'})
    }
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <>
      <Navbar scrollTo={scrollOnClick} />

      {/* Main container with mouse movement handler */}
      <div
        className="relative w-full h-screen text-white"
        onMouseMove={(e) => {
          setMouseX(e.clientX);
          setMouseY(e.clientY);
        }}
      >
        {/* 3D Earth Canvas Overlay 
        <div className="absolute top-[150px] right-[10%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] z-20">
          <Canvas>
            <ambientLight />
            <Suspense fallback={null}>
              <RotatingEarth mouseX={mouseX} mouseY={mouseY} />
            </Suspense>
          </Canvas>
        </div>
*/}
        {/* Text and video container */}
        <div className="w-full h-full relative">
          {/* Gradient overlay */}
          <div className="z-10 absolute w-full h-full bg-gradient-to-t from-[#000021]"></div>

          {/* Text container */}
          <div className="z-20 absolute  md:top-[190px] w-[90%] md:w-[80%] h-auto mx-[5%] md:mx-[10%] lg:mx-[20%]  ">
            <h1 className="text-gray-300 font-bold text-sm md:text-md lg:text-lg px-2">
              Welcome to
            </h1>
            <h1 className="text-orange-400 text-2xl md:text-4xl lg:text-5xl my-8 font-bold">
              CRYPTIC <span className="text-[#1fd1ff]">FINDS</span>
            </h1>

            {/* Button with hover effect */}
            <Link to="/game">
              <button className="relative group text-white font-bold py-3 md:py-4 px-4 md:px-6 border-none bg-transparent tracking-wide transition-all duration-500">
                PLAY THE GAME
                {/* Top left corner */}
                <span className="absolute top-0 left-0 w-5 h-0.5 bg-orange-400 transition-all duration-700 group-hover:w-full"></span>
                <span className="absolute top-0 left-0 w-0.5 h-5 bg-orange-400 transition-all duration-700 group-hover:h-full"></span>
                {/* Bottom right corner */}
                <span className="absolute bottom-0 right-0 w-5 h-0.5 bg-[#1fd1ff] transition-all duration-700 group-hover:w-full"></span>
                <span className="absolute bottom-0 right-0 w-0.5 h-5 bg-[#1fd1ff] transition-all duration-700 group-hover:h-full"></span>
              </button>
            </Link>
          </div>

          {/* Video background */}
          <video
            className="w-full h-full object-cover z-0"
            src="videoplayback.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
      {/* About Us Section */}
      <div id="about" className="container mx-auto py-16 bg-[#000021]" ref={aboutRef}>
        <h2 className="text-4xl font-bold text-center mb-6 text-white" >
          About Us
        </h2>
        <h6 className="text-lg text-white text-center">
          Welcome to Scavenger Hunt 2023 by Cryptonite, a thrilling amalgamation
          of puzzles, riddles, and captivating storylines. Founded by a
          passionate group of individuals at ACM with a penchant for cyber
          mysteries and adventures, our event provides a unique platform for
          participants to explore and challenge their intellect. This year's
          theme, “Space-Time Travel Mystery,” promises a stellar experience that
          will take our participants on an unprecedented voyage through the
          cosmos, from the distant future to unknown realms, all the while
          battling challenges that will test their acumen and mettle. Our
          collaboration with MAHE-ISAC Centre of Excellence for Cybersecurity
          and support from leading experts in the industry, has allowed us to
          craft an experience that's not just a game, but a comprehensive
          journey through the intricacies of cybersecurity, encryption, and
          logical deduction.
        </h6>

        {/* Information Sections */}
        <div className="flex flex-col md:flex-row gap-8 mt-[20vh]">
          <div className="flex-1 text-center justify-center">
            <h3 className="text-2xl font-semibold mt-4 text-white">
              MAHE-ISAC CoE for Cybersecurity
            </h3>
            <p className="text-white mt-2">
              The Centre of Excellence for Cybersecurity at the Manipal
              Institute of Technology is a beacon of knowledge and innovation in
              the realm of cybersecurity. With state-of-the-art facilities, it
              is dedicated to fostering research, development, and awareness in
              the ever-evolving domain of digital safety. Under the esteemed
              guidance of Dr. Balachandra, the Centre aims to empower students,
              professionals, and the community at large with the tools and
              knowledge to navigate the digital world securely.
            </p>
          </div>

          <div className="flex-1 text-center">
            <h3 className="text-2xl font-semibold mt-4 text-white">
              Cryptonite
            </h3>
            <p className="text-white mt-2">
              Cryptonite is the official ethical hacking and cybersecurity team
              at Manipal Institute of Technology. With a vast range of expertise
              from cryptography to reverse engineering, they've carved a niche
              for themselves on the global stage, achieving commendable
              positions in CTF rankings. Under the proficient guidance of Mrs.
              Nisha P Shetty, their endeavors have consistently been shaped and
              steered towards excellence. Their forthcoming "Cryptober" event
              showcases their dedication to cybersecurity education, offering
              enlightening talks, riveting competitions, and intricate
              challenges. As the digital world evolves, Cryptonite champions the
              cause of a secure and informed future.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
