import { Outfit, Cormorant_Garamond } from "next/font/google";
import Simulateur from "./Simulateur";
import styles from "./page.module.css";

const font = Outfit({ subsets: ["latin"], display: "swap" });
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  title: "Simulateur de création de société | LAWRY",
  description:
    "Découvrez en quelques questions la forme de société adaptée à votre projet, les frais, délais et pièces à préparer.",
};

export default function Page() {
  return (
    <main className={`${styles.root} ${font.className} ${serif.variable}`}>
      <Simulateur />
    </main>
  );
}