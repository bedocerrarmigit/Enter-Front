import React from "react";
import style from "./Historial.module.css";
import { Link } from "react-router-dom";

const datosFicticios = [
  {
    titulo: "a",
    sinopsis: "a",
    fecha: "01/07/2025",
  },
  {
    titulo: "b",
    sinopsis: "b",
    fecha: "30/06/2025",

  },
  {
    titulo: "b",
    sinopsis: "b",
    fecha: "29/06/2025",
  }
];

function Historial() {
  return (
    <div className={style.historial}>
      <h1>Historial</h1>
      <div className={style.contenedor}>
        {datosFicticios.map((item, index) => (
          <div key={index} className={style.item}>
            <div className={style.info}>
              <div className={style.imagenes}>
              </div>
              <div>
                <strong>{item.titulo}</strong>
                <p>{item.sinopsis}</p>
              </div>
            </div>
            <div className={style.detalle}>
              <p>{item.fecha}</p>
              <Link className={style.vermas} to="/detalle-pelicula">--- Ver más ---</Link>
            </div>
          </div>
        ))}
      </div>
      <div className={style.boton}>
        <button>Ver historial completo</button>
      </div>
    </div>
  );
}

export default Historial;