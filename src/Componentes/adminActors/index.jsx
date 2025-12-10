import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  getAllActors,
  createActor,
  updateActor,
  deleteActor,
} from "../../Servicios/actor";
import styles from "../adminPeliculas/AdminPeliculas.module.css";

const AdminActors = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jsonText, setJsonText] = useState("{}");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // validar ADMIN
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const isAdmin =
    user && (user.rol === "ADMIN" || user.rol === "ROLE_ADMIN");

  if (!user || !isAdmin) {
    return <Navigate to="/inicio" replace />;
  }

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getAllActors();
      setActors(data || []);
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
    setJsonText(
      `{
  "nameActor": "",
  "lastNameActor": "",
  "picture": null,
  "pictureContentType": null
}`
    );
    setError("");
  };

  const handleEditar = (item) => {
    setEditingId(item.id);
    setJsonText(JSON.stringify(item, null, 2));
    setError("");
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este actor?")) return;

    try {
      await deleteActor(id);
      await cargarDatos();
    } catch (e) {
      console.error("Error al eliminar", e);
      setError("No se pudo eliminar el actor.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let body;
    try {
      body = JSON.parse(jsonText);
    } catch (e) {
      setError("El JSON no es válido.");
      return;
    }

    try {
      if (editingId) {
        await updateActor(editingId, body);
      } else {
        await createActor(body);
      }
      await cargarDatos();
      handleNuevo();
    } catch (e) {
      console.error("Error al guardar", e);
      setError(
        "No se pudo guardar. Revisa el JSON y que coincida con ActorDTO."
      );
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
        {/* LISTADO */}
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

        {/* FORM JSON */}
        <div className={styles.card}>
          <h2>{editingId ? `Editar ID ${editingId}` : "Crear nuevo"}</h2>
          <p className={styles.descripcion}>
            Escribe el objeto JSON que coincida con tu <b>ActorDTO</b>.  
            Ejemplo:
          </p>
          <pre className={styles.descripcion}>
          </pre>

          <form onSubmit={handleSubmit}>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rows={18}
              className={styles.textarea}
            />

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

export default AdminActors;
