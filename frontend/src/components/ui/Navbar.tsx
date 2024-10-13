import React, { useState, useEffect } from "react";
// import { FaSearch, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

interface NavbarClass {
  backgroundColor: string;
  padding: string;
  textColor: string;
}

const Navbar: React.FC = ({...props}) => {
  const [navbarClass, setNavbarClass] = useState<NavbarClass>({
    backgroundColor: "bg-transparent",
    padding: "py-6",
    textColor: "text-white",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [name, setName] = useState([]);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const Logout = async () => {
    window.localStorage.setItem("user", "null");
    navigate("/login");
  };


  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  

  useEffect(() => {
    // Scroll animation logic from the first navbar
    const changeNavbarOnScroll = () => {
      if (window.scrollY >= 80) {
        setNavbarClass({
          backgroundColor: "bg-white dark:bg-black", // Change color after scrolling
          padding: "py-1",
          textColor: "text-black", // Reduce padding (and thus height) after scrolling
        });
      } else {
        setNavbarClass({
          backgroundColor: "bg-transparent", // Default transparent color
          padding: "py-3",
          textColor: "text-white", // Default padding for larger height
        });
      }
    };

    window.addEventListener("scroll", changeNavbarOnScroll);

    // Cleanup event listener
    return () => {
      window.removeEventListener("scroll", changeNavbarOnScroll);
    };
  }, []);

  useEffect(() => {
    const data = {
      email: user,
    };

    const getName = async () => {
      await fetch("http://localhost:8080/nameFetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => setName(data))
        .catch((err) => console.log("Internal Error Occurred: ", err.message));
    };
    getName();
  }, [user]);


  return (
    <nav
      className={`${navbarClass.backgroundColor} fixed w-full z-30 top-0 start-0 transition-all duration-300 ${navbarClass.padding}`}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1">
        <Link to="/">
          <h1
            className={`${navbarClass.textColor} text-2xl sm:text-4xl md:text-2xl cursor-pointer font-bold`}
          >
            CrypticFinds
          </h1>
        </Link>


        <div className="flex items-center">
        <div className="text-white px-2 hover:text-[#1fd1ff]" onClick={props.scrollTo}> About Us </div>
          {user ? (
            <>
              <div className="relative">
                <button
                  className={`${navbarClass.textColor} mx-4 cursor-pointer hover:text-orange-400`}
                  onClick={toggleAccountMenu}
                >
                  Account
                </button>
                {showAccountMenu && (
                  <div className="absolute bg-gray-800 rounded-lg shadow-md mt-2 py-2 w-48 right-0">
                    <h1 className="text-white text-xl font-bold px-4 pt-2 pb-5 ">
                    Hi, {user.username}
                    </h1>
                    <Link to="/account">
                      <p className=" text-gray-300  px-4 py-2 hover:bg-gray-700 cursor-pointer ">
                        Profile
                      </p>
                    </Link>

                    <p
                      className="text-gray-300 px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={signOut}
                    >
                      Logout
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <Link to="/login">
                <button className="text-white mx-4 cursor-pointer">
                  Sign in
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-red-600 text-white px-2 py-1 rounded cursor-pointer">
                  Sign up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
