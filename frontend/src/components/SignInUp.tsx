import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion"; // For subtle animations

interface SignInUpProps {
  mode: "signin" | "signup";
}

const SignInUp: React.FC<SignInUpProps> = ({ mode }) => {
  const [isSignIn, setIsSignIn] = useState(mode === "signin");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    let success;
    if (isSignIn) {
      success = await signIn(username, password);
    } else {
      success = await signUp(username, email, phoneNumber, password);
    }
    if (success) {
      navigate("/"); // This will now redirect to the HomePage
    } else {
      setError(
        isSignIn ? "Invalid credentials" : "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-xl border border-gray-800"
      >
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              {isSignIn ? "Welcome Back!" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {isSignIn
                ? "Enter your credentials to access your account"
                : "Sign up to explore new features!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-gray-800 text-white border-none placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {!isSignIn && (
                <>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-800 text-white border-none placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="bg-gray-800 text-white border-none placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </>
              )}
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 text-white border-none placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {error && (
                <Alert variant="destructive" className="bg-red-500 text-white">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                {isSignIn ? "Sign In" : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <Button
              variant="link"
              onClick={() => {
                setIsSignIn(!isSignIn);
                navigate(isSignIn ? "/signup" : "/signin");
              }}
              className="text-indigo-400 hover:text-indigo-500"
            >
              {isSignIn
                ? "Need an account? Sign Up"
                : "Already have an account? Sign In"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignInUp;
