import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  getAllSex,
  createSex,
  updateSex,
  deleteSex,
} from "../../Servicios/sex";
import styles from "../adminPeliculas/AdminPeliculas.module.css";

const AdminSex = () => {
  const [sexList, setSexList] = useState([]);
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
      const data = await getAllSex();
      setSexList(data || []);
    } catch (e) {
      console.error("Error cargando sexos", e);
      setError("No se pudieron cargar los registros de Sex.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleNuevo = () => {
    setEditingId(null);
    setJsonText("{}"); // aquí tú metes los campos según SexDTO (mira Swagger)
    setError("");
  };

  const handleEditar = (item) => {
    setEditingId(item.id);
    setJsonText(JSON.stringify(item, null, 2));
    setError("");
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este registro?")) return;

    try {
      await deleteSex(id);
      await cargarDatos();
    } catch (e) {
      console.error("Error al eliminar", e);
      setError("No se pudo eliminar el registro.");
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
        await updateSex(body);
      } else {
        await createSex(body);
      }
      await cargarDatos();
      handleNuevo();
    } catch (e) {
      console.error("Error al guardar", e);
      setError(
        "No se pudo guardar. Revisa el JSON y que coincida con SexDTO."
      );
    }
  };

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Gestión de Sex (Sexo)</h1>

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
          ) : sexList.length === 0 ? (
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
                {sexList.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.td}>{item.id}</td>
                    <td className={styles.td}>
                      {item.name ||
                        item.sexName ||
                        item.description ||
                        "(sin nombre configurado)"}
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
            Escribe el objeto JSON que coincida con tu <b>SexDTO</b>.  
            Revisa en Swagger (`/api/sex`) los nombres de los campos.
          </p>

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

export default AdminSex;
