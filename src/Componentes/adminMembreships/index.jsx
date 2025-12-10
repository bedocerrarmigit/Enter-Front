import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  getAllMembreships,
  createMembreship,
  updateMembreship,
  deleteMembreship,
} from "../../Servicios/membreship";
import styles from "../adminPeliculas/AdminPeliculas.module.css";

const AdminMembreships = () => {
  const [membreships, setMembreships] = useState([]);
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
      const data = await getAllMembreships();
      setMembreships(data || []);
    } catch (e) {
      console.error("Error cargando membresías", e);
      setError("No se pudieron cargar las membresías.");
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

    );
    setError("");
  };

  const handleEditar = (item) => {
    setEditingId(item.id);
    setJsonText(JSON.stringify(item, null, 2));
    setError("");
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta membresía?")) return;

    try {
      await deleteMembreship(id);
      await cargarDatos();
    } catch (e) {
      console.error("Error al eliminar", e);
      setError("No se pudo eliminar la membresía.");
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
        // el endpoint de update usa /update sin {id}, así que el id debe ir en el body
        if (!body.id) {
          body.id = editingId;
        }
        await updateMembreship(body);
      } else {
        await createMembreship(body);
      }
      await cargarDatos();
      handleNuevo();
    } catch (e) {
      console.error("Error al guardar", e);
      setError(
        "No se pudo guardar. Revisa el JSON y que coincida con MembreshipDTO."
      );
    }
  };

  const formatPrice = (p) => {
    if (p === null || p === undefined) return "-";
    return Number(p).toLocaleString("es-CO");
  };

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Gestión de Membresías</h1>

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
          ) : membreships.length === 0 ? (
            <p>No hay registros.</p>
          ) : (
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th className={styles.th}>ID</th>
                  <th className={styles.th}>Nombre</th>
                  <th className={styles.th}>Precio</th>
                  <th className={styles.th}>Duración</th>
                  <th className={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {membreships.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.td}>{item.id}</td>
                    <td className={styles.td}>
                      {item.membershipName || "(sin nombre)"}
                    </td>
                    <td className={styles.td}>
                      {formatPrice(item.price)}
                    </td>
                    <td className={styles.td}>
                      {item.duration ?? "-"}
                    </td>
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
            Escribe el objeto JSON que coincida con tu{" "}
            <b>MembreshipDTO</b>.  
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

export default AdminMembreships;
