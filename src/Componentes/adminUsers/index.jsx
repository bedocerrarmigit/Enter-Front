import React, { useEffect, useMemo, useState } from "react";
import styles from "../adminPeliculas/AdminPeliculas.module.css";

import { getAllUsers, createUser, updateUser, deleteUser } from "../../Servicios/user";

const emptyForm = {
  id: null,
  login: "",
  firstName: "",
  lastName: "",
  email: "",
  activated: true,
  langKey: "es",
  imageUrl: "",
  password: "",
  authorities: [],
};

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [mode, setMode] = useState("create");
  const [loading, setLoading] = useState(false);


  const authoritiesText = useMemo(() => formData.authorities.join(","), [formData.authorities]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (e) {
      console.error("Error cargando users", e);
      alert("Error cargando usuarios (mira consola).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setMode("create");
    setFormData(emptyForm);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAuthoritiesChange = (value) => {
    const arr = value
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, authorities: arr }));
  };

  const handleEdit = (u) => {
    setMode("edit");
    setFormData({
      id: u.id ?? null,
      login: u.login ?? "",
      firstName: u.firstName ?? "",
      lastName: u.lastName ?? "",
      email: u.email ?? "",
      activated: !!u.activated,
      langKey: u.langKey ?? "es",
      imageUrl: u.imageUrl ?? "",
      password: "",
      authorities: Array.isArray(u.authorities) ? u.authorities : (u.authorities ? Array.from(u.authorities) : []),
    });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que quieres eliminar este usuario?");
    if (!ok) return;

    try {
      await deleteUser(id);
      if (formData.id === id) resetForm();
      await loadUsers();
    } catch (e) {
      console.error("Error eliminando user", e);
      alert("No se pudo eliminar (mira consola).");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.login) {
      alert("login es obligatorio.");
      return;
    }

    const payload = {
      id: mode === "edit" ? Number(formData.id) : null,
      login: formData.login,
      firstName: formData.firstName || null,
      lastName: formData.lastName || null,
      email: formData.email || null,
      activated: !!formData.activated,
      langKey: formData.langKey || null,
      imageUrl: formData.imageUrl || null,
      authorities: formData.authorities?.length ? formData.authorities : [],
    };

    if (mode === "create") {
      if (!formData.password) {
        alert("password es obligatorio al crear.");
        return;
      }
      payload.password = formData.password;
    } else {
      if (formData.password) payload.password = formData.password;
    }

    try {
      if (mode === "create") await createUser(payload);
      else await updateUser(payload);

      resetForm();
      await loadUsers();
    } catch (e) {
      console.error("Error guardando user", e);
      alert("Error guardando usuario (mira consola).");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.listCard}>
        <div className={styles.listHeader}>
          <h2>Users</h2>
          <button type="button" className={styles.btnNew} onClick={resetForm}>
            Nuevo
          </button>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : users.length === 0 ? (
          <p>No hay registros.</p>
        ) : (
<ul className={styles.list}>
  {users.map((u) => (
    <li key={u.id} className={styles.listItem}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div>
          <b>ID:</b> {u.id} | <b>login:</b> {u.login ?? "-"} | <b>email:</b> {u.email ?? "-"}
        </div>
        <div>
          <b>activated:</b> {String(!!u.activated)} | <b>roles:</b> {(u.authorities || []).join(", ") || "-"}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" className={styles.smallBtn} onClick={() => handleEdit(u)}>
          Editar
        </button>
        <button type="button" className={styles.smallBtnDanger} onClick={() => handleDelete(u.id)}>
          Eliminar
        </button>
      </div>
    </li>
  ))}
</ul>

        )}
      </div>

      <div className={styles.formCard}>
        <h3>{mode === "create" ? "Crear user" : `Editar user #${formData.id}`}</h3>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.formField}>
            <span>login *</span>
            <input value={formData.login} onChange={(e) => handleChange("login", e.target.value)} />
          </label>

          <label className={styles.formField}>
            <span>firstName</span>
            <input value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
          </label>

          <label className={styles.formField}>
            <span>lastName</span>
            <input value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
          </label>

          <label className={styles.formField}>
            <span>email</span>
            <input value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
          </label>

          <label className={styles.formField}>
            <span>langKey</span>
            <input value={formData.langKey} onChange={(e) => handleChange("langKey", e.target.value)} placeholder="es" />
          </label>

          <label className={styles.formField}>
            <span>imageUrl</span>
            <input value={formData.imageUrl} onChange={(e) => handleChange("imageUrl", e.target.value)} />
          </label>

          <label className={styles.formField}>
            <span>activated</span>
            <select
              value={String(formData.activated)}
              onChange={(e) => handleChange("activated", e.target.value === "true")}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </label>

          <label className={styles.formField}>
            <span>authorities (separadas por coma)</span>
            <input
              value={authoritiesText}
              onChange={(e) => handleAuthoritiesChange(e.target.value)}
              placeholder="ROLE_USER,ROLE_ADMIN"
            />
          </label>

          <label className={styles.formField}>
            <span>{mode === "create" ? "password *" : "password (opcional)"}</span>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </label>

          <button type="submit" className={styles.btnPrimary}>
            {mode === "create" ? "Crear" : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UsersPage;
