// services/cargo.service.js
import http from "./http.service";
const USER_URL = "/user";

//  Add new cargo
export const addCargo = async (cargoData) => {
  const res = await http.post("/cargos", cargoData);
  return res.data;
};

//  Get all available drivers
export const getAvailableDrivers = async () => {
  const res = await http.get("/cargos/available-driver");
  return res.data;
};

//  Get cargos added by logged-in business user
export const getOwnCargo = async () => {
  const res = await http.get("/cargos/business");
  return res.data;
};

//  Assign cargo to driver
export const assignCargo = async (cargoId, driverId) => {
  const res = await http.post(`/cargos/${cargoId}/assign`, { driverId });
  return res.data;
};

//  Delete cargo by ID
export const deleteCargoById = async (cargoId) => {
  const res = await http.delete(`/cargos/${cargoId}`);
  return res.data;
};

//  Update cargo by ID
export const updateCargoById = async (cargoId, updatedData) => {
  const res = await http.put(`/cargos/${cargoId}`, updatedData);
  return res.data;
};

//  Get cargos that are unassigned
export const getAvailableCargo = async () => {
  const res = await http.get("/cargos/available");
  return res.data;
};

//  Driver accepts a cargo
export const acceptCargo = async (cargoId) => {
  const res = await http.post(`/cargos/${cargoId}/accept`);
  return res.data;
};

//  Update cargo status (Delivered/In-transit/etc.)
export const updateStatus = async (cargoId, status) => {
  const res = await http.patch(`/cargos/${cargoId}/status`, { status });
  return res.data;
};

//  Update cargo location (for tracking)
export const updateLocation = async (cargoId, location) => {
  const res = await http.patch(`/cargos/${cargoId}/location`, { location });
  return res.data;
};

//  Track a single cargo by ID
export const trackCargo = async (cargoId) => {
  const res = await http.get(`/cargos/${cargoId}`);
  return res.data;
};

//  Get all cargos assigned to the logged-in driver
export const getAssignedCargoForDriver = async () => {
  const res = await http.get("/cargos/assigned");
  return res.data;
};

//  Get all cargos belonging to logged-in customer
export const getCustomerCargos = async () => {
  const res = await http.get("/cargos/customer");
  return res.data;
};

//  Get all customers (for dropdown/selection)
export const getCustomers = async () => {
  const res = await http.get(`${USER_URL}/customers`);
  return res.data;
};

// Accept a cargo request and create cargo
export const acceptCargoRequest = async (requestId) => {
  const res = await http.post(`/request/accept/${requestId}`);
  return res.data;
};

//Reject a cargo request
export const rejectCargoRequest = async (id) => {
  const res = await http.patch(`/request/reject/${id}`);
  return res.data;
};

// Get all pending requests
export const getAllCargoRequests = async () => {
  const res = await http.get("/request");
  return res.data;
};
