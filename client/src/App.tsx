import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import React from "react";
import { Toaster } from "react-hot-toast";
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import OpenRoute from "./components/common/OpenRoute";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./layout/Layout";
import BookingDetails from "./pages/BookingDetails";
import Flights from "./pages/Flights";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";
import History from "./pages/History";
import Home from "./pages/Home";
import PassengerDetails from "./pages/PassengerDetails";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOtp";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ValidateEmail from "./pages/ValidateEmail";
import NotFound from "./pages/NotFound";

const theme = createTheme({});

const App: React.FC = () => {
  return (
    <MantineProvider theme={theme}>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route
            element={
              <Layout showNavbar={false}>
                <Outlet />
              </Layout>
            }
          >
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route
              path="/auth"
              element={
                <OpenRoute>
                  <Signup />
                </OpenRoute>
              }
            />
            <Route
              path="/verify-otp"
              element={
                <OpenRoute>
                  <VerifyOTP />
                </OpenRoute>
              }
            />
            <Route
              path="/validate-email"
              element={
                <OpenRoute>
                  <ValidateEmail />
                </OpenRoute>
              }
            />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route
              path="/auth/google/callback"
              element={
                <OpenRoute>
                  <GoogleAuthCallback />
                </OpenRoute>
              }
            />
          </Route>
          <Route
            element={
              <Layout showNavbar={true}>
                <Outlet />
              </Layout>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/search-flights" element={<Flights />} />
            <Route
              path="/passenger-details/:flightId/:returnFlightId?"
              element={
                <ProtectedRoute>
                  <PassengerDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-details/:bookingId"
              element={
                <ProtectedRoute>
                  <BookingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </MantineProvider>
  );
};

export default App;
