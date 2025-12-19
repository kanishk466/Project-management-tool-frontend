// import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { User, UserRole } from '@/types';
// import { mockUsers } from '@/data/mockData';

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string, role: UserRole) => Promise<boolean>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(() => {
//     const stored = localStorage.getItem('rpm_user');
//     return stored ? JSON.parse(stored) : null;
//   });

//   const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
//     // Mock authentication - in production, this would call the API
//     const foundUser = mockUsers.find(u => u.role === role);
//     if (foundUser && password.length >= 4) {
//       setUser(foundUser);
//       localStorage.setItem('rpm_user', JSON.stringify(foundUser));
//       return true;
//     }
//     return false;
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('rpm_user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }



import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("rpm_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("rpm_token");
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      /**
       * Expected response:
       * {
       *   user: { id, name, email, role },
       *   token: "jwt-token"
       * }
       */

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem("rpm_user", JSON.stringify(data.user));
      localStorage.setItem("rpm_token", data.token);

      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("rpm_user");
    localStorage.removeItem("rpm_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
