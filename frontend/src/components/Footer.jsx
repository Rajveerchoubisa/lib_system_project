import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0f0c29] text-white border-t border-white/10">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-3">📚 SmartLibrary</h2>
          <p className="text-white/70 text-sm">
            Transforming library access for students with smart, hassle-free
            seat booking and on-demand book availability, all in one seamless
            platform.
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://facebook.com/librarysystem"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon icon={<Facebook />} />
            </a>
            <a
              href="https://instagram.com/librarysystem"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon icon={<Instagram />} />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Navigation</h4>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/features">Features</FooterLink>
          <FooterLink to="/register">Create Account</FooterLink>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Resources</h4>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
          <FooterLink to="/terms">Terms of Service</FooterLink>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Contact</h4>
          <p className="text-white/70 text-sm">support@librarysystem.com</p>
          <p className="text-white/70 text-sm">+91-999-999-9999</p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-6" />

      {/* Bottom */}
      <div className="text-center text-sm text-white/50 pb-4 px-2">
        © {new Date().getFullYear()} SmartLibrary. All rights reserved.
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="block text-white/70 text-sm hover:text-white transition mb-2"
    >
      {children}
    </Link>
  );
}

function SocialIcon({ icon }) {
  return (
    <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
      {icon}
    </button>
  );
}
