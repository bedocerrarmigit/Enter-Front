import React, { useMemo, useState } from "react";
import style from "./Historial.module.css";
import { Link } from "react-router-dom";


const datosFicticios = [
  { id: 1, titulo: "a", sinopsis: "a", fecha: "01/07/2025", tipo: "Película", cover: "" },
  { id: 2, titulo: "b", sinopsis: "b", fecha: "30/06/2025", tipo: "Serie", cover: "" },
  { id: 3, titulo: "b", sinopsis: "b", fecha: "29/06/2025", tipo: "Anime", cover: "" },
];


const parseFecha = (f) => {
  const [d, m, y] = f.split("/").map(Number);
  return new Date(y, m - 1, d);
};


const TIPOS = [
  { value: "all",       label: "Todos" },
  { value: "pelicula",  label: "Película" },
  { value: "serie",     label: "Serie" },
  { value: "anime",     label: "Anime" },
];


const toKey = (s = "") =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function Historial() {
  const [q, setQ] = useState("");
  const [orden, setOrden] = useState("reciente"); 
  const [tipo, setTipo] = useState("all");        

  const filtrados = useMemo(() => {
    let res = [...datosFicticios];


    if (q.trim()) {
      const t = q.trim().toLowerCase();
      res = res.filter(
        (x) =>
          x.titulo.toLowerCase().includes(t) ||
          x.sinopsis.toLowerCase().includes(t)
      );
    }

    if (tipo !== "all") {
      res = res.filter((x) => toKey(x.tipo) === tipo);
    }

    // orden
    if (orden === "reciente") {
      res.sort((a, b) => parseFecha(b.fecha) - parseFecha(a.fecha));
    } else if (orden === "antiguo") {
      res.sort((a, b) => parseFecha(a.fecha) - parseFecha(b.fecha));
    } else {
      res.sort((a, b) => a.titulo.localeCompare(b.titulo));
    }

    return res;
  }, [q, orden, tipo]);

  return (
    <div className={style.historial}>
      <header className={style.header}>
        <h1>Historial</h1>

        <div className={style.controls}>
          <input
            className={style.search}
            placeholder="Buscar por título o sinopsis…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />


          <div className={style.pills}>
            {TIPOS.map((opt) => (
              <button
                key={opt.value}
                className={`${style.pill} ${tipo === opt.value ? style.pillActive : ""}`}
                onClick={() => setTipo(opt.value)}
                aria-pressed={tipo === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>


          <select
            className={style.select}
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="reciente">Más recientes</option>
            <option value="antiguo">Más antiguos</option>
            <option value="alfa">A–Z</option>
          </select>
        </div>
      </header>

      <section className={style.grid}>
        {filtrados.map((item) => (
          <article key={item.id} className={style.card}>
            <div className={style.thumb} aria-hidden>
              <div className={style.placeholderIcon}>🎬</div>
            </div>

            <div className={style.body}>
              <div className={style.cardTop}>
                <span className={style.badge}>{item.tipo}</span>
                <time className={style.date}>{item.fecha}</time>
              </div>

              <h3 className={style.title}>{item.titulo}</h3>
              <p className={style.synopsis}>{item.sinopsis}</p>

              <div className={style.metaRow}>
                <span className={style.dot} />
                <span className={style.metaText}>Visto recientemente</span>
              </div>
            </div>

            <div className={style.actions}>
              <Link
                className={style.cta}
                to={`/detalle-pelicula?id=${item.id}`}
              >
                Ver más
              </Link>
            </div>
          </article>
        ))}

        {filtrados.length === 0 && (
          <div className={style.empty}>
            <p>Sin resultados. Prueba con otro término o quita filtros.</p>
          </div>
        )}
      </section>

      <div className={style.footerCta}>
        <button className={style.primary}>Ver historial completo</button>
      </div>
    </div>
  );
}

export default Historial;
