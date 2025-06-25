import React, { useState } from "react";
import { FaPlus, FaTruckMoving, FaSearch, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddCargo from "../cargo/AddCargo";
import AssignCargo from "../cargo/AssignCargo";
import ViewCargoStatus from "../cargo/ViewCargoStatus";

const BusinessDashboard = () => {
  const [activeView, setActiveView] = useState("add");
  const navigate = useNavigate();

  const renderActiveView = () => {
    switch (activeView) {
      case "add":
        return <AddCargo />;
      case "assign":
        return <AssignCargo />;
      case "track":
        return <ViewCargoStatus />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 relative">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block fixed top-0 left-0 h-screen z-40">
        <h2 className="text-2xl mt-20 font-bold text-blue-700 mb-8 text-center -ml-1">
          Business Panel
        </h2>
        <nav className="flex flex-col gap-4">
          <SidebarButton
            icon={<FaPlus />}
            label="Add Cargo"
            isActive={activeView === "add"}
            onClick={() => setActiveView("add")}
          />
          <SidebarButton
            icon={<FaTruckMoving />}
            label="Assign Cargo"
            isActive={activeView === "assign"}
            onClick={() => setActiveView("assign")}
          />
          <SidebarButton
            icon={<FaSearch />}
            label="Track Cargo"
            isActive={activeView === "track"}
            onClick={() => setActiveView("track")}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-6 overflow-y-auto">
        <div className="w-full max-w-7xl mx-auto min-h-screen">
          {/* <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {activeView === "add"
              ? "Add Cargo"
              : activeView === "assign"
                ? "Assign Cargo"
                : "Track Cargo"}
          </h1> */}

          <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
            {renderActiveView()}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md md:hidden flex justify-around py-2 border-t z-40">
        <NavIcon
          icon={<FaPlus />}
          label="Add"
          active={activeView === "add"}
          onClick={() => setActiveView("add")}
        />
        <NavIcon
          icon={<FaTruckMoving />}
          label="Assign"
          active={activeView === "assign"}
          onClick={() => setActiveView("assign")}
        />
        <NavIcon
          icon={<FaSearch />}
          label="Track"
          active={activeView === "track"}
          onClick={() => setActiveView("track")}
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

const SidebarButton = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-lg transition ${
      isActive
        ? "bg-blue-100 text-blue-700 font-semibold shadow"
        : "text-gray-700 hover:bg-blue-50"
    }`}
  >
    {icon}
    {label}
  </button>
);

const NavIcon = ({ icon, label, active, onClick }) => (
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

export default BusinessDashboard;
