"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/backend-api/authApi";
import { User, AuthContextType } from "./AuthProvider.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    try {
      const userData = await api.getUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      clearAuth()
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, refreshUser, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
