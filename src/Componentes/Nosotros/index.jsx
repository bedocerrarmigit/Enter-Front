import React from "react";
import styles from './Nosotros.module.css';

const Nosotros = () => {
  return (
    <div className={styles.nosotros}>
      <h2>Nosotros</h2>
      <p>
        Somos una página web dedicada a la recomendación de entretenimiento según la búsqueda que quiera el cliente.
      </p>
      <p>
        Nuestro objetivo como página es lograr la facilitación a las personas de tener búsquedas eficientes ante sus gustos en los momentos en donde no sepan qué ver. Nos encargaremos de recomendar.
      </p>

      <h3>¿Qué hacemos?</h3>
      <ul>
        <li>Recomendaciones inteligentes</li>
        <li>Responder preguntas</li>
        <li>Enfoque en películas y series</li>
        <li>Siempre aprendiendo</li>
      </ul>
    </div>

  );
};

export default Nosotros;
