import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, UserCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import axios from "axios";

export default function DashboardNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const closeMobileMenu = () => setMobileMenu(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0f0c29]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="text-white text-2xl font-extrabold tracking-tight hover:text-indigo-400 transition"
          onClick={closeMobileMenu}
        >
          Smart<span className="text-indigo-400">Library</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-white text-sm font-medium">
          <NavItem to="/dashboard" active={location.pathname === "/dashboard"}>
            Home
          </NavItem>
          <NavItem to="/bookings" active={location.pathname === "/bookings"}>
            Book Seat
          </NavItem>
          <NavItem
            to="/my-bookings"
            active={location.pathname === "/my-bookings"}
          >
            My Bookings
          </NavItem>
          <NavItem to="/renew" active={location.pathname === "/renew"}>
            Renew Booking
          </NavItem>
        </nav>

        {/* User Section */}
        <div className="relative flex items-center gap-4">
          {/* Profile Dropdown (Desktop) */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-white cursor-pointer hidden md:inline-flex"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <UserCircle className="w-7 h-7" />
          </motion.div>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-md shadow-lg py-2 w-44 text-sm text-white"
              >
                <Link
                  to="/my-profile"
                  className="block px-4 py-2 hover:bg-white/20 transition"
                  onClick={() => setShowDropdown(false)}
                >
                  My Profile
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logout Button (Desktop) */}
          <button
            onClick={handleLogOut}
            className="hidden md:flex bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-md items-center gap-2 transition shadow"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0  z-50 md:hidden"
          >
            {/* Background overlay */}
            <div
              className="absolute inset-0  bg-black/50  backdrop-blur-sm"
              onClick={closeMobileMenu}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative ml-auto h-full w-3/5 max-w-sm bg-[#0f0c29] shadow-xl flex flex-col"
            >
              {/* Top section with logo + close */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <Link
                  to="/dashboard"
                  className="text-white text-xl font-bold tracking-tight"
                  onClick={closeMobileMenu}
                >
                  Smart<span className="text-indigo-400">Library</span>
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="text-white hover:text-indigo-400 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="flex flex-col gap-2 px-4 py-6 text-white text-base font-medium flex-grow">
                <MobileNavItem to="/dashboard" close={closeMobileMenu} active={location.pathname === "/dashboard"}>
                  Home
                </MobileNavItem>
                <MobileNavItem to="/bookings" close={closeMobileMenu} active={location.pathname === "/bookings"}>
                  Book Seat
                </MobileNavItem>
                <MobileNavItem to="/my-bookings" close={closeMobileMenu} active={location.pathname === "/my-bookings"}>
                  My Bookings
                </MobileNavItem>
                <MobileNavItem to="/renew" close={closeMobileMenu} active={location.pathname === "/renew"}>
                  Renew Booking
                </MobileNavItem>
                <MobileNavItem to="/my-profile" close={closeMobileMenu} active={location.pathname === "/my-profile"}>
                  My Profile
                </MobileNavItem>
              </nav>

              {/* Logout button fixed at bottom */}
              <div className="px-6 py-4 border-t border-white/10">
                <button
                  onClick={() => {
                    handleLogOut();
                    closeMobileMenu();
                  }}
                  className="w-full bg-gradient-to-r from-[#0f172a]  to-[#334155] hover:bg-indigo-700 text-white text-sm px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition shadow"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* Reusable NavItem for desktop */
function NavItem({ to, children, active }) {
  return (
    <Link
      to={to}
      className={`relative transition ${
        active ? "text-indigo-400 font-semibold" : "hover:text-indigo-400"
      }`}
    >
      {children}
      {active && (
        <motion.span
          layoutId="underline"
          className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-400 rounded"
        />
      )}
    </Link>
  );
}

/* Reusable NavItem for mobile */
function MobileNavItem({ to, children, active, close }) {
  return (
    <Link
      to={to}
      onClick={close}
      className={`px-4 py-3 rounded-lg transition ${
        active ? "bg-indigo-600 text-white font-semibold" : "hover:bg-white/10 bg-black"
      }`}
    >
      {children}
    </Link>
  );
}
