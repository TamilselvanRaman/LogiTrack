import React, { useState, useEffect } from "react";
import {
  addCargo,
  getOwnCargo,
  deleteCargoById,
  updateCargoById,
} from "../../services/cargo.service";
import {
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const AddCargo = () => {
  const [cargo, setCargo] = useState({
    name: "",
    type: "",
    size: "",
    weight: "",
    origin: "",
    destination: "",
  });

  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchCargos();
  }, []);

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchCargos = async () => {
    try {
      const data = await getOwnCargo();
      setCargos(data);
    } catch (error) {
      console.error("Failed to fetch cargos:", error);
    }
  };

  const handleChange = (e) => {
    setCargo({ ...cargo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (cargo._id) {
        await updateCargoById(cargo._id, cargo);
        showToast("Cargo updated successfully!", "success");
      } else {
        await addCargo(cargo);
        showToast("Cargo added successfully!", "success");
      }
      setCargo({
        name: "",
        type: "",
        size: "",
        weight: "",
        origin: "",
        destination: "",
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
    setCargo(cargoToEdit);
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
  };

  const getToastIcon = (type) => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="text-white" size={20} />;
      case "error":
        return <FiAlertCircle className="text-white" size={20} />;
      default:
        return <FiInfo className="text-white" size={20} />;
    }
  };

  const inputFields = [
    {
      name: "name",
      label: "Cargo Name",
      placeholder: "e.g., Electronics",
      type: "text",
    },
    {
      name: "type",
      label: "Cargo Type",
      placeholder: "e.g., Fragile",
      type: "text",
    },
    {
      name: "weight",
      label: "Weight (kg)",
      placeholder: "e.g., 25",
      type: "number",
    },
    {
      name: "origin",
      label: "Origin",
      placeholder: "e.g., Mumbai",
      type: "text",
    },
    {
      name: "destination",
      label: "Destination",
      placeholder: "e.g., Delhi",
      type: "text",
    },
  ];

  return (
    <div className="relative px-4 py-10 max-w-6xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`fixed top-6 right-6 px-5 py-3 rounded-lg shadow-lg z-50 text-white text-sm font-medium flex items-center gap-3
            ${
              toast.type === "success"
                ? "bg-green-600"
                : toast.type === "error"
                  ? "bg-rose-600"
                  : "bg-blue-600"
            }`}
          >
            {getToastIcon(toast.type)}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <div className="flex justify-end mb-6 mt-8">
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
            });
          }}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition text-sm font-semibold"
        >
          {showForm ? "Show All Cargos" : "➕ Add New Cargo"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-8">
            {cargo._id ? "Edit Cargo" : "Add New Cargo"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {inputFields.map(({ name, label, placeholder, type }) => (
              <div key={name}>
                <label className="block text-gray-800 font-medium mb-1 text-sm">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={cargo[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                />
              </div>
            ))}

            {/* Size Dropdown */}
            <div>
              <label className="block text-gray-800 font-medium mb-1 text-sm">
                Size
              </label>
              <select
                name="size"
                value={cargo.size}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
              >
                <option value="">Select Size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white text-sm font-semibold rounded-xl transition ${
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

      {/* Cargo Table */}
      {!showForm && (
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
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cargos.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-4 text-gray-400 text-sm"
                  >
                    No cargos available.
                  </td>
                </tr>
              ) : (
                cargos.map((c) => (
                  <tr key={c._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{c.name}</td>
                    <td className="px-4 py-3">{c.type}</td>
                    <td className="px-4 py-3">{c.size}</td>
                    <td className="px-4 py-3">{c.weight}</td>
                    <td className="px-4 py-3">{c.origin}</td>
                    <td className="px-4 py-3">{c.destination}</td>
                    <td className="px-4 py-3 capitalize">
                      {c.status || "Pending"}
                    </td>
                    <td className="px-4 py-3">
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddCargo;
