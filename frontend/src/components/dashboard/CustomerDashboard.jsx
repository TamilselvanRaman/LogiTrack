import React, { useState } from "react";
import ViewCargoStatus from "../cargo/ViewCargoStatus";
import { useAuth } from "../../context/AuthContext";
import { FaBoxOpen, FaSearch, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("track");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative">
      <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 tracking-tight">
            Welcome, {user?.username || "Customer"}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Here’s your personalized dashboard to track cargo in real time.
          </p>
        </header>

        {/* Active Tab Content */}
        {activeTab === "track" && (
          <section className="bg-white shadow-md rounded-xl p-6 sm:p-8 transition hover:shadow-lg border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <FaBoxOpen className="text-indigo-600 text-xl" />
              <h2 className="text-lg sm:text-xl font-semibold text-indigo-700">
                Track Your Cargo
              </h2>
            </div>
            <ViewCargoStatus />
          </section>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow md:hidden flex justify-around py-2 border-t z-40">
        <MobileNavIcon
          icon={<FaSearch />}
          label="Track"
          active={activeTab === "track"}
          onClick={() => setActiveTab("track")}
        />
      </nav>

      {/* Back to Home Button - Mobile */}
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-16 left-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg text-sm md:hidden"
      >
        <div className="flex items-center gap-2">
          <FaHome />
          Home
        </div>
      </button>

      {/* Back to Home Button - Desktop */}
      <button
        onClick={() => navigate("/")}
        className="hidden md:flex items-center gap-2 fixed bottom-6 left-6 z-50 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition"
      >
        <FaHome />
        Back to Home
      </button>
    </div>
  );
};

const MobileNavIcon = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center text-xs ${
      active ? "text-indigo-600 font-semibold" : "text-gray-600"
    }`}
  >
    <div className="text-lg">{icon}</div>
    {label}
  </button>
);

export default CustomerDashboard;
