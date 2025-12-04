import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

interface User {
  id?: string;
  username?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshUser = async (token?: string): Promise<User | null> => {
    try {
      if (!token) return null; // must pass token
      const res = await api.get(`/auth/me?SignedString=${encodeURIComponent(token)}`, {
        withCredentials: true,
      });
      const fetchedUser = res.data?.data?.user;
      setUser(fetchedUser || null);
      return fetchedUser || null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    await api.post(
      `/auth/signup?Username=${encodeURIComponent(username)}&Email=${encodeURIComponent(email)}&Password=${encodeURIComponent(password)}`,
      {},
      { withCredentials: true }
    );
    navigate("/login");
  };

  const login = async (email: string, password: string) => {
    try {
      // Get token from signin response
      const res = await api.get(
        `/auth/signin?Email=${encodeURIComponent(email)}&Password=${encodeURIComponent(password)}`,
        { withCredentials: true }
      );

      const token: string = res.data?.tokenString;
      if (!token) throw new Error("No token returned from backend");

      // Fetch user with the token
      const loggedInUser = await refreshUser(token);
      if (!loggedInUser) throw new Error("Failed to fetch user");

      navigate("/dashboard");
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    // Optional: refresh user if you have token saved elsewhere (e.g., localStorage)
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
