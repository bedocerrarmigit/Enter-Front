import React, { useEffect, useRef, useState } from "react";
import style from "./Inicio.module.css";
import { FiSend } from "react-icons/fi";
import { FaHistory } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

function Inicio() {
  const navegar = useNavigate();
  const manejarClick = () => navegar("/peliculas");
  const guiaClick = () => navegar("/guia-de-uso");
  const irAHistorial = () => navegar("/historial");

  // SLIDES (los que ya tienes)
  const slides = [
    {
      id: "s1",
      title: "The Godfather",
      age: "R",
      tags: ["Crime", "Drama"],
      description:
        "El patriarca de la familia Corleone hace todo lo posible para mantener su imperio criminal mientras su hijo menor lucha por encajar en el negocio.",
      image:
        "https://spoilertown.com/wp-content/uploads/2024/06/the-godfather-1972.webp",
      ctaTo: "/peliculas/238",
      ctaLabel: "VER DETALLES",
    },
    {
      id: "s2",
      title: "12 Angry Men",
      age: "PG",
      tags: ["Drama", "Courtroom"],
      description:
        "Doce jurados deben decidir la culpabilidad de un joven acusado de asesinato; lo que parece un trámite rápido se convierte en un intenso debate moral.",
      image:
        "https://spoilertown.com/wp-content/uploads/2024/06/12-angry-men-1957.webp",
      ctaTo: "/peliculas/389",
      ctaLabel: "VER DETALLES",
    },
    {
      id: "s3",
      title: "Schindler’s List",
      age: "R",
      tags: ["History", "War"],
      description:
        "Durante la Segunda Guerra Mundial, Oskar Schindler salva a cientos de judíos empleándolos en su fábrica, arriesgando todo para preservar vidas.",
      image:
        "https://static.timesofisrael.com/jewishstanddev/uploads/2024/03/16-1-Schindlers-List-Silverscreen-Tours.jpg",
      ctaTo: "/peliculas/424",
      ctaLabel: "VER DETALLES",
    },
    {
      id: "s4",
      title: "Pulp Fiction",
      age: "R",
      tags: ["Crime", "Black Comedy"],
      description:
        "Varias historias entrelazadas de criminales, boxeadores y gánsteres en Los Ángeles, con diálogos brillantes y escenas inolvidables.",
      image:
        "https://media.printler.com/media/photo/167927.jpg?rmode=crop&width=638&height=900",
      ctaTo: "/peliculas/680",
      ctaLabel: "VER DETALLES",
    },
    {
      id: "s5",
      title: "The Dark Knight",
      age: "PG-13",
      tags: ["Action", "Superhero"],
      description:
        "El Caballero Oscuro debe enfrentarse a su mayor enemigo, el Joker, en una batalla que cambiará Gotham para siempre.",
      image:
        "https://www.originalfilmart.com/cdn/shop/products/dark_knight_2008_UK_advance_original_film_art_627d1d49-4cb3-4b63-bef9-78d382cc4106_5000x.jpg?v=1591653723",
      ctaTo: "/peliculas/155",
      ctaLabel: "VER DETALLES",
    },
    {
      id: "s6",
      title: "The Shawshank Redemption",
      age: "R",
      tags: ["Drama", "Hope"],
      description:
        "Dos presos forjan una amistad en Shawshank mientras uno de ellos planea su fuga, demostrando que la esperanza puede vencer incluso al sistema.",
      image:
        "https://ec928zsmwno.exactdn.com/wp-content/uploads/2025/09/TSR_2_Socials_1080x1080.jpg?strip=all&lossy=1&quality=92&webp=92&avif=80&ssl=1",
      ctaTo: "/peliculas/278",
      ctaLabel: "VER DETALLES",
    },
    {
      id: "s7",
      title: "The Godfather: Part II",
      age: "R",
      tags: ["Crime", "Drama", "Sequel"],
      description:
        "La historia continúa con la expansión del imperio Corleone mientras se explora el origen de Vito Corleone en Sicilia y su ascenso en América.",
      image: "https://popcult.blog/wp-content/uploads/2022/03/the-godfather-02-banner.png",
      ctaTo: "/peliculas/240",
      ctaLabel: "VER DETALLES",
    },
  ];

  const [index, setIndex] = useState(0);
  const timer = useRef(null);
  useEffect(() => {
    if (slides.length <= 1) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(timer.current);
  }, [slides.length]);
  const go = (i) => setIndex(((i % slides.length) + slides.length) % slides.length);
  const s = slides[index];

  const recs = [
    { id: "r1", title: "Nadie nos vio partir", to: "/detalle-pelicula/Nadie nos vio partir", image: "https://m.media-amazon.com/images/M/MV5BOGNkNTBhZTQtOGRjZi00N2UyLWJmZDctNjA2ZTQ0MjNhNWRjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
    { id: "r2", title: "Amor y riqueza",        to: "/detalle-pelicula/Amor y riqueza", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtnm1K2ZbA15J_GWVg4MRhqi7bPCaOiMElSw&s" },
    { id: "r3", title: "Merlina",     to: "/detalle-pelicula/Merlina",    image: "https://i0.wp.com/multianime.com.mx/wp-content/uploads/2025/07/Merlina-temporada-2-Trailer-oficial-Nuevas-imagenes.jpg?fit=1080%2C1350&ssl=1" },
    { id: "r4", title: "Las guerreras k-pop",    to: "/detalle-pelicula/Las guerreras K-pop",image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaUffuCJoASJU1RXLDZYfzBF_f6XbDLWXUfg&s" },
    { id: "r5", title: "La vecina perfecta",   to: "/detalle-pelicula/La vecina perfecta",image: "https://play-lh.googleusercontent.com/proxy/cNeL4TTpMB3grVWqPvNpvI_uBWw58qw_rWIb9KdYGxoFJ8PkuWfH1crJt-nh88wLJivrev2obKZ-mtPHPB7SipfLsO-lO49BhH5eAhiaTxOX67AaDXForKciiqBAhkG5R8wpBwdWkHRV_JmSOYtzncwVOVtDxst8MWfvTQ" },
    { id: "r6", title: "El genio y los deseos",   to: "/detalle-pelicula/El genio y los deseos",image: "https://m.media-amazon.com/images/M/MV5BOWM4MjQ1M2EtODY4OS00NGQwLTgxYWYtOTA2ODM3MGU0MTgzXkEyXkFqcGc@._V1_.jpg" },
  ];

  return (
    <main className={style.page}>
      {/* === Columna izquierda (SIEMPRE aparte del hero) === */}
      <aside className={style.sidebar}>
        <div className={style.card}>
          <strong>RECOMENDACIONES</strong>
          <p>
            Escribe palabras clave como: acción, miedo, +18, Disney.
            Para más info consulta "Guía De Uso".
          </p>
          <button onClick={guiaClick} className={style.btnSecundario}>Guía De Uso</button>
        </div>

        <button onClick={irAHistorial} className={style.historialBtn}>
          <FaHistory /><span>Historial</span>
        </button>
      </aside>

      <div className={style.rightCol}>
        {/* HERO */}
        <section className={style.hero} style={{ backgroundImage: `url(${s.image})` }}>
          <div className={style.overlay} />
          {slides.length > 1 && (
            <>
              <button className={style.arrowLeft} aria-label="Anterior" onClick={() => go(index - 1)}>‹</button>
              <button className={style.arrowRight} aria-label="Siguiente" onClick={() => go(index + 1)}>›</button>
            </>
          )}

          <div className={style.content}>
            <h1 className={style.title}>{s.title}</h1>

            <div className={style.meta}>
              {s.age && <span className={style.badge}>{s.age}</span>}
              {(s.tags || []).map((t) => <span key={t} className={style.tag}>{t}</span>)}
            </div>

            {s.description && <p className={style.desc}>{s.description}</p>}

            <div className={style.actions}>
              <Link to={s.ctaTo} className={style.cta}>{s.ctaLabel}</Link>
              <div className={style.blankBtn} aria-hidden />
            </div>

            {slides.length > 1 && (
              <div className={style.dots}>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`${style.dot} ${i === index ? style.active : ""}`}
                    onClick={() => go(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            )}

            <div className={style.buscador}>
              <input type="text" placeholder="Escribe aquí" />
              <button onClick={manejarClick} className={style.botonEnviar}>
                <FiSend />
              </button>
            </div>
          </div>
        </section>

        {/* TE RECOMENDAMOS */}
<section className={style.recs}>
  <div className={style.recsHeader}>
    <h2>TE RECOMENDAMOS</h2>
    <Link to="/peliculas" className={style.verMas}>Ver más</Link>
  </div>

  <div className={style.recsGrid}>
    {recs.map(card => (
      <Link key={card.id} to={card.to} className={`${style.recCard} ${style.poster}`} title={card.title}>
        <img className={style.recImgPoster} src={card.image} alt={card.title} />
        <div className={style.recInfo}>
          <div className={style.recTitle}>{card.title}</div>
          {card.tags && card.tags.length > 0 && (
            <div className={style.recTags}>{card.tags.join(" | ")}</div>
          )}
        </div>
      </Link>
    ))}
  </div>
</section>
      </div>
    </main>
  );
}

export default Inicio;
