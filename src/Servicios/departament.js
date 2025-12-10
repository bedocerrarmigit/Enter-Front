import api from "./api";

export async function getAllDepartaments() {
  const res = await api.get("/departaments/findAll");
  return res.data;
}

export async function createDepartament(data) {
  const res = await api.post("/departaments/create", data);
  return res.data;
}

export async function updateDepartament(id, data) {
  const res = await api.put(`/departaments/${id}`, data);
  return res.data;
}

export async function deleteDepartament(id) {
  await api.delete(`/departaments/${id}`);
}
