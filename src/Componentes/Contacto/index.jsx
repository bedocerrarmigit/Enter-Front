import React from "react";
import styles from './Contacto.module.css';

const Contacto = () => {
  return (
    <section className={styles.contactSection}>
      <h2>Contáctanos</h2>
      <p>
        Si tienes alguna pregunta o algún problema contáctate con nosotros para resolver tus dudas o problemas emergentes en nuestra página web
      </p>

      <form className={styles.form}>
        <label htmlFor="nombre">Nombres</label>
        <input
          type="text"
          id="nombre"
          placeholder="[Tu nombre de usuario en la página]"
        />

        <label htmlFor="correo">Correo electrónico</label>
        <input
          type="email"
          id="correo"
          placeholder="[Escribe tu correo electrónico]"
        />

        <label htmlFor="reporte">Reporte</label>
        <input
          id="reporte"
          rows="6"
          placeholder="[Escribe detalladamente tu reporte del problema emergente]"
        />

        <button type="submit">Enviar Mensaje</button>
      </form>
    </section>
  );
};

export default Contacto;