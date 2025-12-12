import api from "./api";

// GET: 
export async function getAllCities() {
  const res = await api.get("/cities/findAll");
  return res.data;
}

// POST:
export async function createCity(data) {
  const res = await api.post("/cities/create", data);
  return res.data;
}

// PUT:
export async function updateCity(id, data) {
  const res = await api.put(`/cities/${id}`, data);
  return res.data;
}

// DELETE:
export async function deleteCity(id) {
  await api.delete(`/cities/${id}`);
}
  