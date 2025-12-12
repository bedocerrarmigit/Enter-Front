import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAllActors, createActor, updateActor, deleteActor } from "../../Servicios/actor";
import styles from "../adminPeliculas/AdminPeliculas.module.css";

const emptyForm = {
  id: null,
  nameActor: "",
  lastNameActor: "",
  picture: null,
  pictureContentType: null,
};

const AdminActors = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const isAdmin = user && (user.rol === "ADMIN" || user.rol === "ROLE_ADMIN");
  if (!user || !isAdmin) return <Navigate to="/inicio" replace />;

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getAllActors();
      setActors(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error cargando actores", e);
      setError("No se pudieron cargar los actores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleNuevo = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditar = (item) => {
    setEditingId(item.id);
    setError("");
    setFormData({
      id: item.id ?? null,
      nameActor: item.nameActor ?? "",
      lastNameActor: item.lastNameActor ?? "",
      picture: item.picture ?? null,
      pictureContentType: item.pictureContentType ?? null,
    });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este actor?")) return;
    try {
      await deleteActor(id);
      if (editingId === id) handleNuevo();
      await cargarDatos();
    } catch (e) {
      console.error("Error al eliminar", e);
      setError("No se pudo eliminar el actor.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nameActor = formData.nameActor.trim();
    const lastNameActor = formData.lastNameActor.trim();

    if (!nameActor) {
      setError("nameActor es obligatorio.");
      return;
    }
    if (!lastNameActor) {
      setError("lastNameActor es obligatorio.");
      return;
    }

    const payload = {
      id: editingId ? Number(editingId) : null,
      nameActor,
      lastNameActor,
      picture: formData.picture ?? null,
      pictureContentType: formData.pictureContentType ?? null,
    };

    try {
      if (editingId) await updateActor(editingId, payload);
      else await createActor(payload);

      await cargarDatos();
      handleNuevo();
    } catch (e) {
      console.error("Error al guardar actor", e);
      const msg =
        e?.response?.data?.mensaje ||
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : null) ||
        "No se pudo guardar el actor.";
      setError(msg);
    }
  };

  const nombreCompleto = (item) => {
    const n = item.nameActor || "";
    const a = item.lastNameActor || "";
    const full = `${n} ${a}`.trim();
    return full || "(sin nombre)";
  };

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Gestión de Actores</h1>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.cardLista}`}>
          <div className={styles.cardHeader}>
            <h2>Registros</h2>
            <button type="button" onClick={handleNuevo} className={`${styles.boton} ${styles.botonNuevo}`}>
              Nuevo
            </button>
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : actors.length === 0 ? (
            <p>No hay registros.</p>
          ) : (
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th className={styles.th}>ID</th>
                  <th className={styles.th}>Nombre</th>
                  <th className={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {actors.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.td}>{item.id}</td>
                    <td className={styles.td}>{nombreCompleto(item)}</td>
                    <td className={styles.td}>
                      <button
                        type="button"
                        onClick={() => handleEditar(item)}
                        className={`${styles.boton} ${styles.botonEditar}`}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEliminar(item.id)}
                        className={`${styles.boton} ${styles.botonEliminar}`}
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

        <div className={styles.card}>
          <h2>{editingId ? `Editar ID ${editingId}` : "Crear nuevo"}</h2>

          <form onSubmit={handleSubmit}>
            <label className={styles.formField}>
              <span>nameActor *</span>
              <input
                value={formData.nameActor}
                onChange={(e) => handleChange("nameActor", e.target.value)}
                placeholder="Leonardo"
              />
            </label>

            <label className={styles.formField}>
              <span>lastNameActor *</span>
              <input
                value={formData.lastNameActor}
                onChange={(e) => handleChange("lastNameActor", e.target.value)}
                placeholder="DiCaprio"
              />
            </label>

            <label className={styles.formField}>
              <span>pictureContentType</span>
              <input
                value={formData.pictureContentType ?? ""}
                onChange={(e) => handleChange("pictureContentType", e.target.value || null)}
                placeholder="image/png"
              />
            </label>

            <label className={styles.formField}>
              <span>picture</span>
              <input
                value={formData.picture ?? ""}
                onChange={(e) => handleChange("picture", e.target.value || null)}
                placeholder="base64 o null"
              />
            </label>

            <button type="submit" className={`${styles.boton} ${styles.botonSubmit}`}>
              {editingId ? "Guardar cambios" : "Crear registro"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminActors;
