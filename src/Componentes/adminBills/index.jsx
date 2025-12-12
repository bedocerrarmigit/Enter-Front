import React, { useEffect, useState } from "react";
import styles from "../adminPeliculas/AdminPeliculas.module.css";

import { getAllCustomers } from "../../Servicios/customers";
import { getAllBills, createBill, updateBill, deleteBill } from "../../Servicios/bills";

const emptyForm = {
  id: null,
  purchaseDate: "",
  yeard: "",
  numberBill: "",
  customerId: "",
};

function BillsPage() {
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [mode, setMode] = useState("create");
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false); 

  const loadBills = async () => {
    try {
      setLoading(true);
      const data = await getAllBills();
      setBills(data || []);
    } catch (e) {
      console.error("Error cargando bills", e);
      alert("Error cargando facturas (mira consola).");
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const data = await getAllCustomers();
      setCustomers(data || []);
    } catch (e) {
      console.error("Error cargando customers", e);
      setCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    loadBills();
    loadCustomers(); // 
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setMode("create");
    setFormData(emptyForm);
  };

  const handleEdit = (bill) => {
    setMode("edit");
    setFormData({
      id: bill.id ?? null,
      purchaseDate: bill.purchaseDate ?? "",
      yeard: bill.yeard ?? "",
      numberBill: bill.numberBill ?? "",
      customerId: bill.customer?.id ? String(bill.customer.id) : "",
    });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que quieres eliminar esta factura?");
    if (!ok) return;

    try {
      await deleteBill(id);
      if (formData.id === id) resetForm();
      await loadBills();
    } catch (e) {
      console.error("Error eliminando bill", e);
      alert("No se pudo eliminar (mira consola).");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (customers.length === 0) {
      alert("No hay customers. Crea un customer primero.");
      return;
    }

    if (!formData.customerId) {
      alert("Debes seleccionar un customer (obligatorio).");
      return;
    }

    const payload = {
      id: mode === "edit" ? Number(formData.id) : null,
      purchaseDate: formData.purchaseDate || null,
      yeard: formData.yeard !== "" ? Number(formData.yeard) : null,
      numberBill: formData.numberBill !== "" ? Number(formData.numberBill) : null,
      customer: { id: Number(formData.customerId) },
    };

    try {
      if (mode === "create") {
        await createBill(payload);
      } else {
        await updateBill(payload);
      }

      resetForm();
      await loadBills();
    } catch (e) {
      console.error("Error guardando bill", e);
      alert("Error guardando factura (mira consola).");
    }
  };

  const disableSubmit = loadingCustomers || customers.length === 0;

  return (
    <div className={styles.page}>
      <div className={styles.listCard}>
        <div className={styles.listHeader}>
          <h2>Facturas (Bills)</h2>
          <button type="button" className={styles.btnNew} onClick={resetForm}>
            Nuevo
          </button>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : bills.length === 0 ? (
          <p>No hay registros.</p>
        ) : (
          <ul className={styles.list}>
            {bills.map((bill) => (
              <li key={bill.id} className={styles.listItem}>
                <span>
                  <b>ID:</b> {bill.id}{" "}
                  | <b>#</b> {bill.numberBill ?? "-"}{" "}
                  | <b>Fecha:</b> {bill.purchaseDate ?? "-"}{" "}
                  | <b>Cliente:</b> {bill.customer?.id ?? "-"}
                </span>

                <div>
                  <button
                    type="button"
                    className={styles.smallBtn}
                    onClick={() => handleEdit(bill)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className={styles.smallBtnDanger}
                    onClick={() => handleDelete(bill.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.formCard}>
        <h3>{mode === "create" ? "Crear factura" : `Editar factura #${formData.id}`}</h3>

        {loadingCustomers ? (
          <p>Cargando customers...</p>
        ) : customers.length === 0 ? (
          <p style={{ color: "salmon" }}>
            No hay customers creados. Crea un customer primero para poder crear facturas.
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.formField}>
            <span>purchaseDate</span>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => handleChange("purchaseDate", e.target.value)}
            />
          </label>

          <label className={styles.formField}>
            <span>yeard</span>
            <input
              type="number"
              value={formData.yeard}
              onChange={(e) => handleChange("yeard", e.target.value)}
              placeholder="2025"
            />
          </label>

          <label className={styles.formField}>
            <span>numberBill</span>
            <input
              type="number"
              value={formData.numberBill}
              onChange={(e) => handleChange("numberBill", e.target.value)}
              placeholder="10001"
            />
          </label>

          <label className={styles.formField}>
            <span>Customer (obligatorio)</span>
            <select
              value={formData.customerId}
              onChange={(e) => handleChange("customerId", e.target.value)}
              required
              disabled={customers.length === 0}
            >
              <option value="">-- Selecciona un customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.id}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className={styles.btnPrimary} disabled={disableSubmit}>
            {mode === "create" ? "Crear" : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BillsPage;
