import React from "react";
import estilos from "./DetallePelicula.module.css";

const DetallePelicula = () => {
  return (
    <div className={estilos.contenedor}>
      <div className={estilos.seccionSuperior}>
        <div className={estilos.imagen}></div>
        <div className={estilos.tituloSinopsis}>
          <h2 className={estilos.titulo}>TITULO</h2>
          <p className={estilos.sinopsis}>Synopsis</p>
        </div>
      </div>
      <div className={estilos.puntuacion}>
        Puntuación 1/5
      </div>
      <div className={estilos.seccionInferior}>
        <div className={estilos.descripcion}>
          Descripción
        </div>
        <div className={estilos.trailer}>
          Trailer
        </div>
        <div className={estilos.comentarios}>
          Comentarios
        </div>
      </div>
    </div>
  );
};

export default DetallePelicula;