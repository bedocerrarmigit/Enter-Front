import api from "./api";

// GET: /api/audiovisual/findAll
export async function getAllAudiovisualContent() {
  const res = await api.get("/audiovisual/findAll");
  return res.data;
}

// POST: /api/audiovisual/create
export async function createAudiovisualContent(data) {
  const res = await api.post("/audiovisual/create", data);
  return res.data;
}

// PUT: /api/audiovisual/{id}
export async function updateAudiovisualContent(id, data) {
  const res = await api.put(`/audiovisual/${id}`, data);
  return res.data;
}

// DELETE: /api/audiovisual/{id}
export async function deleteAudiovisualContent(id) {
  await api.delete(`/audiovisual/${id}`);
}
