import React from 'react';
import styles from './Membresia.module.css';
import { Link } from 'react-router-dom';

const Membresia = () => {
  return (
    <div className={styles.membresia}>
      <h1>Planes de Membresía</h1>
      <div className={styles.planes}>
        <div className={styles.plan}>
          <h2>FAN</h2>
          <p className={styles.precio}>COP 12.900/mes</p>
          <ul>
            <li>✔️ Sin anuncios</li>
            <li>✔️ Preguntas ilimitadas</li>
            <li>✔️ Poder puntuar y calificar</li>
          </ul>
                    <Link
            to="/formulario"
            state={{ nombre: 'FAN', precio: 'COP 12.900', duracion: '1 mes' }}
            className={styles.boton}
          >
            --- Comprar ---
          </Link>

        </div>
        <div className={styles.plan}>
          <h2>PLUS (3 mes)</h2>
          <p className={styles.precio}>COP 30.960/3meses</p>
          <ul>
            <li>✔️ Todo lo anterior</li>
            <li>✔️ 20% de de  scuento respecto al primer plan</li>
          </ul>
                    <Link
            to="/formulario"
            state={{ nombre: 'FAN', precio: 'COP 12.900', duracion: '1 mes' }}
            className={styles.boton}
          >
            --- Comprar ---
          </Link>

        </div>
        <div className={styles.plan}>
          <h2>MEGA FAN (6 meses)</h2>
          <p className={styles.precio}>COP 50.310/6meses</p>
          <ul>
            <li>✔️ Todo lo anterior</li>
            <li>✔️ 35% de descuento respecto al primer plan</li>
          </ul>
                    <Link
            to="/formulario"
            state={{ nombre: 'FAN', precio: 'COP 12.900', duracion: '1 mes' }}
            className={styles.boton}
          >
            --- Comprar ---
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Membresia;
