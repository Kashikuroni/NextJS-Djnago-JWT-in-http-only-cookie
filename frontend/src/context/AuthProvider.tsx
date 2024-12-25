"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/backend-api/authApi";
import { User } from "./AuthProvider.types";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const userData = await api.getUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    refreshUser(); // Загружаем данные пользователя при монтировании провайдера
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
