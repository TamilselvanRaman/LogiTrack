import http from "./http.service";

// Add new cargo (Business role)
export const addCargo = async (cargoData) => {
  const res = await http.post("/cargos", cargoData);
  return res.data;
};

export const getAvailableDrivers = async () => {
  const res = await http.get("cargos/available-driver");
  return res.data;
};

// Get cargos created by current business user
export const getOwnCargo = async () => {
  const res = await http.get("/cargos/business");
  return res.data;
};

// Assign cargo to a driver
export const assignCargo = async (cargoId, driverId) => {
  const res = await http.post(`/cargos/${cargoId}/assign`, { driverId });
  return res.data;
};

// Get all available cargo (Driver role)
export const getAvailableCargo = async () => {
  const res = await http.get("/cargos/available");
  return res.data;
};

// Accept a cargo (Driver role)
export const acceptCargo = async (cargoId) => {
  const res = await http.post(`/cargos/${cargoId}/accept`);
  return res.data;
};

// Update cargo status
export const updateStatus = async (cargoId, status) => {
  const res = await http.patch(`/cargos/${cargoId}/status`, { status });
  return res.data;
};

// Update cargo location
export const updateLocation = async (cargoId, location) => {
  const res = await http.patch(`/cargos/${cargoId}/location`, { location });
  return res.data;
};

// Track cargo
export const trackCargo = async (cargoId) => {
  const res = await http.get(`/cargos/${cargoId}`);
  return res.data;
};

// Get assigned cargos for logged-in driver
export const getAssignedCargoForDriver = async () => {
  const res = await http.get("/cargos/assigned");
  return res.data;
};
