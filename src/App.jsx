import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Nav from "./Componentes/Nav";
import Footer from "./Componentes/Footer";
import Contacto from "./Paginas/P_Contactanos";
import Nosotros from "./Paginas/P_Nosotros";

import Inicio from "./Paginas/P_Inicio";
import Login from "./Paginas/P_Login";
import Register from "./Paginas/P_Register";
import Busqueda from "./Paginas/B_Buscar";
import P_Historial from "./Paginas/P_Historial";
import Guia_uso from "./Paginas/P_Guia_de_uso";
import DetallePelicula from "./Componentes/DetallePelicula";
import Formulario from "./paginas/P_Formulario";
import Membresia from "./Paginas/P_Membresia";
import AdminPeliculas from "./Componentes/adminPeliculas";
import AdminCities from "./Componentes/adminCities";
import AdminDepartaments from "./Componentes/adminDepartaments";
import AdminDocumentTypes from "./Componentes/adminDocumentTypes";
import AdminActors from "./Componentes/adminActors";
import AdminSex from "./Componentes/adminSex";
import AdminMembreships from "./Componentes/adminMembreships";
import AdminFilmGenres from "./Componentes/adminFilmGenres";






function App() {
  return (
    <>
    <div className="appContainer">
      <Nav />
      <main className="mainContent">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contactanos" element={<Contacto />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/peliculas" element={<Busqueda />} />
          <Route path="/historial" element={<P_Historial />} />
          <Route path="/guia-de-uso" element={<Guia_uso />} />
          <Route path="/membresia" element={<Membresia />} />
          <Route path="/detalle-pelicula" element={<DetallePelicula />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/admin/peliculas" element={<AdminPeliculas />} />
          <Route path="/admin/ciudades" element={<AdminCities />} />
          <Route path="admin/Departamentos" element={<AdminDepartaments />} />
          <Route path="admin/DocumentTypes" element={<AdminDocumentTypes />} />
          <Route path="admin/adminActors" element={<AdminActors />} />
          <Route path="admin/adminSex" element={<AdminSex />} />
          <Route path="admin/adminMembreships" element={<AdminMembreships />} />
          <Route path="admin/adminFilmGenres" element={<AdminFilmGenres />} />
        </Routes>
      </main>
      <Footer />
      </div>
    </>
  );
}

export default App;

