import React, { useState, useEffect } from "react";
// import { FaSearch, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";



const API_URL = import.meta.env.VITE_API_URL;

interface NavbarClass {
  backgroundColor: string;
  padding: string;
  textColor: string;
}

const Navbar: React.FC = ({ ...props }) => {
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

  const url = useLocation()

  const Logout = async () => {
    window.localStorage.setItem("user", "null");
    navigate("/login");
  };

  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  useEffect(() => {
    
    const changeNavbarOnScroll = () => {
      if (window.scrollY >= 80) {
        setNavbarClass({
          backgroundColor: "bg-white dark:bg-black", 
          padding: "py-1",
          textColor: "text-black", 
        });
      } else {
        setNavbarClass({
          backgroundColor: "bg-transparent", 
          padding: "py-3",
          textColor: "text-white", 
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
    if (user) {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error("No token found");
            return;
          }
          const response = await axios.get(`${API_URL}/api/auth/user`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setName(response.data.username);
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      };
      fetchUserData();
    }
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
          {url.pathname == '/' ? (           <div
            className={`${navbarClass.textColor} px-2 hover:text-[#1fd1ff] hover:cursor-pointer transition-all duration-500`}
            onClick={props.scrollTo}
          >
            {" "}
            About Us{" "}
          </div>) : (<></>) }
          
          {/* <div
            className={`${navbarClass.textColor} px-2 hover:text-[#1fd1ff] hover:cursor-pointer transition-all duration-500`}
            onClick={props.scrollTo}
          >
            {" "}
            About Us{" "}
          </div> */}


          {user ? (
            <>
              <div className="relative">
                <button
                  className={`${navbarClass.textColor} mx-4 cursor-pointer hover:text-orange-400 transition-all duration-500`}
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
