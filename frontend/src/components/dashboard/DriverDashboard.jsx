import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ManageDeliveries from "../cargo/ManageDeliveries";
import ViewCargoStatus from "../cargo/ViewCargoStatus";
import { FaTruck, FaSearch, FaHome } from "react-icons/fa";

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState("manage");
  const navigate = useNavigate();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "manage":
        return (
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600 border-b border-gray-200 pb-2">
              Manage Assigned Deliveries
            </h3>
            <ManageDeliveries />
          </div>
        );
      case "track":
        return (
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600 border-b border-gray-200 pb-2">
              Track Cargo
            </h3>
            <ViewCargoStatus />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 relative">
      <main className="flex-1 px-4 py-10 sm:px-6 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 mb-10">
          Driver Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderActiveTab()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow md:hidden flex justify-around py-2 border-t z-40">
        <MobileNavIcon
          icon={<FaTruck />}
          label="Deliveries"
          active={activeTab === "manage"}
          onClick={() => setActiveTab("manage")}
        />
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
        className="fixed bottom-16 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm md:hidden"
      >
        <div className="flex items-center gap-2">
          <FaHome />
          Home
        </div>
      </button>

      {/* Back to Home Button - Desktop */}
      <button
        onClick={() => navigate("/")}
        className="hidden md:flex items-center gap-2 fixed bottom-6 left-6 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <FaHome />
        Home
      </button>
    </div>
  );
};

const MobileNavIcon = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center text-xs ${
      active ? "text-blue-600 font-semibold" : "text-gray-600"
    }`}
  >
    <div className="text-lg">{icon}</div>
    {label}
  </button>
);

export default DriverDashboard;
