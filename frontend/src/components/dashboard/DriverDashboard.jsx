import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaSearch, FaHome } from "react-icons/fa";
import ManageDeliveries from "../cargo/ManageDeliveries";
import ViewCargoStatus from "../cargo/ViewCargoStatus";
import { useAuth } from "../../context/AuthContext";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("deliveries");
  const { user } = useAuth();

  const renderTabContent = () => {
    switch (activeTab) {
      case "deliveries":
        return <ManageDeliveries />;
      case "track":
        return <ViewCargoStatus />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 font-sans">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2">
          Welcome, {user?.username || "Driver"}!
        </h1>
        <p className="text-gray-600 text-sm">
          Manage and track your deliveries with ease.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <button
          onClick={() => setActiveTab("deliveries")}
          className={`px-6 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
            activeTab === "deliveries"
              ? "bg-blue-600 text-white shadow"
              : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          }`}
        >
          <FaTruck className="inline mr-2 mb-1" />
          My Deliveries
        </button>

        <button
          onClick={() => setActiveTab("track")}
          className={`px-6 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
            activeTab === "track"
              ? "bg-blue-600 text-white shadow"
              : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          }`}
        >
          <FaSearch className="inline mr-2 mb-1" />
          Track Cargo
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-3xl ">{renderTabContent()}</div>

      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
      >
        <FaHome />
        Home
      </button>
    </div>
  );
};

export default DriverDashboard;
