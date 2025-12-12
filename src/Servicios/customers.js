import api from "./api"; 

// GET:
export async function getAllCustomers() {
  const res = await api.get("/customers/findAll");
  return res.data;
}

// POST:
export async function createCustomer(data) {
  const res = await api.post("/customers/create", data);
  return res.data;
}

// PUT:
export async function updateCustomer(data) {
  if (!data.id) throw new Error("updateCustomer necesita data.id");
  const res = await api.put(`/customers/${data.id}`, data);
  return res.data;
}

// DELETE:
export async function deleteCustomer(id) {
  await api.delete(`/customers/${id}`);
}
