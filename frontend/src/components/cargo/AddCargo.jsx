import React, { useState } from "react";
import { addCargo } from "../../services/cargo.service";

const AddCargo = () => {
  const [cargo, setCargo] = useState({
    name: "",
    type: "",
    size: "",
    weight: "",
    origin: "",
    destination: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCargo({ ...cargo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(cargo);
      await addCargo(cargo);
      alert("✅ Cargo added successfully!");
      setCargo({
        name: "",
        type: "",
        size: "",
        weight: "",
        origin: "",
        destination: "",
      });
    } catch (error) {
      console.error("Error adding cargo:", error);
      alert(" Failed to add cargo.");
    } finally {
      setLoading(false);
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
      placeholder: "e.g., Fragile, Perishable",
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
    <div className="flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">
          Add New Cargo
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {inputFields.map(({ name, label, placeholder, type }) => (
            <div key={name}>
              <label className="block text-gray-700 font-medium mb-1">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={cargo[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-700 font-medium mb-1">Size</label>
            <select
              name="size"
              value={cargo.size}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white shadow-sm transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Adding Cargo..." : "Add Cargo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCargo;
