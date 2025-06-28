import React, { useState, useEffect } from "react";
import {
  addCargo,
  getOwnCargo,
  deleteCargoById,
  updateCargoById,
} from "../../services/cargo.service";
import { getCustomers } from "../../services/customer.service";
import {
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AddCargo = () => {
  const [cargo, setCargo] = useState({
    name: "",
    type: "",
    size: "",
    weight: "",
    origin: "",
    destination: "",
    deliveryDate: null,
    businessId: "",
    customerId: "",
    status: "PENDING",
  });

  const [cargos, setCargos] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchCargos();
    fetchCustomers();
  }, []);

  const fetchCargos = async () => {
    try {
      const data = await getOwnCargo();
      setCargos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch cargos:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  const handleChange = (e) => {
    setCargo({ ...cargo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user")); // or use auth context
      const payload = {
        ...cargo,
        deliveryDate: cargo.deliveryDate
          ? new Date(cargo.deliveryDate).toISOString()
          : null,
        businessId: user._id, // ✅ ensure businessId is included
      };

      if (!payload.customerId) {
        showToast("Please select a customer.", "error");
        setLoading(false);
        return;
      }

      if (cargo._id) {
        await updateCargoById(cargo._id, payload);
        showToast("Cargo updated successfully!", "success");
      } else {
        await addCargo(payload);
        showToast("Cargo added successfully!", "success");
      }

      setCargo({
        name: "",
        type: "",
        size: "",
        weight: "",
        origin: "",
        destination: "",
        deliveryDate: null,
        businessId: "",
        customerId: "",
        status: "PENDING",
      });
      setShowForm(false);
      fetchCargos();
    } catch (error) {
      console.error("Error saving cargo:", error);
      showToast("Failed to save cargo.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cargoToEdit) => {
    setCargo({
      ...cargoToEdit,
      deliveryDate: cargoToEdit.deliveryDate
        ? new Date(cargoToEdit.deliveryDate)
        : null,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cargo?")) return;
    setLoading(true);
    try {
      await deleteCargoById(id);
      showToast("Cargo deleted successfully!", "error");
      fetchCargos();
    } catch (error) {
      console.error("Delete error:", error);
      showToast("Failed to delete cargo.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const filteredCargos = (status) =>
    cargos.filter((c) => (c.status?.toUpperCase() || "PENDING") === status);

  const renderTable = (title, list) => (
    <div className="mb-10">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-left">Weight</th>
              <th className="px-4 py-3 text-left">Origin</th>
              <th className="px-4 py-3 text-left">Destination</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Delivery Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="text-center py-4 text-gray-400 text-sm"
                >
                  No cargos found.
                </td>
              </tr>
            ) : (
              list.map((c) => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.type}</td>
                  <td className="px-4 py-3">{c.size}</td>
                  <td className="px-4 py-3">{c.weight}</td>
                  <td className="px-4 py-3">{c.origin}</td>
                  <td className="px-4 py-3">{c.destination}</td>
                  <td className="px-4 py-3">{c.customerId?.username || "—"}</td>
                  <td className="px-4 py-3">
                    {c.deliveryDate
                      ? new Date(c.deliveryDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{c.status}</td>
                  <td className="px-4 py-3">
                    {c.status === "DELIVERED" ? (
                      <span className="text-green-600 font-semibold">
                        Delivered
                      </span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(c)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full transition"
                          title="Edit"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="relative mt-5 max-w-6xl mx-auto bg-white shadow-xl rounded-xl px-15 py-5">
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className={`fixed top-[4.5rem] mt-5 right-10 px-5 py-3 rounded-lg shadow-lg z-50 text-white text-sm font-medium flex items-center gap-3
        ${toast.type === "success" ? "bg-green-600" : toast.type === "error" ? "bg-rose-600" : "bg-blue-600"}`}
          >
            {toast.type === "success" ? (
              <FiCheckCircle />
            ) : toast.type === "error" ? (
              <FiAlertCircle />
            ) : (
              <FiInfo />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end  mt-8">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setCargo({
              name: "",
              type: "",
              size: "",
              weight: "",
              origin: "",
              destination: "",
              deliveryDate: null,
              status: "PENDING",
            });
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition text-sm font-semibold mb-8"
        >
          {showForm ? "Show All Cargos" : "Add New Cargo"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 transition-all duration-300">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-8">
            {cargo._id ? "Edit Cargo" : "Add New Cargo"}
          </h2>

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
                    className="w-full px-4 py-2 text-base border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:bg-gray-50"
                  />
                </div>
              )
            )}

            {/* Size Selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Size
              </label>
              <select
                name="size"
                value={cargo.size}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 text-base border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:bg-gray-50"
              >
                <option value="">Select Size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Customer
              </label>
              <select
                name="customerId"
                value={cargo.customerId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 text-base border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:bg-gray-50"
              >
                <option value="">Select Customer</option>
                {customers.map((cust) => (
                  <option key={cust._id} value={cust._id}>
                    {cust.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Date Calendar */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Delivery Date
              </label>
              <div className="bg-white rounded-md border border-gray-300 p-4 max-w-sm shadow-sm">
                <Calendar
                  onChange={(date) =>
                    setCargo({ ...cargo, deliveryDate: date })
                  }
                  value={cargo.deliveryDate}
                  minDate={new Date()}
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
                ${
                  !isSelected && !isPast
                    ? "hover:bg-blue-100 transition-all duration-200"
                    : ""
                }
                ${
                  isPast
                    ? "text-gray-400 line-through opacity-40 cursor-not-allowed"
                    : "text-gray-700"
                }
                rounded-full px-2 py-1
              `;
                  }}
                  tileDisabled={({ date }) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  className="text-sm w-full"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white text-sm font-semibold rounded-xl shadow transition duration-200 ${
                  loading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading
                  ? "Processing..."
                  : cargo._id
                    ? "Update Cargo"
                    : "Add Cargo"}
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <>
          {renderTable("Pending Cargos", filteredCargos("PENDING"))}
          {renderTable("In-Transit Cargos", filteredCargos("IN_TRANSIT"))}
          {renderTable("Delivered Cargos", filteredCargos("DELIVERED"))}
        </>
      )}
    </div>
  );
};

export default AddCargo;
