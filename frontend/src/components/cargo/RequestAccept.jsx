import React, { useEffect, useState } from "react";
import {
  getAllCargoRequests,
  acceptCargoRequest,
  rejectCargoRequest,
} from "../../services/cargo.service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await getAllCargoRequests();
      setRequests(res);
    } catch (err) {
      toast.error("Failed to load cargo requests", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      setLoadingId(id);
      await acceptCargoRequest(id);
      toast.success("Request accepted. Cargo created!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      fetchRequests();
    } catch (err) {
      toast.error("Failed to accept request", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setLoadingId(id);
      await rejectCargoRequest(id);
      toast.success("Request rejected and removed.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      fetchRequests();
    } catch (err) {
      toast.error("Failed to reject request", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Pending Cargo Requests
        </h2>

        {requests.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">
            No pending requests.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-600">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Origin → Destination</th>
                  <th className="py-3 px-4 text-left">Size</th>
                  <th className="py-3 px-4 text-left">Weight</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req._id}
                    className="border-t hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-4 py-3 font-medium">{req.name}</td>
                    <td className="px-4 py-3">
                      {req.origin} → {req.destination}
                    </td>
                    <td className="px-4 py-3">{req.size}</td>
                    <td className="px-4 py-3">{req.weight} kg</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleAccept(req._id)}
                        disabled={loadingId === req._id}
                        className={`px-3 py-1.5 rounded-md text-white font-semibold text-sm transition ${
                          loadingId === req._id
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {loadingId === req._id ? "Processing..." : "Accept"}
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        disabled={loadingId === req._id}
                        className={`px-3 py-1.5 rounded-md text-white font-semibold text-sm transition ${
                          loadingId === req._id
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {loadingId === req._id ? "Processing..." : "Reject"}
                      </button>
                    </td>
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

export default RequestList;
