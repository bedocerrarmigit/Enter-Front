import React from "react";
import { Link } from "react-router-dom";
import style from "./Nav.module.css";

function Nav() {
  return (
    <div className={style.contenedor_nav}>
      <img src="/logo.png" alt="Logo" className={style.logo} />
      <nav className={style.contenedor_a}>
        <Link className={style.a} to="/inicio">Inicio</Link>
        <Link className={style.a} to="/membresia">Membresia</Link>
        <Link className={style.a} to="/contactanos">Contactanos</Link>
        <Link className={style.a} to="/nosotros">Nosotros</Link>
        <Link className={style.a} to="/login">Login</Link>
        <Link className={style.a} to="/register">Register</Link>
      </nav>
    </div>
  );
}

export default Nav;
