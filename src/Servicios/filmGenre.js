import api from "./api";

// GET: 
export async function getAllFilmGenres() {
  const res = await api.get("/film-genres/findAll");
  return res.data;
}

// POST:
export async function createFilmGenre(data) {
  const res = await api.post("/film-genres/create", data);
  return res.data;
}

// PUT:

export async function updateFilmGenre(data) {
  const res = await api.put("/film-genres/update", data);
  return res.data;
}

// DELETE:
export async function deleteFilmGenre(id) {
  await api.delete(`/film-genres/delete/${id}`);
}
