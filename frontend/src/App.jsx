import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import LandingPage from "../src/pages/LandingPage.jsx";
import Footer from "./components/Footer.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Features from "./pages/Features.jsx";
import Books from "./pages/Books.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import Payment from "./pages/Payment.jsx";
import Success from "./pages/Success.jsx";

import TermsOfService from "./components/TermsOfService.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Renew from "./pages/Renew.jsx";
import ResetPasswordPhone from "./pages/ResetPasswordPhone.jsx";
import ResetPasswordEmail from "./pages/ResetPasswordEmail.jsx";
import Protected from "./components/Protected.jsx";
import { useLoader } from "./context/LoaderContext.jsx";
import GlobalLoader from "./components/GlobaLoader.jsx";

export default function App() {
  const { isLoading } = useLoader();
  return (
    <>
      <GlobalLoader isLoading={isLoading} />
      <ToastContainer position="top-center" autoClose={3000} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPasswordEmail />} />
        <Route path="/reset-password-phone" element={<ResetPasswordPhone />} />
        <Route path="/features" element={<Features />} />
        <Route path="/books" element={<Books />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Protected Routes */}
        <Route element={<Protected />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<BookingForm />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/success" element={<Success />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/renew" element={<Renew />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}
