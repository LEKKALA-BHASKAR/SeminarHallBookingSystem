import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  role: "admin" | "department";
  department?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, department: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for stored session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication - replace with real API call later
      const mockUsers: Record<string, User> = {
        "admin@example.com": {
          id: "1",
          name: "Admin User",
          role: "admin",
        },
        "dept@example.com": {
          id: "2",
          name: "Department User",
          role: "department",
          department: "Computer Science",
        },
      };

      const user = mockUsers[email];
      if (!user || password !== "password123") {
        throw new Error("Invalid credentials");
      }

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, department: string) => {
    setIsLoading(true);
    try {
      // Mock registration - replace with real API call later
      const newUser: User = {
        id: Date.now().toString(), // Generate a temporary ID
        name,
        role: "department",
        department,
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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