import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import BusinessDashboard from "./components/dashboard/BusinessDashboard";
import DriverDashboard from "./components/dashboard/DriverDashboard";
import CustomerDashboard from "./components/dashboard/CustomerDashboard";
import Unauthorized from "./pages/Unauthorized";
import Home from "./pages/Home";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import UserProfile from "./components/profile/UserProfile"; // adjust the path if needed

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PageWrapper from "./components/common/PageWrapper";

function AppWrapper() {
  const location = useLocation();
  const hideNavbarOnPaths = ["/login", "/register", "/unauthorized"];
  const hideNavbar = hideNavbarOnPaths.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <UserProfile />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/unauthorized"
          element={
            <PageWrapper>
              <Unauthorized />
            </PageWrapper>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageWrapper>
              <Dashboard />
            </PageWrapper>
          }
        />
        <Route
          path="/business-dashboard"
          element={
            <ProtectedRoute role="business">
              <PageWrapper>
                <BusinessDashboard />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-dashboard"
          element={
            <ProtectedRoute role="driver">
              <PageWrapper>
                <DriverDashboard />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute role="customer">
              <PageWrapper>
                <CustomerDashboard />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;
