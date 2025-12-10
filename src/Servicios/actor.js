import api from "./api";

// GET: 
export async function getAllActors() {
  const res = await api.get("/actors/findAll");
  return res.data;
}

// POST:
export async function createActor(data) {
  const res = await api.post("/actors/create", data);
  return res.data;
}

// PUT:
export async function updateActor(id, data) {
  const res = await api.put(`/actors/${id}`, data);
  return res.data;
}

// DELETE:
export async function deleteActor(id) {
  await api.delete(`/actors/${id}`);
}
