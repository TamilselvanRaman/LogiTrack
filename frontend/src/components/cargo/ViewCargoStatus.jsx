import React, { useState, useEffect } from "react";
import { trackCargo, getOwnCargo } from "../../services/cargo.service";
import { MapPin, Box, Ruler, BadgeInfo, Truck, Search } from "lucide-react";

// Reverse geocoding using OpenStreetMap
const reverseGeocode = async (lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "LogiTrackApp/1.0 (contact@example.com)",
      },
    });
    const data = await response.json();
    return data.display_name;
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    return "Unknown Location";
  }
};

const ViewCargoStatus = () => {
  const [cargoId, setCargoId] = useState("");
  const [cargo, setCargo] = useState(null);
  const [error, setError] = useState("");
  const [availableCargo, setAvailableCargo] = useState([]);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    fetchCargo();
  }, []);

  const fetchCargo = async () => {
    try {
      const data = await getOwnCargo();
      setAvailableCargo(data);
    } catch (err) {
      console.error("Failed to fetch cargo:", err);
    }
  };

  const handleTrack = async () => {
    try {
      setError("");
      setCargo(null);
      setLocationName("");

      const data = await trackCargo(cargoId.trim());
      if (data?._id) {
        setCargo(data);

        if (data.location) {
          const [lat, lon] = data.location.split(",").map(Number);
          const place = await reverseGeocode(lat, lon);
          setLocationName(place);
        }
      } else {
        throw new Error("Cargo not found");
      }
    } catch (err) {
      setError("Cargo not found or error fetching data.");
      console.error(err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-400";
      case "IN_TRANSIT":
        return "bg-yellow-100 text-yellow-800 border-yellow-400";
      case "PENDING":
        return "bg-gray-100 text-gray-800 border-gray-400";
      default:
        return "bg-red-100 text-red-800 border-red-400";
    }
  };

  const formatStatus = (status) =>
    status?.replace("_", " ").toUpperCase() || "UNKNOWN";

  return (
    <div className=" flex items-center justify-center px-4 py-10 bg-gradient-to-br ">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200">
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-6 flex items-center justify-center gap-2">
         
          Track Your Cargo
           <Truck className="w-10 h-10 mt-2 text-blue-800" />
        </h2>

        <div className="space-y-5">
          <label className="block">
            <span className="text-gray-700 font-medium">Select Cargo</span>
            <select
              value={cargoId}
              onChange={(e) => setCargoId(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="">-- Choose Cargo --</option>
              {availableCargo.map((cargo) => (
                <option key={cargo._id} value={cargo._id}>
                  {cargo.name || cargo.content} (ID: {cargo._id.slice(-4)})
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={handleTrack}
            disabled={!cargoId}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Track Cargo
          </button>

          {error && (
            <p className="text-sm text-red-500 text-center mt-1">{error}</p>
          )}

          {cargo && (
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mt-4 shadow-inner">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Box className="w-5 h-5 text-blue-600" />
                Cargo Details
              </h3>

              <table className="w-full table-auto border-collapse text-gray-700">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-semibold w-1/3 flex items-center gap-2">
                      <BadgeInfo className="w-4 h-4 text-gray-500" />
                      Name/Type:
                    </td>
                    <td className="py-2">{cargo.name || cargo.type}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-gray-500" />
                      Size:
                    </td>
                    <td className="py-2">{cargo.size}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold flex items-center gap-2">
                      <BadgeInfo className="w-4 h-4 text-gray-500" />
                      Status:
                    </td>
                    <td className="py-2">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-semibold border rounded-full ${getStatusStyle(
                          cargo.status
                        )}`}
                      >
                        {formatStatus(cargo.status)}
                      </span>
                    </td>
                  </tr>

                  {cargo.location && (
                    <>
                      <tr className="border-b">
                        <td className="py-2 font-semibold flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          Place:
                        </td>
                        <td className="py-2">
                          {locationName || (
                            <span className="text-gray-400 italic">
                              Loading...
                            </span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="py-4">
                          <div className="border border-gray-300 rounded-lg p-4 flex justify-center items-center bg-gray-100">
                            <a
                              href={`https://www.google.com/maps?q=${cargo.location}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition duration-200"
                            >
                              <MapPin className="w-4 h-4" />
                              View on Google Maps
                            </a>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCargoStatus;
