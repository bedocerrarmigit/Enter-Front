import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAllSex, createSex, updateSex, deleteSex } from "../../Servicios/sex";
import styles from "../adminPeliculas/AdminPeliculas.module.css";

const emptyForm = {
  id: null,
  sexName: "",
  extraJson: "{}",
};

const AdminSex = () => {
  const [sexList, setSexList] = useState([]);
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
      const data = await getAllSex();
      setSexList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error cargando sex", e);
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
      sexName: item.sexName ?? "",
      extraJson: "{}",
    });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este registro?")) return;
    try {
      await deleteSex(id);
      if (editingId === id) handleNuevo();
      await cargarDatos();
    } catch (e) {
      console.error("Error eliminando sex", e);
      setError("No se pudo eliminar el registro.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.sexName.trim()) {
      setError("El campo 'sexName' es obligatorio.");
      return;
    }

    let extra = {};
    try {
      extra = formData.extraJson?.trim() ? JSON.parse(formData.extraJson) : {};
    } catch {
      setError("El JSON extra no es válido.");
      return;
    }

    const payload = {
      id: editingId ? Number(editingId) : null,
      sexName: formData.sexName.trim(),
      ...extra,
    };

    try {
      if (editingId) await updateSex(payload);
      else await createSex(payload);

      await cargarDatos();
      handleNuevo();
    } catch (e2) {
      console.error("Error guardando sex", e2);
      const msg =
        e2?.response?.data?.mensaje ||
        e2?.response?.data?.message ||
        (typeof e2?.response?.data === "string" ? e2.response.data : null) ||
        "No se pudo guardar el registro.";
      setError(msg);
    }
  };

  const displayName = (item) => item?.sexName || "(sin nombre)";

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Gestión de Sex (Sexo)</h1>

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
                    <td className={styles.td}>{displayName(item)}</td>
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
              <span>sexName *</span>
              <input
                value={formData.sexName}
                onChange={(e) => handleChange("sexName", e.target.value)}
                placeholder="Femenino"
              />
            </label>

            <label className={styles.formField}>
              <span>JSON extra (opcional)</span>
              <textarea
                value={formData.extraJson}
                onChange={(e) => handleChange("extraJson", e.target.value)}
                rows={8}
                className={styles.textarea}
                placeholder='{ "otraCosa": "..." }'
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

export default AdminSex;
