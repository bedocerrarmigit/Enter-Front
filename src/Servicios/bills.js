import api from "./api";

// GET:
export async function getAllBills() {
  const res = await api.get("/bills/findAll");
  return res.data;
}

// POST:
export async function createBill(data) {
  const res = await api.post("/bills/create", data);
  return res.data;
}

// PUT:
export async function updateBill(data) {
  if (!data.id) throw new Error("updateBill necesita data.id");
  const res = await api.put(`/bills/${data.id}`, data);
  return res.data;
}

// DELETE:
export async function deleteBill(id) {
  await api.delete(`/bills/${id}`);
}
