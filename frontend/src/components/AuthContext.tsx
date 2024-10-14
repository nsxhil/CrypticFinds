import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  username: string;
  email: string;
  phoneNumber: string;
  score: string;
  questionNo: string;
  currentState: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (username: string, password: string) => Promise<boolean>;
  signUp: (
    username: string,
    email: string,
    phoneNumber: string,
    password: string
  ) => Promise<boolean>;
  signOut: () => void;
  updateUser: (
    score: string,
    questionNo: string,
    currentState: string
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.valid) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password,
      });
      const {
        token,
        username: responseUsername,
        email: responseEmail,
        phoneNumber: responsephoneNumber,
        score: responseScore,
        questionNo: responsequestionNo,
        currentState: responseCurrentState,
      } = response.data;
      localStorage.setItem("token", token);
      const user = {
        score: responseScore,
        questionNo: responsequestionNo,
        currentState: responseCurrentState,
        username: responseUsername,
        email: responseEmail,
        phoneNumber: responsephoneNumber,
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signUp = async (
    username: string,
    email: string,
    phoneNumber: string,
    password: string
  ) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        username,
        email,
        phoneNumber,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      const user = {
        username,
        score: "0",
        questionNo: "0",
        currentState: "start",
        email,
        phoneNumber,
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Signup error:", error.response?.data || error.message);
      } else {
        console.error("Signup error:", error);
      }
      return false;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // New method to update the user's score, questionNo, and currentState
  const updateUser = async (
    score: string,
    questionNo: string,
    currentState: string
  ) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const response = await axios.post(
        `${API_URL}/api/auth/updateuser`,
        {
          username: user.username,
          score,
          questionNo,
          currentState,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error("Update user error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
