import React from "react";
import estilos from "./Busqueda.module.css";
import { Link } from "react-router-dom";

const TarjetaPelicula = ({ titulo, sinopsis, año, genero, puntuacion }) => {
  return (
    <div className={estilos.tarjeta}>
      <div className={estilos.imagen}></div>

      <div className={estilos.detalles}>
        <h3 className={estilos.titulo}>{titulo}</h3>
        <p className={estilos.sinopsis}>{sinopsis}</p>
      </div>

      <div className={estilos.info}>
        <p className={estilos.dato}><strong>Año:</strong> {año}</p>
        <p className={estilos.dato}><strong>Género:</strong> {genero}</p>
        <p className={estilos.dato}><strong>Puntuación:</strong> {puntuacion}</p>
        <Link className={estilos.enlace} to="/detalle-pelicula">--- Ver más ---</Link>
      </div>
    </div>
  );
};
const Busqueda = () => {
  const peliculas = [
    { titulo: "titulo", sinopsis: "sinopsis", año: "Año", genero: "Género", puntuacion: "Puntuación" },
    { titulo: "titulo", sinopsis: "sinopsis", año: "Año", genero: "Género", puntuacion: "Puntuación" },
    { titulo: "titulo", sinopsis: "sinopsis", año: "Año", genero: "Género", puntuacion: "Puntuación" },
  ];

  return (
    <div className={estilos.contenedor}>
      <h2 className={estilos.encabezado}>Mejores Peliculas del 2000</h2>
      {peliculas.map((pelicula, i) => (
        <TarjetaPelicula key={i} {...pelicula} />
      ))}
    </div>
  );
};

export default Busqueda;
