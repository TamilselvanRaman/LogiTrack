import React, { useEffect, useState } from "react";
import {
  getAssignedCargoForDriver,
  updateStatus,
  updateLocation,
} from "../../services/cargo.service";

const DriverCargoDashboard = () => {
  const [assigned, setAssigned] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [locationInput, setLocationInput] = useState({});

  const fetchAssigned = async () => {
    try {
      const data = await getAssignedCargoForDriver();
      setAssigned(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch assigned cargo", error);
      setAssigned([]);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    if (!status) return;
    setLoadingId(id);
    try {
      await updateStatus(id, status);
      alert("✅ Status updated");
      fetchAssigned();
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleLocationUpdate = async (id) => {
    const location = locationInput[id];
    if (!location) return;

    setLoadingId(id);
    try {
      await updateLocation(id, location);
      alert("📍 Location updated");
      fetchAssigned();
    } catch (err) {
      alert("Failed to update location");
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const UseCurrentLocation = (id) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
        setLocationInput((prev) => ({
          ...prev,
          [id]: coords,
        }));
      },
      (error) => {
        alert("Failed to get current location.");
        console.error(error);
      }
    );
  };

  return (
    <div className="bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My Assigned Cargo
        </h2>

        {assigned.length === 0 ? (
          <p className="text-gray-500 text-center">No assigned cargo found.</p>
        ) : (
          <div className="space-y-6">
            {assigned.map((cargo) => (
              <div
                key={cargo._id}
                className="bg-gray-100 border border-gray-200 p-6 rounded-lg shadow-sm"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-700">
                    {cargo.content}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Size: <strong>{cargo.size}</strong> | Status:{" "}
                    <span className="font-medium text-blue-600">
                      {cargo.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Location:{" "}
                    <span className="text-gray-800">
                      {cargo.location || "Not updated"}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                  <select
                    defaultValue=""
                    onChange={(e) =>
                      handleStatusUpdate(cargo._id, e.target.value)
                    }
                    disabled={loadingId === cargo._id}
                    className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      Update Status
                    </option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>

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
                    className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={() => handleLocationUpdate(cargo._id)}
                    disabled={loadingId === cargo._id}
                    className={`px-4 py-2 rounded-md text-white font-medium shadow-sm transition ${
                      loadingId === cargo._id
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Update Location
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => UseCurrentLocation(cargo._id)}
                    className="px-3 py-1.5 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white shadow-sm"
                  >
                    Use My Location 📍
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverCargoDashboard;
