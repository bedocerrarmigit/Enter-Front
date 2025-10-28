// src/Componentes/Footer/index.jsx
import React from "react";
import styles from "./Footer.module.css";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";


const XIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M3 3h4.7l5.34 7.47L19.24 3H22l-7.2 9.1L22 21h-4.7l-5.64-7.88L4.76 21H2l7.46-9.44L3 3z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.topAccent} aria-hidden />

      <div className={styles.grid}>
        <div className={styles.brandCol}>
          <div className={styles.brandRow}>
            <div>
              <h4 className={styles.brandTitle}>ENTERTAINMENT</h4>
              <p className={styles.brandSubtitle}>Tu guía de películas y series</p>
            </div>
          </div>

          <ul className={styles.contactList}>
            <li>
              <FaPhone className={styles.contactIcon} />
              <span>647-754-0072</span>
            </li>
            <li>
              <FaEnvelope className={styles.contactIcon} />
              <span>support@entertainment.com</span>
            </li>
            <li>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>Bogotá - Colombia</span>
            </li>
          </ul>
        </div>

        <div className={styles.linksCol}>
          <h4 className={styles.colTitle}>ENLACES</h4>
          <ul className={styles.linksList}>
            <li><Link to="/Inicio">Inicio</Link></li>
            <li><Link to="/Nosotros">Nosotros</Link></li>
            <li><Link to="/Membresia">Membresía</Link></li>
            <li><Link to="/Contactanos">Contacto</Link></li>
          </ul>
        </div>

        {/* Columna 3 - Redes sociales */}
        <div className={styles.socialCol}>
          <h4 className={styles.colTitle}>REDES SOCIALES</h4>
          <div className={styles.socialRow}>
            <a href="#" aria-label="Facebook" className={styles.socialBtn}><FaFacebook /></a>
            <a href="#" aria-label="Instagram" className={styles.socialBtn}><FaInstagram /></a>
            {/* [CAMBIO] X con SVG inline */}
            <a href="#" aria-label="X (Twitter)" className={styles.socialBtn}><XIcon /></a>
            <a href="#" aria-label="YouTube" className={styles.socialBtn}><FaYoutube /></a>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>© {new Date().getFullYear()} • ENTERTAIMENT 2025</span>
      </div>
    </footer>
  );
};

export default Footer;
