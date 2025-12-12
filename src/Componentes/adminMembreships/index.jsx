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
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [membershipName, setMembershipName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const [imagenBase64, setImagenBase64] = useState("");
  const [imagenContentType, setImagenContentType] = useState("");

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

  const normalizeMembreship = (m) => {
    const membershipName =
      m?.membershipName ?? m?.membership_name ?? m?.name ?? "";
    const price = m?.price ?? "";
    const duration = m?.duration ?? "";
    const description = m?.description ?? "";
    const imagen = m?.imagen ?? "";
    const imagenContentType = m?.imagenContentType ?? "";
    return {
      ...m,
      membershipName,
      price,
      duration,
      description,
      imagen,
      imagenContentType,
    };
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getAllMembreships();
      setMembreships((data || []).map(normalizeMembreship));
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

  const resetForm = () => {
    setEditingId(null);
    setMembershipName("");
    setPrice("");
    setDuration("");
    setDescription("");
    setImagenBase64("");
    setImagenContentType("");
    setError("");
  };

  const handleNuevo = () => {
    resetForm();
  };

  const handleEditar = (item) => {
    const m = normalizeMembreship(item);
    setEditingId(m.id);
    setMembershipName(m.membershipName || "");
    setPrice(m.price === null || m.price === undefined ? "" : String(m.price));
    setDuration(
      m.duration === null || m.duration === undefined ? "" : String(m.duration)
    );
    setDescription(m.description || "");
    setImagenBase64(m.imagen || "");
    setImagenContentType(m.imagenContentType || "");
    setError("");
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta membresía?")) return;

    try {
      await deleteMembreship(id);
      await cargarDatos();
      if (editingId === id) resetForm();
    } catch (e) {
      console.error("Error al eliminar", e);
      setError("No se pudo eliminar la membresía.");
    }
  };

  const formatPrice = (p) => {
    if (p === null || p === undefined || p === "") return "-";
    const n = Number(p);
    if (Number.isNaN(n)) return String(p);
    return n.toLocaleString("es-CO");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const base64 = await readFileAsBase64(file);
      setImagenBase64(base64);
      setImagenContentType(file.type || "");
    } catch (err) {
      console.error("Error leyendo imagen", err);
      setError("No se pudo leer la imagen.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nameTrim = String(membershipName || "").trim();
    if (!nameTrim) {
      setError("membershipName es obligatorio.");
      return;
    }

    let priceValue = null;
    if (String(price).trim() !== "") {
      const n = Number(price);
      if (Number.isNaN(n)) {
        setError("price debe ser numérico.");
        return;
      }
      priceValue = n;
    }

    let durationValue = null;
    if (String(duration).trim() !== "") {
      const n = Number(duration);
      if (!Number.isInteger(n) || n < 0) {
        setError("duration debe ser un entero (0 o mayor).");
        return;
      }
      durationValue = n;
    }

    const descTrim = String(description || "").trim();
    if (descTrim.length > 255) {
      setError("description no puede superar 255 caracteres.");
      return;
    }

    const dto = {
      membershipName: nameTrim,
      price: priceValue,
      duration: durationValue,
      description: descTrim || null,
      imagen: imagenBase64 ? imagenBase64 : null,
      imagenContentType: imagenBase64 ? (imagenContentType || null) : null,
    };

    Object.keys(dto).forEach((k) => {
      if (dto[k] === null || dto[k] === undefined || dto[k] === "") {
        delete dto[k];
      }
    });

    try {
      if (editingId) {
        await updateMembreship({ id: editingId, ...dto });
      } else {
        await createMembreship(dto);
      }
      await cargarDatos();
      resetForm();
    } catch (err) {
      console.error("Error al guardar", err);
      setError("No se pudo guardar. Revisa que coincida con MembreshipDTO.");
    }
  };

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Gestión de Membresías</h1>

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
                    <td className={styles.td}>{formatPrice(item.price)}</td>
                    <td className={styles.td}>{item.duration ?? "-"}</td>
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
              membershipName *
              <input
                type="text"
                value={membershipName}
                onChange={(e) => setMembershipName(e.target.value)}
                className={styles.input}
                placeholder="Premium"
              />
            </label>

            <label className={styles.label}>
              description
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.input}
                placeholder="Descripción"
                maxLength={255}
              />
            </label>

            <label className={styles.label}>
              price
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={styles.input}
                placeholder="19900"
                step="0.01"
              />
            </label>

            <label className={styles.label}>
              duration
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={styles.input}
                placeholder="30"
                step="1"
              />
            </label>

            <label className={styles.label}>
              imagen
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.input}
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

export default AdminMembreships;
