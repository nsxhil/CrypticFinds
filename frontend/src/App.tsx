import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import SignInUp from "@/components/SignInUp";
import CrypticFinds from "./components/CrypticFinds";
import Leaderboard from "./components/Leaderboard";
import HomePage from "./components/HomePage";
import AccountPage from "./components/AccountPage";
import Chapter1 from "./components/Chapter1";

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/signin" replace />;
};

const PublicRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : element;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="w-screen min-h-screen bg-[#000021] items-center">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/1234ab" element={<Leaderboard />} />
            <Route
              path="/signin"
              element={<PublicRoute element={<SignInUp mode="signin" />} />}
            />

            <Route
              path="/signup"
              element={<PublicRoute element={<SignInUp mode="signup" />} />}
            />
            <Route
              path="/game"
              element={<PrivateRoute element={<CrypticFinds />} />}
            />
            <Route
              path="/chapter1"
              element={<PrivateRoute element={<Chapter1 />} />}
            />
            {/* <Route
              path="/abcd1234"
              element={<PrivateRoute element={<Leaderboard />} />}
            /> */}
            
            <Route
              path="/account"
              element={<PrivateRoute element={<AccountPage />} />}
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
