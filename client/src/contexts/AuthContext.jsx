import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/shared/Loading";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyUser = async () => {
    try {
      const { data } = await axios.get("/jwt/verify");
      setUser(data.user);
    } catch (error) {
      console.log("Verify failed:", error.response?.data || error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/user/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  if (loading) return <Loading/>;

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, verifyUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

