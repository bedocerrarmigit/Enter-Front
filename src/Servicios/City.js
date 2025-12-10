import api from "./api";

// GET: /api/cities/findAll
export async function getAllCities() {
  const res = await api.get("/cities/findAll");
  return res.data;
}

// POST: /api/cities/create
export async function createCity(data) {
  const res = await api.post("/cities/create", data);
  return res.data;
}

// PUT: /api/cities/{id}
export async function updateCity(id, data) {
  const res = await api.put(`/cities/${id}`, data);
  return res.data;
}

// DELETE: /api/cities/{id}
export async function deleteCity(id) {
  await api.delete(`/cities/${id}`);
}
