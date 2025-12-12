import React, { useEffect, useMemo, useState } from "react";
import styles from "../adminPeliculas/AdminPeliculas.module.css";

import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../Servicios/customers";

import { getAllUsers } from "../../Servicios/user";
import { getAllFilmGenres } from "../../Servicios/filmGenre";
import { getAllDocumentTypes } from "../../Servicios/documentType";
import { getAllSex } from "../../Servicios/sex";
import { getAllCities } from "../../Servicios/city";

const emptyForm = {
  id: null,
  documentNumber: "",
  firstName: "",
  secondName: "",
  firstLasName: "",
  secondLastName: "",
  userId: "",
  documentTypeId: "",
  sexId: "",
  cityId: "",
  filmGenreIds: [],
};

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [mode, setMode] = useState("create");
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [docTypes, setDocTypes] = useState([]);
  const [sexList, setSexList] = useState([]);
  const [cities, setCities] = useState([]);
  const [filmGenres, setFilmGenres] = useState([]);

  const selectedGenresText = useMemo(
    () => formData.filmGenreIds.join(","),
    [formData.filmGenreIds]
  );

  const resetForm = () => {
    setMode("create");
    setFormData(emptyForm);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenreIdsChange = (value) => {
    const arr = value
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n));
    setFormData((prev) => ({ ...prev, filmGenreIds: arr }));
  };

  const loadAll = async () => {
    try {
      setLoading(true);

      const [c, u, dt, sx, ct, fg] = await Promise.all([
        getAllCustomers(),
        getAllUsers(),
        getAllDocumentTypes(),
        getAllSex(),
        getAllCities(),
        getAllFilmGenres(),
      ]);

      setCustomers(c || []);
      setUsers(u || []);
      setDocTypes(dt || []);
      setSexList(sx || []);
      setCities(ct || []);
      setFilmGenres(fg || []);
    } catch (e) {
      console.error("Error cargando customer data", e);
      alert("Error cargando data de Customers (mira consola).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleEdit = (c) => {
    setMode("edit");
    setFormData({
      id: c.id ?? null,
      documentNumber: c.documentNumber ?? "",
      firstName: c.firstName ?? "",
      secondName: c.secondName ?? "",
      firstLasName: c.firstLasName ?? "",
      secondLastName: c.secondLastName ?? "",
      userId: c.user?.id ?? "",
      documentTypeId: c.documentType?.id ?? "",
      sexId: c.sex?.id ?? "",
      cityId: c.cities?.id ?? "",
      filmGenreIds: (c.filmGenres || []).map((g) => Number(g.id)),
    });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Eliminar este customer?");
    if (!ok) return;

    try {
      await deleteCustomer(id);
      if (formData.id === id) resetForm();
      await loadAll();
    } catch (e) {
      console.error("Error eliminando customer", e);
      alert("No se pudo eliminar (mira consola).");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.documentNumber) return alert("documentNumber es obligatorio");
    if (!formData.firstName) return alert("firstName es obligatorio");
    if (!formData.firstLasName) return alert("firstLasName es obligatorio");

    if (!formData.userId) return alert("user es obligatorio");
    if (!formData.documentTypeId) return alert("documentType es obligatorio");
    if (!formData.sexId) return alert("sex es obligatorio");
    if (!formData.cityId) return alert("cities es obligatorio");

    if (!formData.filmGenreIds.length)
      return alert("filmGenres es obligatorio (mínimo 1)");

    const payload = {
      id: mode === "edit" ? Number(formData.id) : null,
      documentNumber: formData.documentNumber,
      firstName: formData.firstName,
      secondName: formData.secondName || null,
      firstLasName: formData.firstLasName,
      secondLastName: formData.secondLastName || null,
      user: { id: Number(formData.userId) },
      documentType: { id: Number(formData.documentTypeId) },
      sex: { id: Number(formData.sexId) },
      cities: { id: Number(formData.cityId) },
      filmGenres: formData.filmGenreIds.map((id) => ({ id: Number(id) })),
    };

    try {
      if (mode === "create") {
        await createCustomer(payload);
      } else {
        await updateCustomer(Number(formData.id), payload);
      }

      resetForm();
      await loadAll();
    } catch (e) {
      console.error("Error guardando customer", e);
      const msg =
        e?.response?.data?.mensaje ||
        e?.response?.data?.error ||
        e?.response?.data?.detalle ||
        JSON.stringify(e?.response?.data) ||
        e?.message;

      alert("Error guardando customer: " + msg);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Customers</h2>
          <button className={styles.btnPrimary} type="button" onClick={resetForm}>
            Nuevo
          </button>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : customers.length === 0 ? (
          <p>No hay registros.</p>
        ) : (
          <ul className={styles.list}>
            {customers.map((c) => (
              <li className={styles.item} key={c.id}>
                <div className={styles.meta}>
                  <div>
                    <b>ID:</b> {c.id} | <b>Doc:</b> {c.documentNumber} |{" "}
                    <b>Nombre:</b> {c.firstName} {c.firstLasName}
                  </div>
                  <div>
                    <b>User:</b> {c.user?.login ?? c.user?.id ?? "-"} |{" "}
                    <b>City:</b> {c.cities?.id ?? "-"}
                  </div>
                </div>
                <div className={styles.actions}>
                  <button className={styles.btn} type="button" onClick={() => handleEdit(c)}>
                    Editar
                  </button>
                  <button
                    className={styles.btnDanger}
                    type="button"
                    onClick={() => handleDelete(c.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <h2>{mode === "create" ? "Crear customer" : `Editar customer #${formData.id}`}</h2>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row2}>
            <label className={styles.field}>
              <span>documentNumber *</span>
              <input
                value={formData.documentNumber}
                onChange={(e) => handleChange("documentNumber", e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>user *</span>
              <select
                value={formData.userId}
                onChange={(e) => handleChange("userId", e.target.value)}
              >
                <option value="">Selecciona...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.login ?? u.username ?? "user"} (id:{u.id})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.row2}>
            <label className={styles.field}>
              <span>firstName *</span>
              <input value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
            </label>

            <label className={styles.field}>
              <span>secondName</span>
              <input value={formData.secondName} onChange={(e) => handleChange("secondName", e.target.value)} />
            </label>
          </div>

          <div className={styles.row2}>
            <label className={styles.field}>
              <span>firstLasName *</span>
              <input value={formData.firstLasName} onChange={(e) => handleChange("firstLasName", e.target.value)} />
            </label>

            <label className={styles.field}>
              <span>secondLastName</span>
              <input value={formData.secondLastName} onChange={(e) => handleChange("secondLastName", e.target.value)} />
            </label>
          </div>

          <div className={styles.row2}>
            <label className={styles.field}>
              <span>documentType *</span>
              <select value={formData.documentTypeId} onChange={(e) => handleChange("documentTypeId", e.target.value)}>
                <option value="">Selecciona...</option>
                {docTypes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.documentTypeName ?? d.name ?? `id:${d.id}`}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>sex *</span>
              <select value={formData.sexId} onChange={(e) => handleChange("sexId", e.target.value)}>
                <option value="">Selecciona...</option>
                {sexList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.sexName ?? s.name ?? `id:${s.id}`}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className={styles.field}>
            <span>cities *</span>
            <select value={formData.cityId} onChange={(e) => handleChange("cityId", e.target.value)}>
              <option value="">Selecciona...</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.cityName ?? c.name ?? `id:${c.id}`}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>filmGenres * (IDs separados por coma)</span>
            <input
              value={selectedGenresText}
              onChange={(e) => handleGenreIdsChange(e.target.value)}
              placeholder={filmGenres.length ? `Ej: ${filmGenres[0].id}` : "Ej: 1,2"}
            />
            <div className={styles.hint}>
              Disponibles:{" "}
              {filmGenres
                .slice(0, 8)
                .map((g) => `${g.id}:${g.movieGenre ?? g.filmGenreName ?? g.name ?? ""}`)
                .join(" | ")}
              {filmGenres.length > 8 ? " ..." : ""}
            </div>
          </label>

          <button className={styles.btnPrimary} type="submit">
            {mode === "create" ? "Crear" : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
}
