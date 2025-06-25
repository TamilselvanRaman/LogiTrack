import React from "react";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  const { user } = useAuth();

  const getRedirectPath = () => {
    if (!user?.role) return "/";
    const role = user.role.toLowerCase();
    if (role === "business") return "/business-dashboard";
    if (role === "driver") return "/driver-dashboard";
    if (role === "customer") return "/customer-dashboard";
    return "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden font-sans px-4">
      {/* Star field background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px] z-0" />

      {/* Nebula gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-indigo-900 opacity-90 z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-10 max-w-xl w-full text-center"
        role="alert"
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 1.5 }}
          className="inline-block mb-5"
        >
          <AlertTriangle className="text-red-400 mx-auto drop-shadow-lg" size={56} />
        </motion.div>

        <h2 className="text-4xl font-extrabold text-white mb-3 drop-shadow-lg">
          Access Denied
        </h2>
        <p className="text-gray-200 text-lg mb-6 font-medium">
          You don’t have permission to view this page.
        </p>

        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
          <Link
            to={getRedirectPath()}
            className="inline-block bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 text-white px-6 py-3 rounded-xl text-base font-semibold shadow-lg transition-all duration-200"
          >
            ← Back to Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
