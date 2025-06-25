import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="bg-white/40 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50 transition-all duration-300"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-tight text-blue-600 hover:scale-105 transition-transform duration-300"
        >
          Logi<span className="text-gray-900">Track</span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <div className="flex items-center gap-2 text-gray-800">
                <FaUserCircle className="text-blue-600 text-2xl drop-shadow-sm" />
                <span className="text-base font-semibold capitalize">
                  {user?.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all duration-200 shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 text-base font-medium hover:text-blue-600 transition-transform hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
