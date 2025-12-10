import api from "./api";

// GET:
export async function getAllSex() {
  const res = await api.get("/sex/findAll");
  return res.data;
}

// POST:
export async function createSex(data) {
  const res = await api.post("/sex/create", data);
  return res.data;
}

// PUT:
export async function updateSex(data) {
  const res = await api.put("/sex/update", data);
  return res.data;
}

// DELETE:
export async function deleteSex(id) {
  await api.delete(`/sex/delete/${id}`);
}
