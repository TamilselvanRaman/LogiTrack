import React, { useEffect, useState } from "react";
import {
  getOwnCargo,
  assignCargo,
  getAvailableDrivers,
} from "../../services/cargo.service";

const AssignCargo = () => {
  const [cargos, setCargos] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCargo();
    fetchDrivers();
  }, []);

  const fetchCargo = async () => {
    try {
      const data = await getOwnCargo();
      const unassigned = data.filter((c) => !c.driverId);
      console.log("Unassigned", unassigned);
      setCargos(unassigned);
    } catch (err) {
      console.error("Failed to fetch cargo:", err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const { drivers } = await getAvailableDrivers(); // Make sure response has `drivers` key
      setDrivers(drivers);
    } catch (err) {
      console.log("Failed to fetch drivers:", err);
    }
  };

  const handleAssign = async (cargoId) => {
    if (!selectedDriverId) {
      alert("Please select a driver.");
      return;
    }

    setLoading(true);
    try {
      await assignCargo(cargoId, selectedDriverId);
      alert("✅ Cargo assigned successfully");

      // Update UI
      setCargos((prev) =>
        prev.map((cargo) =>
          cargo._id === cargoId ? { ...cargo, driver: selectedDriverId } : cargo
        )
      );

      setSelectedDriverId(""); // Reset selection
    } catch (err) {
      alert("❌ Failed to assign cargo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" justify-center px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          Assign Cargo to Driver
        </h2>

        <div className="mb-6">
          <label
            htmlFor="driver"
            className="block text-gray-700 mb-2 font-medium"
          >
            Select Driver
          </label>
          <select
            id="driver"
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className="w-full p-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose a Driver --</option>
            {drivers.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver.username}
              </option>
            ))}
          </select>
        </div>

        {cargos.length === 0 ? (
          <p className="text-gray-500 text-center">
            No unassigned cargo found.
          </p>
        ) : (
          <div className="space-y-5">
            {cargos.map((cargo) => {
              const isAssigned = !!cargo.driver;
              return (
                <div
                  key={cargo._id}
                  className="bg-gray-50 border border-gray-200 p-5 rounded-lg shadow-sm flex justify-between items-start"
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {cargo.content}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Size: {cargo.size} | Status:{" "}
                      <span className="font-medium capitalize">
                        {cargo.status}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleAssign(cargo._id)}
                    disabled={loading || isAssigned}
                    className={`px-4 py-2 mt-1 rounded-md font-medium transition-colors ${
                      isAssigned
                        ? "bg-green-400 text-white cursor-not-allowed"
                        : loading
                          ? "bg-blue-300 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isAssigned ? "Assigned" : "Assign"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignCargo;
