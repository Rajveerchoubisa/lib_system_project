import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LandingPage from "../src/pages/LandingPage.jsx"
import Footer from "./components/Footer.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import MyBookings from "./pages/MyBookings.jsx";
import Features from "./pages/Features.jsx"
import Books from "./pages/Books.jsx"
import MyProfile from "./pages/MyProfile.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import Payment from "./pages/Payment.jsx";
import Success from "./pages/Success.jsx";


export default function App() {
  return (
    <>
   
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/bookings" element={<BookingForm />} />
      <Route path="/payment/:id" element={<Payment />} />
      <Route path="/success" element={<Success />} />





      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/features" element ={<Features />}/>
      <Route path="/books" element={<Books />} />
      <Route path="/my-profile" element={<MyProfile/>} />
      
      {/* <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/receipt/:id" element={<Receipt />} /> */}
    
    </Routes>
    <Footer />
     </>
   
  );
}
