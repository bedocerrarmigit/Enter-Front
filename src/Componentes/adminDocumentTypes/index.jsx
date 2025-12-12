import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  getAllDocumentTypes,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
} from "../../Servicios/documentType";
import styles from "../adminPeliculas/AdminPeliculas.module.css";

const emptyForm = {
  id: null,
  documentName: "",
  initials: "",
};

export default function AdminDocumentTypes() {
  const [docs, setDocs] = useState([]);
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
      const data = await getAllDocumentTypes();
      setDocs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error cargando document types", e);
      setError("No se pudieron cargar los tipos de documento.");
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
      documentName: item.documentName ?? "",
      initials: item.initials ?? "",
    });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este tipo de documento?")) return;

    try {
      await deleteDocumentType(id);
      if (editingId === id) handleNuevo();
      await cargarDatos();
    } catch (e) {
      console.error("Error eliminando document type", e);
      setError("No se pudo eliminar el tipo de documento.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const documentName = formData.documentName.trim();
    const initials = formData.initials.trim();

    if (!documentName) {
      setError("documentName es obligatorio.");
      return;
    }
    if (!initials) {
      setError("initials es obligatorio.");
      return;
    }
    if (initials.length > 10) {
      setError("initials no puede superar 10 caracteres.");
      return;
    }

    const payload = {
      id: editingId ? Number(editingId) : null,
      documentName,
      initials,
    };

    try {
      if (editingId) {
        await updateDocumentType(payload);
      } else {
        await createDocumentType(payload);
      }
      await cargarDatos();
      handleNuevo();
    } catch (e) {
      console.error("Error guardando DocumentType:", e);
      const msg =
        e?.response?.data?.mensaje ||
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : null) ||
        "El backend rechazó los datos.";
      setError(msg);
    }
  };

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Gestión de Tipos de Documento</h1>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
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
          ) : docs.length === 0 ? (
            <p>No hay registros.</p>
          ) : (
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th className={styles.th}>ID</th>
                  <th className={styles.th}>Iniciales</th>
                  <th className={styles.th}>Nombre</th>
                  <th className={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.td}>{item.id}</td>
                    <td className={styles.td}>{item.initials ?? "-"}</td>
                    <td className={styles.td}>{item.documentName ?? "-"}</td>
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
              <span>documentName *</span>
              <input
                value={formData.documentName}
                onChange={(e) => handleChange("documentName", e.target.value)}
                placeholder="Cédula de ciudadanía"
              />
            </label>

            <label className={styles.formField}>
              <span>initials *</span>
              <input
                value={formData.initials}
                onChange={(e) => handleChange("initials", e.target.value)}
                placeholder="CC"
                maxLength={10}
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
}
