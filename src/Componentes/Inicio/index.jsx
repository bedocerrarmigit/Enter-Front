import React from "react";
import style from "./Inicio.module.css";
import { FiSend } from "react-icons/fi";
import { FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";

function Inicio() {
  const navegar = useNavigate();

  const manejarClick = () => {
    navegar("/peliculas"); 
  };

  const guiaClick = () => {
    navegar("/guia-de-uso"); 
  };

  const irAHistorial = () => {
    navegar("/historial");
  };

  return (
    <section className={style.contenedor}>
      <div className={style.lateral}>
        <div className={style.recomendaciones}>
          <strong>RECOMENDACIONES</strong>
          <p>
            Para usar el buscador escribe palabras clave como: acción, miedo, +18,
            Disney. Para saber mejor el funcionamiento consulta "Guía De Uso".
          </p>
          <button onClick={guiaClick}>Guía De Uso</button>
        </div>
        <button onClick={irAHistorial}className={style.historial}>
          <FaHistory /> 
          <Link className= {style.a} to= "/Historial"> Historial</Link>
        </button>
      </div>

      <div className={style.centro}>
        <h1>Entretainment.net</h1>
        <p>Chat Español</p>
        <div className={style.buscador}>
          <input type="text" placeholder="Escribe aquí" />
          <button onClick={manejarClick}>
            <FiSend />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Inicio;