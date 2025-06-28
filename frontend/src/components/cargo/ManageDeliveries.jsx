import React, { useEffect, useState } from "react";
import {
  getAssignedCargoForDriver,
  updateStatus,
  updateLocation,
} from "../../services/cargo.service";
import { FaMapMarkerAlt, FaTruckMoving } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

const DriverCargoDashboard = () => {
  const [assigned, setAssigned] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [locationInput, setLocationInput] = useState({});
  const [statusInput, setStatusInput] = useState({});

  useEffect(() => {
    fetchAssigned();
  }, []);

  const fetchAssigned = async () => {
    try {
      const data = await getAssignedCargoForDriver();
      setAssigned(Array.isArray(data) ? data : []);

      // Prefill existing location and status
      const initialLocations = {};
      const initialStatuses = {};
      data.forEach((cargo) => {
        initialLocations[cargo._id] = cargo.location || "";
        initialStatuses[cargo._id] = cargo.status || "";
      });
      setLocationInput(initialLocations);
      setStatusInput(initialStatuses);
    } catch (err) {
      toast.error("Failed to fetch assigned cargos");
      console.error(err);
      setAssigned([]);
    }
  };

  const handleUpdateBoth = async (id) => {
    const location = locationInput[id];
    const status = statusInput[id];

    if (!status) {
      toast.error("Please select a status");
      return;
    }

    if (!location) {
      toast.error("Please enter a location");
      return;
    }

    setLoadingId(id);
    try {
      await Promise.all([
        updateStatus(id, status),
        updateLocation(id, location),
      ]);
      toast.success("Status & Location updated");
      fetchAssigned();
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleGetLocationClick = async (id) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const placeName = await reverseGeocode(lat, lon);
        setLocationInput((prev) => ({
          ...prev,
          [id]: placeName,
        }));

        toast.success("Location fetched");
      },
      (error) => {
        toast.error("Failed to get current location");
        console.error(error);
      }
    );
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return data.display_name || `${lat}, ${lon}`;
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return `${lat}, ${lon}`;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-200 text-green-800";
      case "IN_TRANSIT":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const delivered = assigned.filter((c) => c.status === "DELIVERED");
  const notDelivered = assigned.filter((c) => c.status !== "DELIVERED");

  return (
    <div className="min-h-screen px-4 flex flex-col items-center">
      <Toaster position="top-right" />
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-8 text-center flex items-center justify-center gap-3">
          My Assigned Cargo
        </h2>

        {notDelivered.length === 0 ? (
          <p className="text-gray-500 text-center">No assigned cargo found.</p>
        ) : (
          <div className="space-y-6">
            {notDelivered.map((cargo) => {
              const isDelivered = cargo.status === "DELIVERED";
              return (
                <div
                  key={cargo._id}
                  className="bg-gray-100 border border-gray-200 p-6 rounded-xl shadow-sm"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {cargo.name || "Untitled Cargo"}
                    </h3>
                    <div className="text-sm text-gray-700 mt-1 flex flex-wrap gap-2">
                      <span>
                        Size: <strong>{cargo.size}</strong>
                      </span>
                      <span>
                        Status:{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(cargo.status)}`}
                        >
                          {cargo.status}
                        </span>
                      </span>
                      <span>
                        Location:{" "}
                        <span className="text-gray-800 font-medium">
                          {cargo.location || "Not updated"}
                        </span>
                      </span>
                    </div>
                    {isDelivered && (
                      <p className="text-xs text-green-700 mt-1">
                        ✅ Delivered — Update disabled.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <select
                      value={statusInput[cargo._id] || ""}
                      onChange={(e) =>
                        setStatusInput({
                          ...statusInput,
                          [cargo._id]: e.target.value,
                        })
                      }
                      disabled={loadingId === cargo._id || isDelivered}
                      className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Status</option>
                      <option value="IN_TRANSIT">In Transit</option>
                      <option value="DELIVERED">Delivered</option>
                    </select>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter current location"
                        value={locationInput[cargo._id] || ""}
                        onChange={(e) =>
                          setLocationInput({
                            ...locationInput,
                            [cargo._id]: e.target.value,
                          })
                        }
                        disabled={isDelivered}
                        className="bg-white w-full border border-gray-300 rounded-md pl-4 pr-10 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleGetLocationClick(cargo._id)}
                        disabled={loadingId === cargo._id || isDelivered}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 text-lg"
                        title="Use My Location"
                      >
                        <FaMapMarkerAlt />
                      </button>
                    </div>

                    <button
                      onClick={() => handleUpdateBoth(cargo._id)}
                      disabled={
                        loadingId === cargo._id ||
                        isDelivered ||
                        !statusInput[cargo._id] ||
                        !locationInput[cargo._id]
                      }
                      className={`px-4 py-2 rounded-md text-sm text-white font-semibold shadow-sm transition ${
                        loadingId === cargo._id || isDelivered
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      Update
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {delivered.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-blue-700 mb-4">
              Delivered Cargo
            </h3>
            <table className="min-w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-blue-50 text-blue-800">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                {delivered.map((cargo) => (
                  <tr key={cargo._id} className="border-t">
                    <td className="px-4 py-2">{cargo.name}</td>
                    <td className="px-4 py-2">{cargo.size}</td>
                    <td className="px-4 py-2">{cargo.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverCargoDashboard;
