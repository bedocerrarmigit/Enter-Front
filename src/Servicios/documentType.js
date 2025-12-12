import api from "./api";

// GET:
export async function getAllDocumentTypes() {
  const res = await api.get("/document-types/findAll");
  return res.data;
}

// POST:
export async function createDocumentType(data) {
  const res = await api.post("/document-types/create", data);
  return res.data;
}

// PUT:
export async function updateDocumentType(data) {
  const res = await api.put("/document-types/update", data);
  return res.data;
}

// DELETE:
export async function deleteDocumentType(id) {
  await api.delete(`/document-types/delete/${id}`);
}

