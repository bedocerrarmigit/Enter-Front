import api from "./api";

//GET ALL
export async function getAllDirectors() {
  const res = await api.get("/directors/findAll");
  return res.data;
}
//GET
export async function getDirectorById(id) {
  const res = await api.get(`/directors/${id}`);
  return res.data;
}


//POST
export async function createDirector(data) {
  const res = await api.post("/directors/create", data);
  return res.data;
}


//PUT
export async function updateDirector(id, data) {
  const res = await api.put(`/directors/${id}`, data);
  return res.data;
}

//DELETE
export async function deleteDirector(id) {
  await api.delete(`/directors/${id}`);
}
