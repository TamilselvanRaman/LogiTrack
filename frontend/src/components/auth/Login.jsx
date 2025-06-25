import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user?.role) {
      const role = user.role.toLowerCase();
      if (role === "business")
        navigate("/business-dashboard", { replace: true });
      else if (role === "driver")
        navigate("/driver-dashboard", { replace: true });
      else if (role === "customer")
        navigate("/customer-dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBackToHome = () => {
    toast.info("Returning to Home...", {
      position: "top-right",
      autoClose: 1200,
      theme: "dark",
    });
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await login(form);

      if (result.token && result.user) {
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });

        const role = result.user.role.toLowerCase();

        setTimeout(() => {
          if (role === "business")
            navigate("/business-dashboard", { replace: true });
          else if (role === "driver")
            navigate("/driver-dashboard", { replace: true });
          else if (role === "customer")
            navigate("/customer-dashboard", { replace: true });
          else navigate("/unauthorized", { replace: true });
        }, 2000);
      } else {
        toast.error("Invalid credentials.", {
          position: "top-right",
          autoClose: 2500,
          theme: "dark",
        });
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Check email and password.", {
        position: "top-right",
        autoClose: 2500,
        theme: "dark",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden font-sans px-4">
      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Galaxy background with stars */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
        {/* Stars */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:15px_15px] animate-star-twinkle pointer-events-none"></div>

        {/* Nebula-ish subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-800/30 via-indigo-900/40 to-black/50 mix-blend-screen animate-nebula-move pointer-events-none"></div>
      </div>

      {/* Login form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in"
      >
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg tracking-wide">
          Welcome to LogiTrack
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-5 px-5 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-5 px-5 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          } text-white font-semibold py-3 rounded-lg transition duration-300 shadow-lg`}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-6 text-white">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Create one
          </Link>
        </p>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleBackToHome}
            className="text-sm text-gray-300 hover:text-indigo-400 hover:underline transition duration-300"
          >
            ← Back to Home
          </button>
        </div>
      </form>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes star-twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-star-twinkle {
          animation: star-twinkle 4s infinite ease-in-out;
        }

        @keyframes nebula-move {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .animate-nebula-move {
          animation: nebula-move 30s ease-in-out infinite;
        }

        @keyframes fade-in {
          from {opacity: 0; transform: translateY(10px);}
          to {opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease forwards;
        }
      `}</style>
    </div>
  );
}
