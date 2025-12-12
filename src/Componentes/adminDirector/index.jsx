import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import styles from "../adminPeliculas/AdminPeliculas.module.css";
import {
  getAllDirectors,
  createDirector,
  updateDirector,
  deleteDirector,
} from "../../Servicios/director";

const AdminDirector = () => {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [nameDirector, setNameDirector] = useState("");
  const [lasNameDirector, setLasNameDirector] = useState("");
  const [yearbirth, setYearbirth] = useState("");
  const [pictureBase64, setPictureBase64] = useState("");
  const [pictureContentType, setPictureContentType] = useState("");

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const isAdmin = user && (user.rol === "ADMIN" || user.rol === "ROLE_ADMIN");
  if (!user || !isAdmin) return <Navigate to="/inicio" replace />;

  const readFileAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result || "";
        const base64 = String(result).split(",")[1] || "";
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const normalizeDirector = (d) => {
    const id = d?.id ?? null;
    const nameDirector = d?.nameDirector ?? d?.name_director ?? "";
    const lasNameDirector = d?.lasNameDirector ?? d?.lastNameDirector ?? d?.las_name_director ?? "";
    const yearbirth = d?.yearbirth ?? "";
    const picture = d?.picture ?? "";
    const pictureContentType = d?.pictureContentType ?? "";
    return {
      ...d,
      id,
      nameDirector,
      lasNameDirector,
      yearbirth,
      picture,
      pictureContentType,
    };
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getAllDirectors();
      setDirectors((data || []).map(normalizeDirector));
    } catch (e) {
      console.error("Error cargando directores", e);
      setError("No se pudieron cargar los directores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setNameDirector("");
    setLasNameDirector("");
    setYearbirth("");
    setPictureBase64("");
    setPictureContentType("");
    setError("");
  };

  const handleNuevo = () => {
    resetForm();
  };

  const handleEditar = (item) => {
    const d = normalizeDirector(item);
    setEditingId(d.id);
    setNameDirector(d.nameDirector || "");
    setLasNameDirector(d.lasNameDirector || "");
    setYearbirth(d.yearbirth ? String(d.yearbirth) : "");
    setPictureBase64(d.picture || "");
    setPictureContentType(d.pictureContentType || "");
    setError("");
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este director?")) return;

    try {
      await deleteDirector(id);
      await cargarDatos();
      if (editingId === id) resetForm();
    } catch (e) {
      console.error("Error al eliminar", e);
      setError("No se pudo eliminar el director.");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const base64 = await readFileAsBase64(file);
      setPictureBase64(base64);
      setPictureContentType(file.type || "");
    } catch (err) {
      console.error("Error leyendo imagen", err);
      setError("No se pudo leer la imagen.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nameTrim = String(nameDirector || "").trim();
    const lastTrim = String(lasNameDirector || "").trim();

    if (nameTrim.length > 30) {
      setError("nameDirector no puede superar 30 caracteres.");
      return;
    }
    if (lastTrim.length > 30) {
      setError("lasNameDirector no puede superar 30 caracteres.");
      return;
    }

    let yearbirthValue = null;
    if (String(yearbirth).trim() !== "") {
      const iso = String(yearbirth).trim();
      yearbirthValue = iso;
    }

    const dto = {
      nameDirector: nameTrim || null,
      lasNameDirector: lastTrim || null,
      yearbirth: yearbirthValue,
      picture: pictureBase64 ? pictureBase64 : null,
      pictureContentType: pictureBase64 ? (pictureContentType || null) : null,
    };

    Object.keys(dto).forEach((k) => {
      if (dto[k] === null || dto[k] === undefined || dto[k] === "") delete dto[k];
    });

    try {
      if (editingId) {
        await updateDirector(editingId, { id: editingId, ...dto });
      } else {
        await createDirector(dto);
      }
      await cargarDatos();
      resetForm();
    } catch (err) {
      console.error("Error al guardar", err);
      setError("No se pudo guardar. Revisa que coincida con DirectorDTO.");
    }
  };

  const previewSrc =
    pictureBase64 && pictureContentType
      ? `data:${pictureContentType};base64,${pictureBase64}`
      : "";

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Gestión de Directores</h1>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.cardLista}`}>
          <div className={styles.cardHeader}>
            <h2>Registros</h2>
            <button
              onClick={handleNuevo}
              className={`${styles.boton} ${styles.botonNuevo}`}
            >
              Nuevo
            </button>
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : directors.length === 0 ? (
            <p>No hay registros.</p>
          ) : (
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th className={styles.th}>ID</th>
                  <th className={styles.th}>Nombre</th>
                  <th className={styles.th}>Apellido</th>
                  <th className={styles.th}>Nacimiento</th>
                  <th className={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {directors.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.td}>{item.id}</td>
                    <td className={styles.td}>{item.nameDirector || "-"}</td>
                    <td className={styles.td}>{item.lasNameDirector || "-"}</td>
                    <td className={styles.td}>{item.yearbirth ?? "-"}</td>
                    <td className={styles.td}>
                      <button
                        onClick={() => handleEditar(item)}
                        className={`${styles.boton} ${styles.botonEditar}`}
                      >
                        Editar
                      </button>
                      <button
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
            <label className={styles.label}>
              nameDirector
              <input
                type="text"
                value={nameDirector}
                onChange={(e) => setNameDirector(e.target.value)}
                className={styles.input}
                placeholder="Nombre"
                maxLength={30}
              />
            </label>

            <label className={styles.label}>
              lasNameDirector
              <input
                type="text"
                value={lasNameDirector}
                onChange={(e) => setLasNameDirector(e.target.value)}
                className={styles.input}
                placeholder="Apellido"
                maxLength={30}
              />
            </label>

            <label className={styles.label}>
              yearbirth
              <input
                type="date"
                value={yearbirth}
                onChange={(e) => setYearbirth(e.target.value)}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              picture
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.input}
              />
            </label>

            {previewSrc ? (
              <div style={{ marginTop: 10, marginBottom: 10 }}>
                <img
                  src={previewSrc}
                  alt="preview"
                  style={{ maxWidth: "100%", borderRadius: 10 }}
                />
              </div>
            ) : null}

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

export default AdminDirector;
