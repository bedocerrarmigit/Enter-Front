import api from "./api";

// GET: /api/document-types/findAll
export async function getAllDocumentTypes() {
  const res = await api.get("/document-types/findAll");
  return res.data;
}

// POST: /api/document-types/create
export async function createDocumentType(data) {
  const res = await api.post("/document-types/create", data);
  return res.data;
}

// PUT: /api/document-types/update
export async function updateDocumentType(data) {
  const res = await api.put("/document-types/update", data);
  return res.data;
}

// DELETE: /api/document-types/delete/{id}
export async function deleteDocumentType(id) {
  await api.delete(`/document-types/delete/${id}`);
}
