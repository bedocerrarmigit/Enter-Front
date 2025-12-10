import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  getAllFilmGenres,
  createFilmGenre,
  updateFilmGenre,
  deleteFilmGenre,
} from "../../Servicios/filmGenre";
import styles from "../adminPeliculas/AdminPeliculas.module.css";

const AdminFilmGenres = () => {
  const [genres, setGenres] = useState([]);
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
      const data = await getAllFilmGenres();
      setGenres(data || []);
    } catch (e) {
      console.error("Error cargando géneros", e);
      setError("No se pudieron cargar los géneros.");
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
  "movieGenre": ""
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
    if (!window.confirm("¿Seguro que quieres eliminar este género?")) return;

    try {
      await deleteFilmGenre(id);
      await cargarDatos();
    } catch (e) {
      console.error("Error al eliminar", e);
      setError("No se pudo eliminar el género.");
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
        if (!body.id) {
          body.id = editingId;
        }
        await updateFilmGenre(body);
      } else {
        await createFilmGenre(body);
      }
      await cargarDatos();
      handleNuevo();
    } catch (e) {
      console.error("Error al guardar", e);
      setError(
        "No se pudo guardar. Revisa el JSON y que coincida con FilmGenreDTO."
      );
    }
  };

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Gestión de Géneros de Película</h1>

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
          ) : genres.length === 0 ? (
            <p>No hay registros.</p>
          ) : (
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th className={styles.th}>ID</th>
                  <th className={styles.th}>Género</th>
                  <th className={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {genres.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.td}>{item.id}</td>
                    <td className={styles.td}>
                      {item.movieGenre || "(sin nombre)"}
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
            <b>FilmGenreDTO</b>.  
            Ejemplo:
          </p>
          <pre className={styles.descripcion}>

          </pre>

          <form onSubmit={handleSubmit}>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rows={14}
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

export default AdminFilmGenres;
