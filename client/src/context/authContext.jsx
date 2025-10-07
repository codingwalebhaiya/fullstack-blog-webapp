import { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // keep axios Authorization header in sync with token
  useEffect(() => {
    if (token) {
      //API.defaults.headers = API.defaults.headers || {};
      // API.defaults.headers.Authorization = `Bearer ${token}`;
      localStorage.setItem("token", token);
    }
  }, [token]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
    toast.success("Logged out");
    navigate("/login");
  }, [navigate]);

  // fetch current user when token is present
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    const controller = new AbortController();
    const getUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("/users/me", { signal: controller.signal });
        // adapt to your backend: if user is inside res.data.user or res.data
        const fetchedUser = res.data?.user ?? res.data;
        setUser(fetchedUser || null);
      } catch (err) {
        // ignore aborted request
        if (
          err.name === "CanceledError" ||
          err.name === "AbortError" ||
          err.message === "canceled"
        ) {
          return;
        }

        const status = err.response?.status;
        // only logout on auth errors
        if (status === 401 || status === 403) {
          toast.error("Session expired. Please log in again.");
          logout();
        } else {
          // non-auth errors: show message but keep user/token (optional)
          console.error("getUser error:", err.response?.data ?? err);
          toast.error(err.response?.data?.error || "Failed to fetch user");
        }
      } finally {
        setLoading(false);
      }
    };
    getUser();
    return () => controller.abort();
  }, [token, logout]);

  // register
  const register = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.post("/auth/register", formData);
      console.log(res);
      setUser(res.data.user);
      toast.success("Registered successfully");
      navigate("/login");
      return { success: true };
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed due to server error"
      );
      return { success: false, error: err.response?.data?.error };
    } finally {
      setLoading(false);
    }
  };

  // login
  const login = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.post("/auth/login", formData);
      console.log(res);
      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(res.data.user);

      if (res.statusText == "OK" || res.status == "200") {
        toast.success("Logged in successfully");
      }

      navigate("/");
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
      return { success: false, error: err.response?.data?.error };
    } finally {
      setLoading(false);
    }
  };

  // clear errors
  const clearErrors = () => setError(null);

  const value = {
    user,
    token,
    error,
    loading,
    register,
    login,
    logout,
    clearErrors,
    navigate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
