import React, { useState, useEffect } from 'react';
import styles from './Formulario.module.css';
import { useLocation } from 'react-router-dom';

function Formulario() {
  const location = useLocation();
  const [plan, setPlan] = useState('');
  const [datos, setDatos] = useState({
    nombre: '',
    cedula: '',
    tarjeta: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPlan(params.get('plan'));
  }, [location]);

  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    alert(`¡Gracias ${datos.nombre}!\nHas comprado el plan ${plan}`);
  };

  return (
    <div className={styles.formulario}>
      <h2>Formulario de pago - {plan}</h2>
      <form onSubmit={manejarEnvio}>
        <label htmlFor="nombre">Nombre completo:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          required
          onChange={manejarCambio}
        />

        <label htmlFor="cedula">Cédula:</label>
        <input
          type="text"
          id="cedula"
          name="cedula"
          required
          onChange={manejarCambio}
        />

        <label htmlFor="tarjeta">Tarjeta:</label>
        <input
          type="text"
          id="tarjeta"
          name="tarjeta"
          maxLength="16"
          required
          onChange={manejarCambio}
        />

        <button type="submit">Pagar</button>
      </form>
    </div>
  );
}

export default Formulario;
