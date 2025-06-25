import React, { useEffect, useState } from "react";
import { getAvailableCargo } from "../services/cargo.service";

const AvailableCargoList = () => {
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const data = await getAvailableCargo();
        setCargos(data);
      } catch (error) {
        console.error("Failed to fetch available cargos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCargos();
  }, []);

  if (loading) return <p>Loading available cargos...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Available Cargos</h2>
      {cargos.length === 0 ? (
        <p>No available cargos.</p>
      ) : (
        <ul>
          {cargos.map((cargo) => (
            <li key={cargo._id} className="border p-2 mb-2">
              <strong>Description:</strong> {cargo.description}<br />
              <strong>Origin:</strong> {cargo.origin}<br />
              <strong>Destination:</strong> {cargo.destination}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AvailableCargoList;
