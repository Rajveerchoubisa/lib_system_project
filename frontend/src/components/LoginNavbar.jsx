import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "./PageWrapper";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
    <PageWrapper>
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-lg border-b border-white/10 text-white"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-wide hover:text-indigo-400 transition"
          onClick={closeMenu}
        >
          📚 SmartLibrary
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <NavItem to="/" active={location.pathname === "/"}>Home</NavItem>
          <NavItem to="/features" active={location.pathname === "/features"}>
            Features
          </NavItem>
          <Link
            to="/login"
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2 rounded-full shadow transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle Menu">
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-black/90 backdrop-blur-lg px-6 pt-4 pb-6 space-y-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <NavItem to="/" active={location.pathname === "/"} onClick={closeMenu}>
              Home
            </NavItem>
            <NavItem to="/features" active={location.pathname === "/features"} onClick={closeMenu}>
              Features
            </NavItem>
            <Link
              to="/login"
              onClick={closeMenu}
              className="block text-center bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2 rounded-full shadow transition"
            >
              Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
    </PageWrapper>
    </>
  );
}

function NavItem({ to, children, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block relative transition ${
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
