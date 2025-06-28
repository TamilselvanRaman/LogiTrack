import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className="bg-white/40 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50 transition-all duration-300"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-600 hover:scale-105 transition-transform duration-300"
          onClick={closeMenu}
        >
          Logi<span className="text-gray-900">Track</span>
        </Link>

        {/* Hamburger menu (mobile) */}
        <div
          className="md:hidden text-2xl text-blue-700 cursor-pointer"
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Right Menu Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <div
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 text-gray-800 hover:text-blue-600 cursor-pointer transition"
              >
                <FaUserCircle className="text-blue-600 text-2xl" />
                <span className="text-base font-semibold capitalize">
                  {user?.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 active:scale-95 transition duration-200 shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 text-base font-medium hover:text-blue-600 transition hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 active:scale-95 transition duration-200 shadow-md"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 pt-2 pb-4 space-y-3">
          {user ? (
            <>
              <div
                onClick={() => {
                  navigate("/profile");
                  closeMenu();
                }}
                className="flex items-center gap-2 text-gray-800 hover:text-blue-600 cursor-pointer transition"
              >
                <FaUserCircle className="text-blue-600 text-xl" />
                <span className="text-base font-semibold capitalize">
                  {user?.username}
                </span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="w-full py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block text-gray-700 font-medium hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
