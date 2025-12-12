import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import styles from "../adminPeliculas/AdminPeliculas.module.css";

import {
  getAllBillMembers,
  createBillMember,
  updateBillMember,
  deleteBillMember,
} from "../../Servicios/billmember";

import { getAllBills } from "../../Servicios/bills";
import { getAllMembreships } from "../../Servicios/membreship";

const AdminBillMember = () => {
  const [list, setList] = useState([]);
  const [bills, setBills] = useState([]);
  const [membreships, setMembreships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingKeys, setEditingKeys] = useState(null);

  const [billId, setBillId] = useState("");
  const [membreshipId, setMembreshipId] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [inicialDate, setInicialDate] = useState("");
  const [finalDate, setFinalDate] = useState("");

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const isAdmin = user && (user.rol === "ADMIN" || user.rol === "ROLE_ADMIN");
  if (!user || !isAdmin) return <Navigate to="/inicio" replace />;

  const loadAll = async () => {
    try {
      setLoading(true);
      const [bm, b, m] = await Promise.all([
        getAllBillMembers(),
        getAllBills(),
        getAllMembreships(),
      ]);
      setList(bm || []);
      setBills(b || []);
      setMembreships(m || []);
    } catch (e) {
      console.error(e);
      setError("No se pudo cargar Bill–Membresía.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const resetForm = () => {
    setEditingKeys(null);
    setBillId("");
    setMembreshipId("");
    setSalePrice("");
    setInicialDate("");
    setFinalDate("");
    setError("");
  };

  const handleEdit = (item) => {
    setEditingKeys({
      billId: item.bill?.id,
      membreshipId: item.membreship?.id,
    });

    setBillId(item.bill?.id ?? "");
    setMembreshipId(item.membreship?.id ?? "");
    setSalePrice(item.salePrice ?? "");
    setInicialDate(item.inicialDate ?? "");
    setFinalDate(item.finalDate ?? "");
  };

  const handleDelete = async (item) => {
    if (!window.confirm("¿Eliminar esta relación?")) return;
    await deleteBillMember(item.bill.id, item.membreship.id);
    resetForm();
    loadAll();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!billId || !membreshipId) {
      setError("Bill y Membreship son obligatorios");
      return;
    }

    const dto = {
      bill: { id: Number(billId) },
      membreship: { id: Number(membreshipId) },
      salePrice: salePrice || null,
      inicialDate: inicialDate || null,
      finalDate: finalDate || null,
    };

    try {
      if (editingKeys) {
        await updateBillMember(
          editingKeys.billId,
          editingKeys.membreshipId,
          dto
        );
      } else {
        await createBillMember(dto);
      }
      resetForm();
      loadAll();
    } catch (e) {
      console.error(e);
      setError("Error guardando la relación");
    }
  };

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Bill – Membresía</h1>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.cardLista}`}>
          <h2>Registros</h2>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th>ID Bill</th>
                  <th>Membresía</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.map((i) => (
                  <tr key={`${i.bill.id}-${i.membreship.id}`}>
                    <td>{i.bill.id}</td>
                    <td>{i.membreship.membershipName}</td>
                    <td>{i.salePrice ?? "-"}</td>
                    <td>
                      <button
                        className={styles.botonEditar}
                        onClick={() => handleEdit(i)}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.botonEliminar}
                        onClick={() => handleDelete(i)}
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
          <h2>{editingKeys ? "Editar" : "Crear"}</h2>

          <form onSubmit={handleSubmit}>
            <select value={billId} onChange={(e) => setBillId(e.target.value)}>
              <option value="">Bill</option>
              {bills.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id}
                </option>
              ))}
            </select>

            <select
              value={membreshipId}
              onChange={(e) => setMembreshipId(e.target.value)}
            >
              <option value="">Membresía</option>
              {membreships.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.membershipName}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="salePrice"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />

            <input
              type="date"
              value={inicialDate}
              onChange={(e) => setInicialDate(e.target.value)}
            />

            <input
              type="date"
              value={finalDate}
              onChange={(e) => setFinalDate(e.target.value)}
            />

            <button className={styles.botonSubmit}>
              {editingKeys ? "Guardar" : "Crear"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminBillMember;
