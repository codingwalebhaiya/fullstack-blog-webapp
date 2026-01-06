import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // fetch current user on mount
  useEffect(() => {
    const controller = new AbortController();
    const getUser = async () => {
      try {
        const res = await API.get("/api/v1/users/me", { signal: controller.signal });
        // adapt to your backend: if user is inside res.data.user or res.data
        const fetchedUser = res.data?.user ?? res.data;
        setUser(fetchedUser || null);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch user");
        setUser(null); // clear user on error
      } finally {
        setLoading(false);
      }
    };
    getUser();
    return () => controller.abort();
  }, []);

  // register
  const register = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.post("/api/v1/auth/register", formData);
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
      const res = await API.post("/api/v1/auth/login", formData);
      setUser(res.data.user);

      if (res.statusText == "OK" || res.status == "200") {
        toast.success("Logged in successfully");
      }

      navigate("/");
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

// logout 
  const logout = async () => {
    try {
      await API.post("/api/v1/auth/logout")    
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setUser(null);
      toast.success("Logged out");
      navigate("/login");
    }
   
  }

  // clear errors
  const clearErrors = () => setError(null);

  const value = {
    user,
    error,
    loading,
    register,
    login,
    logout,
    clearErrors,
    navigate,
    isAuthenticated: !!user,
    hasRole: (role) => user?.role === role,
    hasAnyRole: (roles) => roles.includes(user?.role)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
