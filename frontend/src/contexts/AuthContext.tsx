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
  register: (username: string, email: string, password: string) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  refreshUser: (tokenOverride?: string) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const refreshUser = async (tokenOverride?: string): Promise<User | null> => {
    try {
      // 1. Get token from Argument OR LocalStorage
      const token = tokenOverride || localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return null;
      }

      // 2. Send token via Query Param 'SignedString' as required by your Backend
      const res = await api.get(`/auth/me?SignedString=${encodeURIComponent(token)}`, {
        withCredentials: true,
      });

      // 3. DEBUG LOG: Check what the backend actually returns
      console.log("DEBUG /auth/me Response:", res.data);

      // 4. Robust check for user object (Handles slightly different backend structures)
      const fetchedUser = 
        res.data?.data?.user || // If backend returns { data: { user: ... } }
        res.data?.user ||       // If backend returns { user: ... }
        res.data;               // If backend returns { id: ..., email: ... } directly

      if (!fetchedUser) {
        console.warn("User data not found in response");
        return null;
      }

      setUser(fetchedUser);
      return fetchedUser;
    } catch (err) {
      // If token is invalid, clear it
      console.error("Refresh failed", err);
      localStorage.removeItem("token");
      setUser(null);
      // Do not set global error here to avoid flashing errors on initial load
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
      return null;
  };

  const login = async (email: string, password: string) => {
      const res = await api.get(
        `/auth/signin?Email=${encodeURIComponent(email)}&Password=${encodeURIComponent(password)}`,
        { withCredentials: true }
      );

      const token: string = res.data?.tokenString;
      
      if (!token) {
        throw new Error("Сервер не вернул токен (tokenString missing)");
      }

      localStorage.setItem("token", token);
      const loggedInUser = await refreshUser(token);

      if (!loggedInUser) {
        throw new Error("Не удалось загрузить пользователя после входа");
      }

      navigate("/dashboard");
      return null;
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await api.post(
            `/auth/logout?SignedString=${encodeURIComponent(token)}`, 
            {}, 
            { withCredentials: true }
        );
      }
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);