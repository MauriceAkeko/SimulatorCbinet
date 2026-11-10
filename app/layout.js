import "./globals.css";

export const metadata = {
  title: "LAWRY | Cabinet d’avocats à Abidjan",
  description:
    "LAWRY, cabinet d’avocats à Abidjan. Créez votre société avec notre simulateur gratuit.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}