import React from "react";
import styles from "./Guia_uso.module.css";

const SECCIONES = [
  {
    id: "simple",
    titulo: "Búsqueda Simple",
    items: [
      "Género: acción, comedia, drama, terror, ciencia ficción, romance, thriller, documental, animación, fantasía, crimen, musical, etc.",
      "Año: año específico (2022) o rango (de 2010 a 2020).",
      "País o idioma: EE.UU., Francia, Corea del Sur, Japón, idioma español, etc.",
      "Duración: corta (≤90 min), media (90-120 min), larga (≥120 min).",
    ],
  },
  {
    id: "tematica",
    titulo: "Búsqueda Temática",
    items: [
      "Estado de ánimo: divertida, triste, inspiradora, romántica, reflexiva, oscura.",
      "Temas: viajes en el tiempo, apocalipsis, IA, crimen verdadero, amistad, redención, etc.",
      "Ambientación: futurista, histórica, actual, medieval, cyberpunk, espacial.",
    ],
  },
  {
    id: "participacion",
    titulo: "Participación",
    items: [
      "Director/a: Christopher Nolan, Greta Gerwig, Bong Joon-ho…",
      "Actor/Actriz: Leonardo DiCaprio, Zendaya, Keanu Reeves…",
      "Franquicia o saga: Marvel, Star Wars, Harry Potter…",
    ],
  },
  {
    id: "calidad",
    titulo: "Calidad",
    items: [
      "Popularidad: más vistas, recomendadas por críticos, tendencia actual.",
      "Filtra por puntuación/ratings si tu fuente lo permite.",
    ],
  },
  {
    id: "ejemplos",
    titulo: "Ejemplos de Búsqueda",
    items: [
      "“Películas de ciencia ficción de los 90 con buena crítica”.",
      "“Comedias románticas con menos de 100 minutos y en español”.",
      "“Películas coreanas de crimen recomendadas por críticos”.",
      "“Documentales históricos ganadores del Óscar”.",
    ],
  },
];

function Guia_uso() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Guía de Uso — Búsqueda</h1>

        {/* Flujo tipo diagrama */}
        <nav className={styles.flow}>
          {SECCIONES.map((sec, i) => (
            <a key={sec.id} href={`#${sec.id}`} className={styles.flowNode}>
              <div className={styles.nodeIcon} aria-hidden>●</div>
              <div className={styles.nodeText}>{sec.titulo}</div>
              {i < SECCIONES.length - 1 && <span className={styles.arrow} aria-hidden>➜</span>}
            </a>
          ))}
        </nav>
      </header>

      {/* Contenido ordenado en grid */}
      <section className={styles.grid}>
        {SECCIONES.map((sec) => (
          <article key={sec.id} id={sec.id} className={styles.card}>
            <h2 className={styles.subtitle}>{sec.titulo}</h2>
            <ul className={styles.list}>
              {sec.items.map((txt, idx) => (
                <li key={idx} className={styles.item}>
                  <span className={styles.bullet} aria-hidden>★</span>
                  <span>{txt}</span>
                </li>
              ))}
            </ul>
            <a className={styles.topLink} href="#top">Volver arriba ↑</a>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Guia_uso;
