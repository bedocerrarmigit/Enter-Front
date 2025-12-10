import api from "./api";

// GET:
export async function getAllMembreships() {
  const res = await api.get("/membreships/findAll");
  return res.data;
}

// POST:
export async function createMembreship(data) {
  const res = await api.post("/membreships/create", data);
  return res.data;
}

// PUT:

export async function updateMembreship(data) {
  const res = await api.put("/membreships/update", data);
  return res.data;
}

// DELETE: 
export async function deleteMembreship(id) {
  await api.delete(`/membreships/delete/${id}`);
}
