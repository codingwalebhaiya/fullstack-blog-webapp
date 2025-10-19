import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  CubeIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";


export default function Sidebar({ open, onClose }) {
  const baseClasses =
    "fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700";
  const mobileHidden = open ? "translate-x-0" : "-translate-x-full sm:translate-x-0";
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 sm:hidden" onClick={onClose} />}

      <aside className={`${baseClasses} ${mobileHidden}`} aria-label="Sidebar">
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${isActive ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`
                }
              >
                <HomeIcon className="w-5 h-5 text-gray-500" />
                <span className="ms-3">Dashboard</span>
              </NavLink>
            </li>

          

            <li>
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${isActive ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`
                }
              >
                <UsersIcon className="w-5 h-5 text-gray-500" />
                <span className="ms-3 flex-1 whitespace-nowrap">Users</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${isActive ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`
                }
              >
                <CubeIcon className="w-5 h-5 text-gray-500" />
                <span className="ms-3 flex-1 whitespace-nowrap">Posts</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/signin"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${isActive ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`
                }
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-500" />
                <span className="ms-3 flex-1 whitespace-nowrap">Sign In</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${isActive ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`
                }
              >
                <PencilSquareIcon className="w-5 h-5 text-gray-500" />
                <span className="ms-3 flex-1 whitespace-nowrap">Sign Up</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
