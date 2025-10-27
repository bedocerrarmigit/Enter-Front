import React, { useState } from "react";
import style from "./Register.module.css";
import { Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    nacionalidad: "",
    genero: "",
    telefono: "",
    nacimiento: "",
    correo: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
  };

  return (
    <section className={style.contenedor}>
      <div className={style.registerBox}>
        <h2>Regístrate</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            placeholder="Ingresa tu nombre"
            value={formData.nombre}
            onChange={handleChange}
          />

          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            placeholder="Ingresa tu apellido"
            value={formData.apellido}
            onChange={handleChange}
          />

          <label>Nacionalidad</label>
          <input
            type="text"
            name="nacionalidad"
            placeholder="Ingresa tu nacionalidad"
            value={formData.nacionalidad}
            onChange={handleChange}
          />

          <label>Género</label>
          <select
            name="genero"
            value={formData.genero}
            onChange={handleChange}
          >
            <option value="">Selecciona tu género</option>
            <option value="1">Masculino</option>
            <option value="2">Femenino</option>
          </select>

          <label>Teléfono</label>
          <input
            type="tel"
            name="telefono"
            placeholder="Ingresa tu número"
            value={formData.telefono}
            onChange={handleChange}
          />

          <label>Fecha de Nacimiento</label>
          <input
            type="date"
            name="nacimiento"
            value={formData.nacimiento}
            onChange={handleChange}
          />

          <label>Correo Electrónico</label>
          <input
            type="email"
            name="correo"
            placeholder="Ingresa tu correo"
            value={formData.correo}
            onChange={handleChange}
          />

          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit">Registrarse</button>
        </form>

        <p className={style.inicioSesion}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
