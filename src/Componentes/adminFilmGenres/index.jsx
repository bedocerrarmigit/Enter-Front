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
  const [filmGenres, setFilmGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [movieGenre, setMovieGenre] = useState("");

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const isAdmin = user && (user.rol === "ADMIN" || user.rol === "ROLE_ADMIN");

  if (!user || !isAdmin) return <Navigate to="/inicio" replace />;

  const normalizeFilmGenre = (g) => {
    const movieGenre =
      g?.movieGenre ?? g?.movie_genre ?? g?.genre ?? g?.name ?? "";
    return { ...g, movieGenre };
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getAllFilmGenres();
      setFilmGenres((data || []).map(normalizeFilmGenre));
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

  const resetForm = () => {
    setEditingId(null);
    setMovieGenre("");
    setError("");
  };

  const handleNuevo = () => {
    resetForm();
  };

  const handleEditar = (item) => {
    const g = normalizeFilmGenre(item);
    setEditingId(g.id);
    setMovieGenre(g.movieGenre || "");
    setError("");
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este género?")) return;

    try {
      await deleteFilmGenre(id);
      await cargarDatos();
      if (editingId === id) resetForm();
    } catch (e) {
      console.error("Error al eliminar", e);
      setError("No se pudo eliminar el género.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const genreTrim = String(movieGenre || "").trim();
    if (!genreTrim) {
      setError("movieGenre es obligatorio.");
      return;
    }
    if (genreTrim.length > 30) {
      setError("movieGenre no puede superar 30 caracteres.");
      return;
    }

    const dto = { movieGenre: genreTrim };

    try {
      if (editingId) {
        await updateFilmGenre({ id: editingId, ...dto });
      } else {
        await createFilmGenre(dto);
      }
      await cargarDatos();
      resetForm();
    } catch (err) {
      console.error("Error al guardar", err);
      setError("No se pudo guardar. Revisa que coincida con FilmGenreDTO.");
    }
  };

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Gestión de Géneros</h1>

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
          ) : filmGenres.length === 0 ? (
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
                {filmGenres.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.td}>{item.id}</td>
                    <td className={styles.td}>
                      {item.movieGenre || "(sin género)"}
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

        <div className={styles.card}>
          <h2>{editingId ? `Editar ID ${editingId}` : "Crear nuevo"}</h2>

          <form onSubmit={handleSubmit}>
            <label className={styles.label}>
              movieGenre *
              <input
                type="text"
                value={movieGenre}
                onChange={(e) => setMovieGenre(e.target.value)}
                className={styles.input}
                placeholder="Acción"
                maxLength={30}
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

export default AdminFilmGenres;
