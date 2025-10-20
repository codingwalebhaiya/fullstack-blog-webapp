import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import {
  PencilSquareIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useRef } from "react";

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav
      className={`
          w-full z-50 mt-5 
         border-b border-gray-100 
         fixed bg-white/90 backdrop-blur-5xl shadow-lg rounded-full bg-opacity-80  top-0 left-0  right-0 transition-transform duration-300 ease-in-out  ${
           isVisible ? "translate-y-0" : "-translate-y-full"
         }
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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center text-sm pe-2 font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-400 focus:ring-2 focus:ring-gray-200 dark:text-white"
                  type="button"
                >
                  <UserCircleIcon className="w-8 h-8 text-gray-500 cursor-pointer hover:text-gray-700 transition" />
                  <span className="text-gray-700 text-sm hidden lg:block">
                    Hello, {user?.username || "User"}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                    <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      <div className="truncate text-gray-400 text-x">
                        {user?.email || "user@email.com"}
                      </div>
                    </div>
                    {/* i want to implement link path for admin , author, reader */}

                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                      {user?.role === "admin" && (
                        <li>
                          <Link
                            to="admin/dashboard"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Dashboard
                          </Link>
                        </li>
                      )}
                      {user?.role === "author" && (
                        <li>
                          <Link
                            to="author/dashboard"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Dashboard
                          </Link>
                        </li>
                      )}
                      {user?.role === "reader" && (
                        <li>
                          <Link
                            to="reader/dashboard"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Dashboard
                          </Link>
                        </li>
                      )}
                    </ul>
                    <div className="py-2">
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white  dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition duration-300"
              >
                Login
              </Link>
            )}
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

            <div
              className={`lg:hidden ${
                isMenuOpen ? "block" : "hidden"
              } absolute w-full bg-white/95 backdrop-blur-lg shadow-lg`}
            >
              <div className="px-4 pt-3 pb-4 space-y-3">
                {token ? (
                  <>
                    <div className="flex items-center gap-3">
                      <UserCircleIcon className="w-8 h-8 text-gray-500 cursor-pointer hover:text-gray-700 transition" />
                      <div>
                        <div className="font-semibold text-gray-800">
                          {user?.username}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {user?.email}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3 space-y-2">
                      <Link
                        to="/create"
                        className="flex items-center gap-2 p-2 w-full text-gray-700 hover:text-green-600 font-medium transition duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                        Write
                      </Link>

                      {user?.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-2 py-1 text-gray-700 hover:bg-gray-100 rounded-md"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      )}

                       {user?.role === "author" && (
                        <Link
                          to="/author/dashboard"
                          className="block px-2 py-1 text-gray-700 hover:bg-gray-100 rounded-md"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      )}

                       {user?.role === "reader" && (
                        <Link
                          to="/reader/dashboard"
                          className="block px-2 py-1 text-gray-700 hover:bg-gray-100 rounded-md"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-2 py-1 text-red-600 hover:bg-gray-100 rounded-md"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block text-center px-4 py-2 text-sm bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
