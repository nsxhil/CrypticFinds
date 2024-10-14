import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0d0518] text-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between mb-12 gap-6">
          {/* Logo and Social Icons */}
          <div className="flex flex-col mr-10">
            <div className="text-2xl font-bold mb-4">VIDEOGRAPH</div>
            <div className="flex space-x-4 mb-8">
              <a
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About us</h3>
              <p className="text-gray-400">
                Formed in 2006 by Matt Hobbs and Cael Jones, Videograph is an
                award-winning, full-service production company specializing.
              </p>
              <a href="#" className="text-blue-400 mt-4 block">
                Read more →
              </a>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Who we are</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Locations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Our work</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Feature
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Latest
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Browse Archive
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Video for web
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter Section */}
            <div>
              <h3 className="font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Videograph is an award-winning, full-service production company
                specializing.
              </p>
              <form>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 rounded-full bg-gray-800 text-gray-300 focus:outline-none"
                    aria-label="Email"
                  />
                  <button
                    type="submit"
                    className="absolute top-0 right-0 p-3 bg-blue-400 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="white"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
