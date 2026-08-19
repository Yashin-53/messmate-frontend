import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Check whether token has expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
          return;
        }

        setUser({
          token,
          username: decoded.username,
          userId: decoded.userId
        });
      } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);

      localStorage.setItem("token", token);

      setUser({
        token,
        username: decoded.username,
        userId: decoded.userId
      });
    } catch (error) {
      console.error("Failed to decode token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};