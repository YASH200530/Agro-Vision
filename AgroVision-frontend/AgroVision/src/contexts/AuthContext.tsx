import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { SupportedLanguage } from "./LanguageContext";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferredLanguage: SupportedLanguage;
}

// 1. Define a response type to carry success status AND error messages
type AuthResponse = {
  success: boolean;
  message?: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (
    name: string,
    email: string,
    phone: string,
    password: string,
    preferredLanguage: SupportedLanguage
  ) => Promise<AuthResponse>;
  updateProfile: (updates: Partial<Pick<User, "name" | "phone" | "preferredLanguage">>) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const base = (import.meta.env.VITE_API_URL as string) || "http://localhost:5001";
      const res = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, message: data.message || "Login failed" };
      }

      if (data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: "Network error. Check server." };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string, 
    email: string, 
    phone: string, 
    password: string, 
    preferredLanguage: SupportedLanguage
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      
      const base = (import.meta.env.VITE_API_URL as string) || "http://localhost:5001";
      console.log("Signing up to:", base);
      type BackendResponse = {
        message?: string;
        user?: any;
        token?: string;
      };
  
  

      const res = await fetch(`${base}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, preferredLanguage }),
      });
      console.log("RAW RESPONSE:", res);
      console.log("STATUS:", res.status);
      const data = await res.json();
      console.log("BODY:", data);
      
      if (!res.ok) {
        // Return the specific error from backend (e.g. "User already exists")
        return { success: false, message: data.message || "Signup failed" };
      }

      if (data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token!);
      }
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error. Check server." };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Pick<User, "name" | "phone" | "preferredLanguage">>) => {
    setIsLoading(true);
    try {
      const base = (import.meta.env.VITE_API_URL as string) || "http://localhost:5001";
      const token = localStorage.getItem("token");
      if (!token) return false;
      const res = await fetch(`${base}/api/auth/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) return false;
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, updateProfile, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};