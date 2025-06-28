import http from "./http.service";

const USER_URL = "/user";
const REQUEST_URL = "/request";

// ✅ Get list of all customers (admin/business use)
export const getCustomers = async () => {
  const res = await http.get(`${USER_URL}/customers`);
  return res.data;
};

// ✅ Get cargo list for logged-in customer
export const getCustomerCargos = async () => {
  const res = await http.get(`${USER_URL}/customer`);
  return res.data;
};

// ✅ Create a new cargo request (customer)
export const addCargoRequest = async (data) => {
  const res = await http.post(`${REQUEST_URL}`, data);
  return res.data;
};

// ✅ Get all requests submitted by the customer
export const getAllCargoRequests = async () => {
  const res = await http.get(`${REQUEST_URL}/getallrequests`);
  return res.data;
};

// ✅ Update a specific cargo request by ID
export const updateCargoRequest = async (id, data) => {
  const res = await http.put(`${REQUEST_URL}/update/${id}`, data);
  return res.data;
};

// ✅ Delete a cargo request by ID
export const deleteCargoRequest = async (id) => {
  const res = await http.delete(`${REQUEST_URL}/delete/${id}`);
  return res.data;
};
