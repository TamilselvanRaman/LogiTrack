import React, { useEffect, useState } from "react";
import {
  getOwnCargo,
  assignCargo,
  getAvailableDrivers,
} from "../../services/cargo.service";
import { toast, Toaster } from "react-hot-toast";
import { User, Truck, Loader2 } from "lucide-react";

const AssignCargo = () => {
  const [cargos, setCargos] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  // const [loading, setLoading] = useState(false);
  const [assigningCargoId, setAssigningCargoId] = useState(null);

  useEffect(() => {
    fetchCargo();
    fetchDrivers();
  }, []);

  const fetchCargo = async () => {
    try {
      const data = await getOwnCargo();
      setCargos(data);
    } catch (err) {
      toast.error("Failed to fetch cargo.");
      console.error("Failed to fetch cargo:", err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const { drivers } = await getAvailableDrivers();
      setDrivers(drivers);
    } catch (err) {
      toast.error("Failed to fetch drivers.");
      console.error("Failed to fetch drivers:", err);
    }
  };

  const DriverAvailable = () => {
    if (drivers.length === 0) {
      toast.error("No drivers available.");
    }
  };

  const isDriverAvailable = (driverId) => {
    const driverCargos = cargos.filter((c) => c.driverId?._id === driverId);
    if (driverCargos.length === 0) return true;
    return driverCargos.every(
      (c) => (c.status || "").toUpperCase() === "DELIVERED"
    );
  };

  const handleAssign = async (cargoId) => {
    if (!selectedDriverId) {
      toast.error("Please select a driver.");
      return;
    }

    if (!isDriverAvailable(selectedDriverId)) {
      toast.error("Driver already has active cargo.");
      return;
    }

    setAssigningCargoId(cargoId);
    try {
      await assignCargo(cargoId, selectedDriverId);
      toast.success("Cargo assigned successfully!");
      await fetchCargo(); // ✅ Refresh cargo
      await fetchDrivers(); // ✅ Refresh driver list
      setSelectedDriverId(""); // Reset selected
    } catch (err) {
      toast.error("Failed to assign cargo.");
      console.error(err);
    } finally {
      setAssigningCargoId(null);
    }
  };

  const unassignedCargos = cargos.filter((c) => !c.driverId);
  const assignedCargos = cargos.filter((c) => c.driverId);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 flex items-center justify-center gap-2 mb-8">
          <Truck className="w-8 h-8" />
          Assign Cargo
        </h1>

        {/* Driver Selector */}
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">
            Select Available Driver
          </label>
          <select
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            onClick={DriverAvailable}
          >
            <option value="">-- Choose a Driver --</option>
            {drivers.map((driver) => {
              const available = isDriverAvailable(driver._id);
              return (
                <option
                  key={driver._id}
                  value={driver._id}
                  disabled={!available}
                >
                  {driver.username} {!available ? "(Unavailable)" : ""}
                </option>
              );
            })}
          </select>
        </div>

        <Toaster
          position="top-right"
        />

        {cargos.length === 0 ? (
          <p className="text-gray-500 text-center">No cargo available.</p>
        ) : (
          <div className="space-y-6">
            {/* Unassigned Cargos */}
            {unassignedCargos.length > 0 && (
              <>
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">
                  🚚 Unassigned Cargos
                </h2>
                {unassignedCargos.map((cargo) => (
                  <div
                    key={cargo._id}
                    className="bg-blue-50 border border-blue-200 p-5 rounded-lg shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-md font-semibold text-blue-900">
                        {cargo.name}
                      </h3>
                      <p className="text-sm text-gray-700 mt-1">
                        Size: <span className="font-medium">{cargo.size}</span>{" "}
                        | Status:{" "}
                        <span className="text-yellow-700 font-medium capitalize">
                          {cargo.status || "Pending"}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleAssign(cargo._id)}
                      disabled={assigningCargoId === cargo._id}
                      className={`px-5 py-2 rounded-lg text-white font-medium flex items-center gap-2 ${
                        assigningCargoId === cargo._id
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {assigningCargoId === cargo._id ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      Assign
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* Already Assigned */}
            {assignedCargos.length > 0 && (
              <>
                <h2 className="text-lg font-semibold text-gray-800 mt-10 border-b pb-1">
                  ✅ Already Assigned
                </h2>
                {assignedCargos.map((cargo) => (
                  <div
                    key={cargo._id}
                    className="bg-gray-50 border border-gray-200 p-5 rounded-lg flex justify-between items-center opacity-90"
                  >
                    <div>
                      <h3 className="text-md font-semibold text-gray-800">
                        {cargo.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Size: <span className="font-medium">{cargo.size}</span>{" "}
                        | Status:{" "}
                        <span className="font-semibold capitalize">
                          {cargo.status}
                        </span>
                      </p>
                    </div>
                    <span className="px-4 py-1 rounded-full bg-green-400 text-white font-medium text-sm">
                      Assigned
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignCargo;
