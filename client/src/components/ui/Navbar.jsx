import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, token } = useAuth();

  return (
    <nav className="flex items-center justify-between rounded-sm px-4 py-4 m-4 bg-slate-400  z-50 ">
      <div>
        <Link to="/">Techify</Link>
      </div>
      <div className="flex items-center gap-x-2">
        {token ? (
          <span>Welcome {user?.username}</span>
        ) : (
          <button className="rounded-sm text-base font-medium">
            <Link to="/login">Login</Link>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
