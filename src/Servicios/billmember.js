import api from "./api";

// GET ALL
export async function getAllBillMembers() {
  const res = await api.get("/bill-membreships/getAll");
  return res.data;
}

// GET  (PK compuesta)
export async function getBillMember(billId, membreshipId) {
  const res = await api.get(`/bill-membreships/${billId}/${membreshipId}`);
  return res.data;
}

// CREATE
export async function createBillMember(data) {
  const res = await api.post("/bill-membreships/create", data);
  return res.data;
}

// UPDATE (PK compuesta)
export async function updateBillMember(billId, membreshipId, data) {
  const res = await api.put(
    `/bill-membreships/${billId}/${membreshipId}`,
    data
  );
  return res.data;
}

// DELETE (PK compuesta)
export async function deleteBillMember(billId, membreshipId) {
  await api.delete(`/bill-membreships/${billId}/${membreshipId}`);
}
