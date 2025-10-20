import { toast } from "react-toastify";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { register, error, clearErrors, loading, navigate } = useAuth();

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearErrors();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await register(formData);
  };

   if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white text-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="ml-3">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <NavLink
        className="mt-2 px-4 py-2 font-bold text-xl border-b-blue-700 border-b-2"
        to="/"
      >
        Home
      </NavLink>

      <div className="flex items-center justify-center mx-auto max-h-screen">
        <div className=" flex flex-col items-center max-w-md max-auto mt-10 p-6 border rounded shadow ">
          <h2 className="text-xl font-bold mb-4">Register</h2>

          <form onSubmit={submitHandler} className="space-y-4">
            <input
              name="username"
              type="text"
              placeholder="Username"
              onChange={changeHandler}
              value={formData.username}
              required
              className="w-full p-2 border rounded"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={changeHandler}
              value={formData.email}
              required
              className="w-full p-2 border rounded"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={changeHandler}
              value={formData.password}
              className="w-full p-2 border rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded  hover:bg-blue-700"
            >
              {loading ? "Processing..." : "Register"}
            </button>
          </form>

          <p className="text-sm mt-4 ">
            Already have a account?
            <span
              onClick={() => navigate("/login")}
              className="text-blue-700 cursor-pointer "
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
