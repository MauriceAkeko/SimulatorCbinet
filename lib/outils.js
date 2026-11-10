import { LABELS } from "./regles";

export function formatFcfa(n) {
  return Number(n).toLocaleString("fr-FR") + " FCFA";
}

// Garde uniquement des chiffres (12 maximum)
export function chiffres(valeur, max = 12) {
  return String(valeur).replace(/\D/g, "").slice(0, max);
}

export function formatCapital(valeur) {
  return valeur ? formatFcfa(valeur) : "Pas encore défini";
}

export function buildSummary(a, reco) {
  const f = reco.forme;
  return [
    "Simulation de création de société",
    "",
    `Activité : ${LABELS.activite[a.activite] || "-"}`,
    `Associés : ${LABELS.associes[a.associes] || "-"}`,
    `Associé étranger : ${LABELS.etranger[a.etranger] || "-"}`,
    `Objectif : ${LABELS.objectif[a.objectif] || "-"}`,
    `Capital envisagé : ${formatCapital(a.capital)}`,
    "",
    `Forme conseillée : ${f.nom}`,
    `Frais estimés : ${formatFcfa(f.frais[0])} à ${formatFcfa(f.frais[1])}`,
    `Délai estimé : ${f.delai}`,
  ].join("\n");
}

export function whatsappUrl(numero, texte) {
  const n = String(numero || "").replace(/\D/g, "");
  if (!n) return "";
  return `https://wa.me/${n}?text=${encodeURIComponent(texte)}`;
}