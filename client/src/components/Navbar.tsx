import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, GraduationCap, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { navLinks } from "../data/content";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 shadow-sm" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-maroon" />
          <span className="font-heading text-xl font-bold text-maroon">EduReach</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-700 dark:text-gray-300 hover:text-maroon dark:hover:text-maroon-light transition-colors duration-200 text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-maroon dark:hover:text-maroon-light transition-colors duration-200"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <span className="text-sm text-gray-400 dark:text-gray-500">|</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm bg-maroon/10 text-maroon px-3 py-1.5 rounded-lg hover:bg-maroon hover:text-white transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm text-maroon font-medium hover:text-maroon-dark transition-colors duration-200">
                Login
              </Link>
              <Link to="/signup" className="text-sm bg-maroon text-white px-4 py-2 rounded-lg hover:bg-maroon-dark transition-colors duration-200">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile right side */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 dark:text-gray-300"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-4 space-y-3 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 dark:text-gray-300 hover:text-maroon transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
              {user ? (
                <div className="space-y-3">
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-maroon font-medium">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-maroon font-medium">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="text-maroon font-medium">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="bg-maroon text-white px-4 py-2 rounded-lg text-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
