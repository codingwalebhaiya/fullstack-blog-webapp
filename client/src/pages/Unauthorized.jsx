import { Link } from "react-router-dom";
import { LockClosedIcon } from "@heroicons/react/24/outline";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="max-w-md mx-auto">
        <LockClosedIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
