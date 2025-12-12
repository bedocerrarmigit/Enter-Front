import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  getAllAudiovisualContent,
  createAudiovisualContent,
  updateAudiovisualContent,
  deleteAudiovisualContent,
} from "../../Servicios/audiovisualContent";
import styles from "./AdminPeliculas.module.css";

const emptyForm = {
  id: null,
  title: "",
  synopsis: "",
  duration: "",
  releaseDate: "",
  extraJson: "{}",
};

function getTitle(item) {
  const t =
    item?.title ??
    item?.tittle ??
    item?.name ??
    item?.nombre ??
    item?.titulo ??
    item?.movieTitle ??
    "";
  const s = String(t ?? "").trim();
  return s ? s : "(sin título)";
}

function safeParseJson(text) {
  if (!text || !String(text).trim()) return {};
  return JSON.parse(text);
}

const AdminPeliculas = () => {
  const [contenidos, setContenidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  // Admin
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const isAdmin = user && (user.rol === "ADMIN" || user.rol === "ROLE_ADMIN");

  if (!user || !isAdmin) return <Navigate to="/inicio" replace />;

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getAllAudiovisualContent();
      setContenidos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error cargando audiovisuales", e);
      setError("No se pudieron cargar los registros.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNuevo = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleEditar = (item) => {
    setEditingId(item.id);
    setError("");

    setFormData({
      id: item.id ?? null,
      title: getTitle(item) === "(sin título)" ? "" : getTitle(item),
      synopsis: item.synopsis ?? item.description ?? item.sinopsis ?? "",
      duration: item.duration ?? item.runtime ?? "",
      releaseDate: item.releaseDate ?? item.premiereDate ?? item.date ?? "",
      extraJson: "{}", 
    });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este registro?")) return;

    try {
      await deleteAudiovisualContent(id);
      if (editingId === id) handleNuevo();
      await cargarDatos();
    } catch (e) {
      console.error("Error al eliminar", e);
      setError("No se pudo eliminar el registro.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const titleTrim = String(formData.title ?? "").trim();
    if (!titleTrim) {
      setError("El campo 'title' es obligatorio.");
      return;
    }

    let extra = {};
    try {
      extra = safeParseJson(formData.extraJson);
    } catch (err) {
      setError("El JSON extra no es válido.");
      return;
    }

    // payload base
    const payload = {
      id: editingId ? Number(editingId) : null,
      title: titleTrim,
      synopsis: String(formData.synopsis ?? "").trim() || null,
      duration: formData.duration !== "" ? Number(formData.duration) : null,
      releaseDate: formData.releaseDate || null,
      ...extra,
    };


    if (!("tittle" in payload)) {
      payload.tittle = payload.title;
    }

    try {
      if (editingId) await updateAudiovisualContent(editingId, payload);
      else await createAudiovisualContent(payload);

      await cargarDatos();
      handleNuevo();
    } catch (e) {
      console.error("Error al guardar", e);
      setError("No se pudo guardar. Revisa los campos y/o el JSON extra.");
    }
  };

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Gestión de Películas / Contenido</h1>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        {/* LISTADO */}
        <div className={`${styles.card} ${styles.cardLista}`}>
          <div className={styles.cardHeader}>
            <h2>Registros</h2>
            <button
              onClick={handleNuevo}
              className={`${styles.boton} ${styles.botonNuevo}`}
              type="button"
            >
              Nuevo
            </button>
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : contenidos.length === 0 ? (
            <p>No hay registros.</p>
          ) : (
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th className={styles.th}>ID</th>
                  <th className={styles.th}>Título</th>
                  <th className={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {contenidos.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.td}>{item.id}</td>
                    <td className={styles.td}>{getTitle(item)}</td>
                    <td className={styles.td}>
                      <button
                        onClick={() => handleEditar(item)}
                        className={`${styles.boton} ${styles.botonEditar}`}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(item.id)}
                        className={`${styles.boton} ${styles.botonEliminar}`}
                        type="button"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* FORM */}
        <div className={styles.card}>
          <h2>{editingId ? `Editar ID ${editingId}` : "Crear nuevo"}</h2>

          <form onSubmit={handleSubmit}>
            <label className={styles.formField}>
              <span>title *</span>
              <input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Titanic"
              />
            </label>

            <label className={styles.formField}>
              <span>synopsis</span>
              <input
                value={formData.synopsis}
                onChange={(e) => handleChange("synopsis", e.target.value)}
                placeholder="Descripción corta"
              />
            </label>

            <label className={styles.formField}>
              <span>duration (min)</span>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                placeholder="180"
              />
            </label>

            <label className={styles.formField}>
              <span>releaseDate</span>
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) => handleChange("releaseDate", e.target.value)}
              />
            </label>

            <label className={styles.formField}>
              <span>JSON extra (opcional)</span>
              <textarea
                value={formData.extraJson}
                onChange={(e) => handleChange("extraJson", e.target.value)}
                rows={6}
                className={styles.textarea}
                placeholder='{ "rating": 5, "language": "es" }'
              />
            </label>

            <button
              type="submit"
              className={`${styles.boton} ${styles.botonSubmit}`}
            >
              {editingId ? "Guardar cambios" : "Crear registro"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPeliculas;
