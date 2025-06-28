import React, { useState } from "react";
import {
  FaPlus,
  FaClipboardCheck,
  FaTruckMoving,
  FaSearch,
  FaHome,
} from "react-icons/fa";
import { RiTruckFill } from "react-icons/ri";
import { GiCargoCrate } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import AddCargo from "../cargo/AddCargo";
import AssignCargo from "../cargo/AssignCargo";
import ViewCargoStatus from "../cargo/ViewCargoStatus";
import RequestAccept from "../cargo/RequestAccept";
import { useAuth } from "../../context/AuthContext";

const BusinessDashboard = () => {
  const [activeView, setActiveView] = useState("add");
  const navigate = useNavigate();
  const { user } = useAuth();

  const renderActiveView = () => {
    switch (activeView) {
      case "add":
        return <AddCargo />;
      case "assign":
        return <AssignCargo />;
      case "track":
        return <ViewCargoStatus />;
      case "requests":
        return <RequestAccept />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex flex-col items-center p-6 md:p-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 text-center mb-2">
        Welcome, {user?.username || "Business"}!
      </h1>
      <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">
        Manage and track your cargo with ease.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setActiveView("add")}
          className={`px-6 py-2 rounded-full font-medium flex items-center gap-2 border transition duration-200 ease-in-out shadow-md ${
            activeView === "add"
              ? "bg-blue-600 text-white shadow-lg"
              : "border-blue-600 text-blue-700 hover:bg-violet-100"
          }`}
        >
          <GiCargoCrate /> Cargo Management
        </button>

        <button
          onClick={() => setActiveView("assign")}
          className={`px-6 py-2 rounded-full font-medium flex items-center gap-2 border transition duration-200 ease-in-out shadow-md ${
            activeView === "assign"
              ? "bg-blue-600 text-white shadow-lg"
              : "border-blue-600 text-blue-700 hover:bg-violet-100"
          }`}
        >
          <FaTruckMoving /> Assign Cargo
        </button>

        <button
          onClick={() => setActiveView("requests")}
          className={`px-6 py-2 rounded-full font-medium flex items-center gap-2 border transition duration-200 ease-in-out shadow-md ${
            activeView === "requests"
              ? "bg-blue-600 text-white shadow-lg"
              : "border-blue-600 text-blue-700 hover:bg-violet-100"
          }`}
        >
          <FaClipboardCheck /> Request Accept
        </button>

        <button
          onClick={() => setActiveView("track")}
          className={`px-6 py-2 rounded-full font-medium flex items-center gap-2 border transition duration-200 ease-in-out shadow-md ${
            activeView === "track"
              ? "bg-blue-600 text-white shadow-lg"
              : "border-blue-600 text-blue-700 hover:bg-violet-100"
          }`}
        >
          <FaSearch /> Track Cargo
        </button>
      </div>

      <div className="mt-5 w-full max-w-6xl">
        {renderActiveView()}
      </div>

      <button
        onClick={() => navigate("/")}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <FaHome /> Home
      </button>
    </div>
  );
};

export default BusinessDashboard;
