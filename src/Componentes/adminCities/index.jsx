import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  getAllCities,
  createCity,
  updateCity,
  deleteCity,
} from "../../Servicios/city";

import styles from "../adminPeliculas/AdminPeliculas.module.css";

const emptyForm = {
  id: null,
  name: "",
  extraJson: "{}",
};

function getCityName(item) {
  const t =
    item?.name ??
    item?.cityName ??
    item?.nombre ??
    item?.city_name ??
    item?.city ??
    "";
  const s = String(t ?? "").trim();
  return s ? s : "(sin nombre)";
}

function safeParseJson(text) {
  if (!text || !String(text).trim()) return {};
  return JSON.parse(text);
}

const AdminCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const isAdmin = user && (user.rol === "ADMIN" || user.rol === "ROLE_ADMIN");

  if (!user || !isAdmin) {
    return <Navigate to="/inicio" replace />;
  }

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getAllCities();
      setCities(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error cargando ciudades", e);
      setError("No se pudieron cargar las ciudades.");
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
      name: getCityName(item) === "(sin nombre)" ? "" : getCityName(item),
      extraJson: "{}",
    });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta ciudad?")) return;

    try {
      await deleteCity(id);
      if (editingId === id) handleNuevo();
      await cargarDatos();
    } catch (e) {
      console.error("Error al eliminar", e);
      setError("No se pudo eliminar la ciudad.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nameTrim = String(formData.name ?? "").trim();
    if (!nameTrim) {
      setError("El campo 'name' es obligatorio.");
      return;
    }

    let extra = {};
    try {
      extra = safeParseJson(formData.extraJson);
    } catch (err) {
      setError("El JSON extra no es válido.");
      return;
    }

    const payload = {
      id: editingId ? Number(editingId) : null,
      name: nameTrim,
      ...extra,
    };

    if (!("cityName" in payload)) payload.cityName = payload.name;
    if (!("nombre" in payload)) payload.nombre = payload.name;

    try {
      if (editingId) await updateCity(editingId, payload);
      else await createCity(payload);

      await cargarDatos();
      handleNuevo();
    } catch (e) {
      console.error("Error al guardar", e);
      setError("No se pudo guardar. Revisa los campos y/o el JSON extra.");
    }
  };

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Gestión de Ciudades</h1>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.cardLista}`}>
          <div className={styles.cardHeader}>
            <h2>Registros</h2>
            <button
              type="button"
              onClick={handleNuevo}
              className={`${styles.boton} ${styles.botonNuevo}`}
            >
              Nuevo
            </button>
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : cities.length === 0 ? (
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
                {cities.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.td}>{item.id}</td>
                    <td className={styles.td}>{getCityName(item)}</td>
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
              <span>name *</span>
              <input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Bogotá"
              />
            </label>

            <label className={styles.formField}>
              <span>JSON extra (opcional)</span>
              <textarea
                value={formData.extraJson}
                onChange={(e) => handleChange("extraJson", e.target.value)}
                rows={8}
                className={styles.textarea}
                placeholder='{ "department": { "id": 1 } }'
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

export default AdminCities;
