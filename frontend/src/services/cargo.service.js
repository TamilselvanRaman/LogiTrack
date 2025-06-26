import http from "./http.service";

// 1. Add new cargo (Business role)
export const addCargo = async (cargoData) => {
  const res = await http.post("/cargos", cargoData);
  return res.data;
};

// 2. Get available drivers (for assignment)
export const getAvailableDrivers = async () => {
  const res = await http.get("/cargos/available-driver");
  return res.data;
};

// 3. Get cargos created by the current business user
export const getOwnCargo = async () => {
  const res = await http.get("/cargos/business");
  return res.data;
};

// 4. Assign cargo to a specific driver
export const assignCargo = async (cargoId, driverId) => {
  const res = await http.post(`/cargos/${cargoId}/assign`, { driverId });
  return res.data;
};

// 5. Get all cargos (admin or for listing)
export const getAllCargos = async () => {
  const res = await http.get("/cargos");
  return res.data;
};

// 6. Delete a cargo by ID
export const deleteCargoById = async (cargoId) => {
  const res = await http.delete(`/cargos/${cargoId}`);
  return res.data;
};

export const updateCargoById = async (cargoId, updatedData) => {
  const res = await http.put(`/cargos/${cargoId}`, updatedData);
  return res.data;
};

// 7. Alias assignCargoToDriver for easier naming in frontend
export const assignCargoToDriver = async (cargoId, driverId) => {
  const res = await http.post(`/cargos/${cargoId}/assign`, { driverId });
  return res.data;
};

// 8. Get cargos available for drivers to accept
export const getAvailableCargo = async () => {
  const res = await http.get("/cargos/available");
  return res.data;
};

// 9. Driver accepts a cargo
export const acceptCargo = async (cargoId) => {
  const res = await http.post(`/cargos/${cargoId}/accept`);
  return res.data;
};

// 10. Update status of a cargo (e.g., In Transit, Delivered)
export const updateStatus = async (cargoId, status) => {
  const res = await http.patch(`/cargos/${cargoId}/status`, { status });
  return res.data;
};

// 11. Update real-time location of a cargo
export const updateLocation = async (cargoId, location) => {
  const res = await http.patch(`/cargos/${cargoId}/location`, { location });
  return res.data;
};

// 12. Track a cargo by ID
export const trackCargo = async (cargoId) => {
  const res = await http.get(`/cargos/${cargoId}`);
  return res.data;
};

// 13. Get cargos assigned to the currently logged-in driver
export const getAssignedCargoForDriver = async () => {
  const res = await http.get("/cargos/assigned");
  return res.data;
};
