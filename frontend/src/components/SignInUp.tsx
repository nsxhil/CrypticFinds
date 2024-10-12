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
    <div className="flex justify-center items-center min-h-screen  p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignIn ? "Sign In" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isSignIn
              ? "Enter your credentials to sign in"
              : "Create a new account"}
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
            />
            {!isSignIn && (
              <>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </>
            )}
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              {isSignIn ? "Sign In" : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            onClick={() => {
              setIsSignIn(!isSignIn);
              navigate(isSignIn ? "/signup" : "/signin");
            }}
            className="w-full"
          >
            {isSignIn
              ? "Need an account? Sign Up"
              : "Already have an account? Sign In"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInUp;
