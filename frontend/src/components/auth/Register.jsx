import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/auth.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "business",
  });
  const roles = ["business", "driver", "customer"];

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(form);
      toast.success("Registered successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Registration failed.",
        { position: "top-right" }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden font-sans px-4">
      <ToastContainer />

      {/* ✨ Star background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px] z-0"></div>

      {/* ✨ Nebula gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-indigo-900 opacity-90 z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in text-white"
      >
        <h2 className="text-3xl font-bold text-center mb-6 drop-shadow-lg">
          Create your LogiTrack account
        </h2>

        <input
          name="username"
          placeholder="Full Name"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <Listbox
          value={form.role}
          onChange={(value) => setForm({ ...form, role: value })}
        >
          <div className="relative mb-4">
            <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-white/20 py-3 pl-4 pr-10 text-left text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <span className="capitalize">{form.role}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-white"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-black/80 py-1 text-base shadow-lg ring-1 ring-white/20 focus:outline-none z-50">
              {roles.map((role) => (
                <Listbox.Option
                  key={role}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-indigo-600 text-white" : "text-white"
                    }`
                  }
                  value={role}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate capitalize ${selected ? "font-medium" : "font-normal"}`}
                      >
                        {role}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-300">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-md transition duration-300 shadow-lg"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-5 text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>

        <div className="text-center mt-3">
          <Link
            to="/"
            className="text-sm text-gray-300 hover:text-indigo-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
}
