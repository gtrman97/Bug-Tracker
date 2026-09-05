import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = "bugtracker_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  // Starts true because on first load, if a token exists, we don't yet
  // know whether it's still valid or who it belongs to — see the effect
  // below. Components (like ProtectedRoute) can wait on this instead of
  // briefly flashing a "logged out" state on every page refresh.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    // We have a token from a previous session but no user object (name/
    // email only ever came back from login/register) — ask the backend
    // who this token belongs to.
    api
      .get("/auth/me", token)
      .then((data) => setUser(data.user))
      .catch(() => {
        // Token is expired/invalid — clear it rather than silently
        // keeping a token around that every API call will just reject.
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- only ever run once, on mount

  const login = async (email, password) => {
    const data = await api.post("/auth/login", { email, password });
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await api.post("/auth/register", { name, email, password });
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}