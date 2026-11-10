import Link from "next/link";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import { FiArrowRight, FiClock, FiFileText, FiShield } from "react-icons/fi";
import styles from "./page.module.css";

import { AVERTISSEMENT, LOGO_SRC } from "../lib/regles";
import Decor from "./simulateur-creation-societe/Decor";

const font = Outfit({ subsets: ["latin"], display: "swap" });
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export default function Home() {
  return (
    <main className={`${styles.root} ${font.className} ${serif.variable}`}>
      <Decor salle={0} />
      <section className={styles.hero}>
        {LOGO_SRC ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.logoImg} src={LOGO_SRC} alt="LAWRY – Conseil et assistance juridique" />
        ) : (
          <>
            <div className={styles.logo}>L</div>
            <p className={styles.nom}>LAWRY</p>
            <p className={styles.sig}>Conseil et assistance juridique · Abidjan</p>
          </>
        )}

        <h1 className={styles.titre}>Créez votre société en toute sérénité</h1>
        <p className={styles.texte}>
          Répondez à quelques questions et découvrez la forme de société adaptée à votre projet,
          les frais estimés, les délais et les pièces à préparer.
        </p>

        <Link href="/simulateur-creation-societe" className={styles.cta}>
          Lancer le simulateur <FiArrowRight />
        </Link>

        <ul className={styles.points}>
          <li><FiClock /> 2 minutes</li>
          <li><FiFileText /> Gratuit et sans inscription</li>
          <li><FiShield /> Vos réponses restent dans votre navigateur</li>
        </ul>

        <p className={styles.avis}>{AVERTISSEMENT.long}</p>
      </section>
    </main>
  );
}