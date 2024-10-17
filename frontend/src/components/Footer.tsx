import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <footer className="bg-[#0d0518] text-white py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between mb-12 gap-6">
            {/* Logo and Social Icons */}
            <div className="flex flex-col">
              <div className="text-2xl font-bold mb-4">CrypticFinds</div>
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
                  href="https://www.instagram.com/acm_manipal?igsh=ZmVya2pzNXhzemtx"
                  className="text-gray-400 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
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
            <div className=" flex  gap-8  justify-between">
              <div>
                <h3 className="font-semibold mb-4">About us</h3>
                <p className="text-gray-400">
                  Step into a world where technology reigns supreme and humanity
                  struggles for survival in a dystopian cyberpunk universe. In
                  Cryptic Finds, hosted by ACM...
                </p>
                <a href="#" className="text-sky-400 mt-4 block">
                  Read more →
                </a>
              </div>

              <div>
                <h3 className="font-semibold w-[30vh] mb-4">Who we are</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Rules
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white"
                      onClick={handleModalOpen}
                    >
                      Contact us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Team
                    </a>
                  </li>
                </ul>
              </div>

              {/* Newsletter Section */}
              <div>
                <h3 className="font-semibold  w-[30vh] mb-4">For queries</h3>
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
                      className="absolute top-0 right-0 p-3 bg-sky-400 rounded-full"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white text-black p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <p className="text-lg">Phone Number: +91-8240949676</p>
            <button
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={handleModalClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
