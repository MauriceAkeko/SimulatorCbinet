"use client";

import g from "./jeu.module.css";

// Une photo par salle (6 fichiers) : à déposer dans public/decor/
// salle-1.jpg … salle-6.jpg. Sans photo, le fond bordeaux s'affiche.
const PHOTOS = Array.from({ length: 6 }, (_, i) => `/decor/salle-${i + 1}.jpg`);

export default function Decor({ salle = 0 }) {
  const courant = Math.min(salle, PHOTOS.length - 1);
  return (
    <div className={g.decor} aria-hidden="true">
      {PHOTOS.map((src, i) => (
        <div
          key={src}
          className={`${g.plan} ${i === courant ? g.ici : i < courant ? g.passe : g.avenir}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className={g.voile} />
    </div>
  );
}