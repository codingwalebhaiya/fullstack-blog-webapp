import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  FaceSmileIcon,
  
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AuthorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  

  const menuItems = [
    { name: "Dashboard", path: "/author/dashboard", icon: HomeIcon },
    { name: "Posts", path: "/author/posts", icon: DocumentTextIcon },
    { name: "Profile", path: "/author/profile", icon: FaceSmileIcon },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {window.innerWidth < 1024 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3 }}
              className="fixed z-30 inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg lg:static lg:translate-x-0"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-700 dark:text-white">
                  Author Panel
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700 lg:hidden"
                >
                  ✕
                </button>
              </div>

              <nav className="mt-4 space-y-1 px-3">
                <button
                  onClick={handleBackToHome}
                  className="flex items-center w-full px-3 py-3 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900 transition-colors mb-2"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-3" />
                  Back to Home
                </button>

                {menuItems.map(({ name, path, icon: Icon }) => (
                  <NavLink
                    key={name}
                    to={path}
                    onClick={() =>
                      window.innerWidth < 1024 && setSidebarOpen(false)
                    }
                    className={({ isActive }) =>
                      `flex items-center px-3 py-3 rounded-lg text-sm font-medium ${
                        isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {name}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md w-full">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="lg:hidden text-gray-600 dark:text-gray-300 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors "
          >
            ☰
          </button>

          <h1 className="text-xl font-semibold text-gray-800 dark:text-white lg:ml-4">
            Author Dashboard
          </h1>

          

          {/* <button
            onClick={handleBackToHome}
            className="flex items-center text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </button> */}
       
       
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthorLayout;
