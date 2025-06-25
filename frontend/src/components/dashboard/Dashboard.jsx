import React from "react";
import { useAuth } from "../../context/AuthContext";
import BusinessDashboard from "./BusinessDashboard";
import DriverDashboard from "./DriverDashboard";
import CustomerDashboard from "./CustomerDashboard";
import Unauthorized from "../../pages/Unauthorized";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const role = user?.role?.toLowerCase();

  if (!role) {
    logout();
    return (
      <div>
        {/* Session expired. <a href="/login" className="text-blue-500">Login again</a> */}
        <Unauthorized/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {role === "business" && <BusinessDashboard />}
      {role === "driver" && <DriverDashboard />}
      {role === "customer" && <CustomerDashboard />}
    </div>
  );
};

export default Dashboard;
