import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./Nav.module.css";

function Nav() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parseando user de localStorage", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/inicio");
  };

  const isAdmin =
    user && (user.rol === "ADMIN" || user.rol === "ROLE_ADMIN");

  return (
    <div className={style.contenedor_nav}>
      <Link to="/inicio">
        <img src="/logo.png" alt="Logo" className={style.logo} />
      </Link>

      <nav className={style.contenedor_a}>
        <Link className={`${style.a} ${style.mainLink}`} to="/inicio">
          Inicio
        </Link>
        <Link className={`${style.a} ${style.mainLink}`} to="/membresia">
          Membresia
        </Link>
        <Link className={`${style.a} ${style.mainLink}`} to="/contactanos">
          Contactanos
        </Link>
        <Link className={`${style.a} ${style.mainLink}`} to="/nosotros">
          Nosotros
        </Link>

        {isAdmin && (
          <div className={style.dropdownAdmin}>
            <button
              type="button"
              className={`${style.a} ${style.dropdownToggle}`}
            >
              Entidades ADMIN ▾
            </button>
            <div className={style.dropdownMenu}>
              <Link className={style.dropdownItem} to="/admin/peliculas">
                Películas
              </Link>
              <Link className={style.dropdownItem} to="/admin/ciudades">
                Ciudades
              </Link>
              <Link className={style.dropdownItem} to="/admin/departamentos">
                Departamentos
              </Link>
              <Link className={style.dropdownItem} to="/admin/documentTypes">
                Tipos de Documento
              </Link>
              <Link className={style.dropdownItem} to="/admin/adminActors">
                Actor  
              </Link>
              <Link className={style.dropdownItem} to="/admin/adminSex">
                Sexo
              </Link>
              <Link className={style.dropdownItem} to="/admin/adminMembreships">
                Membresías
              </Link>
              <Link className={style.dropdownItem} to="/admin/adminFilmGenres">
                Géneros de Película
              </Link>
            </div>
          </div>
        )}

        {!user && (
          <>
            <Link
              className={`${style.a} ${style.mainLink}`}
              to="/login"
            >
              Login
            </Link>
            <Link
              className={`${style.a} ${style.mainLink}`}
              to="/register"
            >
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <span className={style.a}>
              {user.nombreCompleto} ({user.rol})
            </span>
            <button
              type="button"
              className={style.a}
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </nav>
    </div>
  );
}

export default Nav;
