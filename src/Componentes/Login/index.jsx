import React from "react";
import style from "./Login.module.css";
import { FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";


function Login() {
  return (
    <section className={style.contenedor}>
      <div className={style.loginBox}>
        <h2>Iniciar Sesión</h2>
        <form>
          <label>Correo Electronico</label>
          <input type="text" placeholder="Ingresa tu correo electronico" />

          <label>Contraseña</label>
          <input type="password" placeholder="Ingresa tu contraseña" />

          <button type="submit">Iniciar Sesión</button>
        </form>
<p className={style.registro}>
  ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
</p>

      </div>
    </section>
  );
}

export default Login;
