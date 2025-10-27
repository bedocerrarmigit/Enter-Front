import React from "react";
import styles from './Footer.module.css';
import { FaFacebook, FaInstagram, FaTwitter, FaGooglePlusG, FaYoutube } from 'react-icons/fa';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.socialIcons}>
        <FaFacebook />
        <FaInstagram />
        <FaTwitter />
        <FaGooglePlusG />
        <FaYoutube />
      </div>
      <ul className={styles.footerLinks}>
        <Link to="/Inicio"> Home</Link>
        <Link to="/Membresia"> Membresia</Link>
        <Link to="/Nosotros"> Nosotros</Link>
        <Link to="/Contactanos"> Contactanos</Link>
      </ul>
      <p className={styles.copy}>Copyright @2025; Designed by ENTERTAIMENT</p>
    </footer>
  );
};

export default Footer;
