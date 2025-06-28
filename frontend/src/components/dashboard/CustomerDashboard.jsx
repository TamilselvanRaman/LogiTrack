// Updated `CustomerDashboard.jsx`

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FaSearch,
  FaHome,
  FaPlusCircle,
  FaClipboardList,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ViewCargoStatus from "../cargo/ViewCargoStatus";
import {
  addCargoRequest,
  getAllCargoRequests,
  deleteCargoRequest,
  updateCargoRequest,
} from "../../services/customer.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("track");
  const [editId, setEditId] = useState(null);

  const [cargo, setCargo] = useState({
    name: "",
    type: "",
    weight: "",
    origin: "",
    destination: "",
    size: "",
    deliveryDate: new Date(),
    customerId: user?.uid || "",
  });

  const [requestList, setRequestList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCargo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...cargo, customerId: user?.uid };
      if (editId) {
        await updateCargoRequest(editId, payload);
        toast.success("Request updated successfully", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      } else {
        await addCargoRequest(payload);
        toast.success("Cargo Request Submitted Successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }

      setCargo({
        name: "",
        type: "",
        weight: "",
        origin: "",
        destination: "",
        size: "",
        deliveryDate: new Date(),
        customerId: user?.uid || "",
      });
      setEditId(null);
      fetchRequests();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to submit cargo request.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await getAllCargoRequests(user?.uid);
      setRequestList(res);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      await deleteCargoRequest(id);
      toast.success("Request deleted.", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      fetchRequests();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete request.", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const handleEditRequest = (request) => {
    setCargo({ ...request });
    setEditId(request._id);
    setActiveTab("request");
  };

  useEffect(() => {
    if (activeTab === "requests") {
      fetchRequests();
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative">
      <header className="text-center py-8">
        <h1 className="text-3xl font-bold text-blue-700">
          Welcome, {user?.username || "Customer"}!
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Manage and track your cargo with ease.
        </p>
      </header>

      {/* Tabs */}
      <div className="hidden md:flex justify-center gap-6 mb-6">
        <TabButton
          label="Track Cargo"
          icon={<FaSearch />}
          active={activeTab === "track"}
          onClick={() => setActiveTab("track")}
        />
        <TabButton
          label="Request Cargo"
          icon={<FaPlusCircle />}
          active={activeTab === "request"}
          onClick={() => setActiveTab("request")}
        />
        <TabButton
          label="Request Checking"
          icon={<FaClipboardList />}
          active={activeTab === "requests"}
          onClick={() => setActiveTab("requests")}
        />
      </div>

      <main className="flex-1 px-4 sm:px-6 max-w-4xl mx-auto w-full mb-24 md:mb-0">
        {activeTab === "track" && <ViewCargoStatus />}

        {activeTab === "request" && (
          <Section title="Request New Cargo" icon={<FaPlusCircle />}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {["name", "type", "weight", "origin", "destination"].map(
                (field) => (
                  <div key={field}>
                    <label className="block text-gray-700 font-medium mb-1 text-sm capitalize">
                      {field}
                    </label>
                    <input
                      type={field === "weight" ? "number" : "text"}
                      name={field}
                      value={cargo[field]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                )
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Size
                </label>
                <select
                  name="size"
                  value={cargo.size}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select Size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Delivery Date
                </label>
                <div className="max-w-sm bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl shadow-xl p-6">
                  <Calendar
                    onChange={(date) =>
                      setCargo((prev) => ({ ...prev, deliveryDate: date }))
                    }
                    value={new Date(cargo.deliveryDate)}
                    minDate={new Date()}
                    className="!w-full !text-sm !border-none focus:outline-none"
                    prevLabel="←"
                    nextLabel="→"
                    prev2Label={null}
                    next2Label={null}
                    tileDisabled={({ date }) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    tileClassName={({ date, view }) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const isSelected =
                        view === "month" &&
                        date.toDateString() ===
                          new Date(cargo.deliveryDate).toDateString();
                      const isPast = date < today;

                      return `
                        ${isSelected ? "bg-blue-600 text-white font-semibold shadow-md" : ""}
                        ${!isSelected && !isPast ? "hover:bg-blue-100 transition-all duration-200" : ""}
                        ${isPast ? "text-gray-400 line-through opacity-40 cursor-not-allowed" : "text-gray-700"}
                        rounded-full px-2 py-1
                      `;
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white font-semibold rounded-xl transition shadow ${
                  loading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading
                  ? "Processing..."
                  : editId
                    ? "Update Request"
                    : "Request Cargo"}
              </button>
            </form>
          </Section>
        )}

        {activeTab === "requests" && (
          <>
            <Section title="Pending Requests" icon={<FaClipboardList />}>
              {requestList.filter((r) => r.status === "PENDING").length ===
              0 ? (
                <p className="text-center text-gray-500 text-sm">
                  No pending requests.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg shadow border border-blue-100">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-blue-50 text-xs uppercase text-blue-600 border-b">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Route</th>
                        <th className="px-4 py-3">Size</th>
                        <th className="px-4 py-3">Weight</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requestList
                        .filter((r) => r.status === "PENDING")
                        .map((r) => (
                          <tr key={r._id} className="border-t hover:bg-blue-50">
                            <td className="px-4 py-3 font-medium">{r.name}</td>
                            <td className="px-4 py-3">
                              {r.origin} → {r.destination}
                            </td>
                            <td className="px-4 py-3">{r.size}</td>
                            <td className="px-4 py-3">{r.weight} kg</td>
                            <td className="px-4 py-3">
                              {new Date(r.deliveryDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 text-xs font-semibold rounded-full">
                                {r.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex justify-center gap-3 text-lg">
                                <button
                                  onClick={() => handleEditRequest(r)}
                                  title="Edit"
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteRequest(r._id)}
                                  title="Delete"
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>

            <Section title="Rejected Requests" icon={<FaClipboardList />}>
              {requestList.filter((r) => r.status === "REJECTED").length ===
              0 ? (
                <p className="text-center text-gray-500 text-sm">
                  No rejected requests.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg shadow border border-blue-100">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-blue-50 text-xs uppercase text-blue-600 border-b">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Route</th>
                        <th className="px-4 py-3">Size</th>
                        <th className="px-4 py-3">Weight</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requestList
                        .filter((r) => r.status === "REJECTED")
                        .map((r) => (
                          <tr key={r._id} className="border-t hover:bg-blue-50">
                            <td className="px-4 py-3 font-medium">{r.name}</td>
                            <td className="px-4 py-3">
                              {r.origin} → {r.destination}
                            </td>
                            <td className="px-4 py-3">{r.size}</td>
                            <td className="px-4 py-3">{r.weight} kg</td>
                            <td className="px-4 py-3">
                              {new Date(r.deliveryDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <span className="bg-red-100 text-red-700 px-2 py-1 text-xs font-semibold rounded-full">
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md md:hidden flex justify-around py-2 border-t z-40">
        <MobileNavIcon
          icon={<FaSearch />}
          label="Track"
          active={activeTab === "track"}
          onClick={() => setActiveTab("track")}
        />
        <MobileNavIcon
          icon={<FaPlusCircle />}
          label="Request"
          active={activeTab === "request"}
          onClick={() => setActiveTab("request")}
        />
        <MobileNavIcon
          icon={<FaClipboardList />}
          label="Requests"
          active={activeTab === "requests"}
          onClick={() => setActiveTab("requests")}
        />
      </nav>

      <button
        onClick={() => navigate("/")}
        className="fixed bottom-16 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-md text-sm md:hidden"
      >
        <div className="flex items-center gap-2">
          <FaHome />
          Home
        </div>
      </button>

      <button
        onClick={() => navigate("/")}
        className="hidden md:flex items-center gap-2 fixed bottom-6 left-6 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition"
      >
        <FaHome />
        Home
      </button>

      <ToastContainer />
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <section className="bg-white rounded-xl p-6 shadow border border-blue-100 mb-6">
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xl text-blue-600">{icon}</span>
      <h2 className="text-lg font-semibold text-blue-700">{title}</h2>
    </div>
    {children}
  </section>
);

const TabButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2 rounded-full border transition text-sm ${
      active
        ? "bg-blue-600 text-white shadow"
        : "bg-white text-blue-600 hover:bg-blue-100 border-blue-200"
    }`}
  >
    {icon}
    {label}
  </button>
);

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

export default CustomerDashboard;
