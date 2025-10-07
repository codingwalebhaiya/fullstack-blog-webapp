// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Import Heroicons
import {
  PencilSquareIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      // className={`
      //   fixed top-0 w-full z-50
      //   bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-100
      // `}

      className={`
          w-full z-50 mt-5 
         border-b border-gray-100 
         fixed bg-white/90 backdrop-blur-3xl shadow-lg rounded-full
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-800 hover:text-gray-900 transition-colors"
          >
            Techify
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/create"
              className="flex items-center gap-2 p-2 lg:p-0 text-gray-700 hover:text-green-600 font-medium transition duration-200"
            >
              <PencilSquareIcon className="w-5 h-5" />
              Write
            </Link>

            {token ? (
              <div className="flex items-center gap-2 p-2 lg:p-0">
                <span className="text-gray-700 text-sm hidden lg:block">
                  Hello, {user?.username}
                </span>
                <UserCircleIcon className="w-8 h-8 text-gray-500 cursor-pointer hover:text-gray-700 transition" />
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition duration-300 transform"
              >
                Login
              </Link>
            )}

            <div 
            className="cursor-pointer text-gray-700 hover:text-red-600 font-medium transition duration-200"
            onClick={logout}>
              Logout
            </div>
          </div>

          {/* for mobile size*/}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden ${
          isMenuOpen ? "block" : "hidden"
        } absolute w-full bg-white/90 backdrop-blur-lg shadow-lg`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <div className="flex flex-col items-start p-2 space-y-2">
            <div>
              {token ? (
                <Link
                  to="/create"
                  className="flex items-center gap-2 p-2 w-full text-gray-700 hover:text-green-600 font-medium transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <PencilSquareIcon className="w-5 h-5" />
                  Write
                </Link>
              ) : (
                ""
              )}
            </div>

            {token ? (
              <div className="flex items-center gap-2 p-2 w-full">
                <UserCircleIcon className="w-8 h-8 text-gray-500" />
                <span className="text-gray-700">Hello, {user?.username}</span>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition duration-300 transform"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}

            <div 
            className="cursor-pointer gap-2 p-2 w-full text-gray-700 hover:text-red-600 font-medium transition duration-200"
            onClick={logout}>
              Logout
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
