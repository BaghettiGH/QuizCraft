"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthContextType } from "../types/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("access_token");
      console.log("Checking auth, token exists:", !!token);
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Auth check response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Auth check successful, raw data:", data);
        console.log("User from backend:", data.user);
        console.log("user.id type:", typeof data.user.id);
        console.log("user.id value:", data.user.id);
        
  
        const userData = {
          ...data.user,
          id: data.user.id // Convert to number if it's a string
        };
        
        console.log("Converted user data:", userData);
        console.log("Converted id type:", typeof userData.id);
        console.log("Converted id value:", userData.id);
        
        setUser(userData);
      } else {
        console.log("Auth check failed, removing token");
        localStorage.removeItem("access_token");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("access_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }

      const data = await response.json();
      console.log("Login successful, user:", data.user);
      
      // IMPORTANT: Ensure user.id is a number (database user_id)
      const userData = {
        ...data.user,
        id: data.user.id
      };
      
      localStorage.setItem("access_token", data.access_token);
      setUser(userData);
      
      // Force a small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      console.log("Attempting signup for:", email);
      
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      console.log("Signup response status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Signup failed");
      }

      const data = await response.json();
      console.log("Signup successful, user:", data.user);
      
      // IMPORTANT: Ensure user.id is a number (database user_id)
      const userData = {
        ...data.user,
        id: data.user.id
      };
      
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }
      setUser(userData);
      
      // Force a small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out");
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}