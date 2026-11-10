// ============================================================
// TOUT CE QUE L'AVOCAT DOIT VALIDER EST DANS CE FICHIER
// (frais, délais, pièces, étapes). Montants en FCFA.
// ============================================================

// Quand le cabinet a validé les données, écrire la date ici (ex : "12/11/2026").
export const DATE_VERIFICATION = "";

// Logo du cabinet : mettre le fichier dans public/ (ex : public/logo.png) puis écrire "/logo.png".
// Laissé vide, un monogramme « L » est affiché.
export const LOGO_SRC = "/logo.png";

// Avertissement affiché sur tout le site (accueil, simulateur, résultat).
export const AVERTISSEMENT = {
  court: "Version expérimentale : simulation à titre de test, sans valeur juridique.",
  long:
    "Ce simulateur est une version expérimentale, proposée à titre de test. Les résultats sont purement indicatifs : ils ne constituent ni un conseil juridique, ni un devis, ni une garantie, et ne remplacent pas l’avis d’un avocat. Pour une véritable création d’entreprise, contactez le cabinet LAWRY.",
};

export const CABINET = {
  nom: "LAWRY",
  signature: "Conseil et assistance juridique · Abidjan",
  honoraires: "Honoraires du cabinet : sur devis.",
  // Indicatif 225 + numéro, sans + ni espaces. Public par nature.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
};

export const LABELS = {
  activite: {
    commerce: "Commerce",
    services: "Prestation de services",
    artisanat: "Artisanat / production",
    reglementee: "Activité réglementée",
  },
  associes: { seul: "Seul(e)", deux: "2 à 5 associés", plus: "Plus de 5 associés" },
  etranger: { non: "Non", oui: "Oui" },
  objectif: {
    simple: "Démarrer simplement",
    proteger: "Protéger mon patrimoine",
    fonds: "Accueillir des investisseurs",
  },
};

export const FORMES = {
  ei: {
    nom: "Entreprise individuelle",
    pourquoi:
      "Vous êtes seul(e) et vous voulez démarrer vite, avec le moins de formalités et de frais. En contrepartie, votre patrimoine personnel n’est pas séparé de celui de l’activité.",
    frais: [15000, 50000],
    delai: "2 à 7 jours ouvrés",
    pieces: [
      "Pièce d’identité en cours de validité",
      "Justificatif de domicile",
      "Extrait de casier judiciaire",
      "Photos d’identité",
      "Adresse du lieu d’activité",
    ],
    etapes: [
      "Choix du nom commercial et de l’activité",
      "Dépôt du dossier au guichet unique",
      "Immatriculation au registre du commerce",
      "Obtention des numéros d’identification (fiscal, social)",
    ],
  },
  sarlu: {
    nom: "SARL unipersonnelle (SARLU)",
    pourquoi:
      "Vous êtes seul(e) mais vous voulez séparer votre patrimoine personnel de celui de l’entreprise. Votre responsabilité est limitée à vos apports.",
    frais: [50000, 150000],
    delai: "5 à 15 jours ouvrés",
    pieces: [
      "Pièce d’identité de l’associé unique et du gérant",
      "Justificatif de domicile",
      "Extrait de casier judiciaire du gérant",
      "Projet de statuts",
      "Justificatif du siège social (bail ou attestation)",
      "Attestation de dépôt du capital",
    ],
    etapes: [
      "Choix de la dénomination et du siège",
      "Rédaction des statuts",
      "Dépôt et libération du capital",
      "Enregistrement des statuts",
      "Immatriculation au registre du commerce (guichet unique)",
    ],
  },
  sarl: {
    nom: "SARL",
    pourquoi:
      "Vous êtes plusieurs associés et cherchez une forme classique, bien connue, qui limite la responsabilité de chacun à ses apports.",
    frais: [50000, 150000],
    delai: "5 à 15 jours ouvrés",
    pieces: [
      "Pièce d’identité de chaque associé et du gérant",
      "Justificatif de domicile de chacun",
      "Extrait de casier judiciaire du gérant",
      "Projet de statuts signé par tous les associés",
      "Justificatif du siège social (bail ou attestation)",
      "Attestation de dépôt du capital",
    ],
    etapes: [
      "Accord entre associés sur la répartition du capital et les pouvoirs",
      "Rédaction des statuts",
      "Dépôt et libération du capital",
      "Enregistrement des statuts",
      "Immatriculation au registre du commerce (guichet unique)",
    ],
  },
  sas: {
    nom: "SAS",
    pourquoi:
      "Vous voulez de la souplesse dans l’organisation et la possibilité d’accueillir des investisseurs. Les statuts peuvent définir librement les pouvoirs et les règles d’entrée ou de sortie des associés.",
    frais: [75000, 200000],
    delai: "7 à 20 jours ouvrés",
    pieces: [
      "Pièce d’identité de chaque associé et du dirigeant",
      "Justificatif de domicile de chacun",
      "Extrait de casier judiciaire du dirigeant",
      "Projet de statuts détaillé",
      "Justificatif du siège social (bail ou attestation)",
      "Attestation de dépôt du capital",
    ],
    etapes: [
      "Définition de la gouvernance et du pacte entre associés",
      "Rédaction des statuts",
      "Dépôt et libération du capital",
      "Enregistrement des statuts",
      "Immatriculation au registre du commerce (guichet unique)",
    ],
  },
};

export function recommander(a) {
  const seul = a.associes === "seul";
  let key;
  if (a.objectif === "fonds") key = "sas";
  else if (seul)
    key =
      a.objectif === "simple" && a.activite !== "reglementee" && a.etranger !== "oui"
        ? "ei"
        : "sarlu";
  else key = "sarl";

  const notes = [];
  if (a.activite === "reglementee")
    notes.push(
      "Votre activité peut exiger une autorisation, un agrément ou une inscription à un ordre professionnel avant l’immatriculation. Le cabinet vérifie ce point avec vous."
    );
  if (a.etranger === "oui")
    notes.push(
      "Un associé étranger implique des pièces supplémentaires (passeport, éventuelles légalisations ou traductions) et peut ajouter des formalités."
    );
  return { key, forme: FORMES[key], notes };
}