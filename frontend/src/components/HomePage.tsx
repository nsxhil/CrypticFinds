import React, { useRef } from "react";
import { Link, Navigate } from "react-router-dom"; // Adjust path as necessary
import Navbar from "./ui/Navbar";

import { useAuth } from "./AuthContext";
import Footer from "./Footer";

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
  const aboutRef = useRef<HTMLDivElement | null>(null);

  const scrollOnClick = (): void => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div>
      <Navbar scrollTo={scrollOnClick} />

      {/* Main container with mouse movement handler */}
      <div className="relative w-full h-screen text-white ">
        {/* Text and video container */}
        <div className="w-full h-full relative">
          {/* Gradient overlay */}
          <div className="z-10 absolute w-full h-full bg-gradient-to-t from-[#000021]"></div>

          {/* Text container */}
          <div className="z-20 absolute  md:top-[230px] w-[90%] md:w-[80%] h-auto mx-[5%] md:mx-[10%] lg:mx-[20%]  animate-fadeIn">
            <h1 className="text-gray-300 font-bold text-md md:text-lg lg:text-xl px-2">
              Welcome to
            </h1>
            <h1 className="text-sky-400 text-3xl md:text-5xl lg:text-6xl my-8 font-bold">
              CRYPTIC <span className="text-orange-400 ">FINDS</span>
            </h1>

            {/* Button with hover effect */}
            <Link to="/game">
              <button className="relative group text-white text-xl font-bold py-3 md:py-4 px-4 md:px-6 border-none bg-transparent tracking-wide  animate-fadeIn transition-all duration-500">
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
      <div
        id="about"
        className="container mx-auto py-16 bg-[#000021]"
        ref={aboutRef}
      >
        <h2 className="text-4xl font-bold text-center mb-6 text-white">
          About Us
        </h2>
        <h6 className="text-lg text-white text-center">
          Step into a world where technology reigns supreme and humanity
          struggles for survival in a dystopian cyberpunk universe. In Cryptic
          Finds, hosted by ACM, participants will embark on a thrilling journey
          through the neon-lit streets of a crumbling metropolis, where
          information is power and secrets are currency. As a member of a rebel
          faction fighting against an oppressive regime, your mission is to
          uncover hidden truths and solve cryptic puzzles that will guide you
          through a complex narrative filled with unexpected twists. Each
          question you solve unlocks new chapters in the storyline, revealing
          dark conspiracies, underground alliances, and the fate of a society on
          the brink of collapse. Join forces with fellow participants as you
          navigate through immersive environments, decipher intricate codes, and
          make critical decisions that will influence the outcome of your
          adventure. Will you rise to become the hero of the rebellion, or will
          you succumb to the shadows of the city? Prepare for an experience that
          combines teamwork, strategy, and problem-solving in a captivating
          cyberpunk setting. The future of this world lies in your hands—can you
          crack the codes and unveil the mysteries of Cryptic Finds?
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
      <Footer />
    </div>
  );
};

export default HomePage;
