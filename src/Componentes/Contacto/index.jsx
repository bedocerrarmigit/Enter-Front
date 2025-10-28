import React from "react";
import styles from './Contacto.module.css';

const Contacto = () => {
  return (
    <section className={styles.contactSection}>
      <h2 className={styles.title}>Contáctanos</h2>

      <div className={styles.contactGrid}>
        <aside className={styles.infoPanel}>
          <h3 className={styles.infoHeading}>Ubicación</h3>
          <address className={styles.address}>
            Bogotá - Colombia <br />
          </address>

          <h3 className={styles.infoHeading}>Síguenos</h3>

          <nav className={styles.socials}>
            <a href="#" aria-label="Facebook" className={styles.socialBtn}>
              {/* SVG Facebook */}
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06C2 17.08 5.66 21.21 10.44 22v-7.02H7.9v-2.92h2.54V9.79c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.92h-2.33V22C18.34 21.21 22 17.08 22 12.06z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className={styles.socialBtn}>
              {/* SVG Instagram */}
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18 6.25a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 18 6.25z"/>
              </svg>
            </a>
            <a href="#" aria-label="X" className={styles.socialBtn}>
              {/* SVG X / Twitter */}
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M3 3h4.7l5.34 7.47L19.24 3H22l-7.2 9.1L22 21h-4.7l-5.64-7.88L4.76 21H2l7.46-9.44L3 3z"/>
              </svg>
            </a>
          </nav>

          <small className={styles.legal}>© 2025 • Política de privacidad</small>
        </aside>

        <div className={styles.formWrap}>
          <div className={styles.accent} aria-hidden />

          <p className={styles.description}>
            Si tienes alguna pregunta o algún problema contáctate con nosotros para
            resolver tus dudas o problemas emergentes en nuestra página web
          </p>

          <form className={styles.form} onSubmit={(e)=>e.preventDefault()}>
            <label htmlFor="nombre">Nombres</label>
            <input
              type="text"
              id="nombre"
              placeholder="[Tu nombre de usuario en la página]"
              required
            />

            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              placeholder="[Escribe tu correo electrónico]"
              required
            />

            <label htmlFor="reporte">Reporte</label>

            <textarea
              id="reporte"
              rows={7}
              placeholder="[Escribe detalladamente tu reporte del problema emergente]"
              required
            />

            <button type="submit" className={styles.submitBtn}>Enviar Mensaje</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
