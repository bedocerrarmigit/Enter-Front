import api from "./api";

// GET
export async function getAllUsers() {
  const res = await api.get("/users/findAll");
  return res.data;
}

// POST
export async function createUser(data) {
  const res = await api.post("/users/create", data);
  return res.data?.data ?? res.data;
}

// PUT
export async function updateUser(data) {
  if (!data.id) throw new Error("updateUser necesita data.id");
  const res = await api.put(`/users/${data.id}`, data);
  return res.data?.data ?? res.data;
}

// DELETE
export async function deleteUser(id) {
  await api.delete(`/users/${id}`);
}
