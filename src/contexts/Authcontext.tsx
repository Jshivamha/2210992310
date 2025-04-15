"use client"
import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0NzA0MTczLCJpYXQiOjE3NDQ3MDM4NzMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjcwZTg2ODExLWFiMmYtNGZmNi05OGYwLWIxNjY5ZDdmM2VhYiIsInN1YiI6InNoaXZhbTIzMTAuYmUyMkBjaGl0a2FyYS5lZHUuaW4ifSwiZW1haWwiOiJzaGl2YW0yMzEwLmJlMjJAY2hpdGthcmEuZWR1LmluIiwibmFtZSI6InNoaXZhbSBqaGEiLCJyb2xsTm8iOiIyMjEwOTkyMzEwIiwiYWNjZXNzQ29kZSI6IlB3enVmRyIsImNsaWVudElEIjoiNzBlODY4MTEtYWIyZi00ZmY2LTk4ZjAtYjE2NjlkN2YzZWFiIiwiY2xpZW50U2VjcmV0IjoidHNZeXpiZmtYU3Z0ZUNlQSJ9.IC1Xu_ipHUNaNAQ13JVLn2Wxx3FdjPKuzPoSVOZhKd4");

  const isAuthenticated = accessToken !== null;

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isAuthenticated }}>
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
