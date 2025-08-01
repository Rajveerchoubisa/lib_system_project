import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10 text-white"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          📚 SmartLibrary
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/features">Features</NavItem>
          <NavItem to="/contact">Contact</NavItem>
          <Link
            to="/login"
            className="bg-white text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-200 transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <motion.div
          className="md:hidden bg-black/80 backdrop-blur-lg px-6 pb-6 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <NavItem to="/">Home</NavItem>
          <NavItem to="/features">Features</NavItem>
          <NavItem to="/contact">Contact</NavItem>
          <Link
            to="/login"
            className="block bg-white text-black text-center font-semibold px-4 py-2 rounded-full hover:bg-gray-200 transition"
          >
            Login
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}

function NavItem({ to, children }) {
  return (
    <Link
      to={to}
      className="hover:text-indigo-400 transition block"
      onClick={() => window.innerWidth < 768 && window.scrollTo({ top: 0 })}
    >
      {children}
    </Link>
  );
}
