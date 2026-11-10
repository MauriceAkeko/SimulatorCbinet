"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Decor from "./Decor";
import {
  FiArrowLeft, FiArrowRight, FiAlertTriangle, FiBriefcase, FiCheck, FiClock,
  FiCopy, FiDollarSign, FiFileText, FiGlobe, FiHome, FiLayers, FiList, FiLock,
  FiPrinter, FiRefreshCw, FiShield, FiShoppingBag, FiTool, FiTrendingUp,
  FiUser, FiUsers, FiZap,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import s from "./page.module.css";
import g from "./jeu.module.css";
import { CABINET, DATE_VERIFICATION, LOGO_SRC, recommander } from "../../lib/regles";
import { buildSummary, chiffres, formatCapital, formatFcfa, whatsappUrl } from "../../lib/outils";


const STEPS = [
  {
    id: "activite",
    titre: "Quelle est votre activité ?",
    aide: "Choisissez celle qui s’en rapproche le plus.",
    options: [
      { value: "commerce", label: "Commerce", hint: "Achat et vente de produits", Icon: FiShoppingBag },
      { value: "services", label: "Prestation de services", hint: "Conseil, digital, formation…", Icon: FiBriefcase },
      { value: "artisanat", label: "Artisanat / production", hint: "Fabrication, transformation", Icon: FiTool },
      { value: "reglementee", label: "Activité réglementée", hint: "Santé, banque, transport, BTP…", Icon: FiShield },
    ],
  },
  {
    id: "associes",
    titre: "Combien serez-vous au capital ?",
    aide: "Vous compris.",
    options: [
      { value: "seul", label: "Seul(e)", hint: "Je lance mon projet en solo", Icon: FiUser },
      { value: "deux", label: "2 à 5 associés", hint: "Un petit groupe", Icon: FiUsers },
      { value: "plus", label: "Plus de 5 associés", hint: "Un groupe plus large", Icon: FiLayers },
    ],
  },
  {
    id: "etranger",
    titre: "Y a-t-il un associé étranger ?",
    aide: "Cela peut ajouter des formalités.",
    options: [
      { value: "non", label: "Non", hint: "Tous les associés résident en Côte d’Ivoire", Icon: FiHome },
      { value: "oui", label: "Oui", hint: "Au moins un associé étranger", Icon: FiGlobe },
    ],
  },
  {
    id: "objectif",
    titre: "Quel est votre objectif principal ?",
    aide: "Cela guide le choix de la forme.",
    options: [
      { value: "simple", label: "Démarrer simplement", hint: "Rapide et peu coûteux", Icon: FiZap },
      { value: "proteger", label: "Protéger mon patrimoine", hint: "Séparer biens personnels et entreprise", Icon: FiLock },
      { value: "fonds", label: "Accueillir des investisseurs", hint: "Prévoir une levée de fonds", Icon: FiTrendingUp },
    ],
  },
  {
    id: "capital",
    titre: "Quel capital envisagez-vous ?",
    aide: "En FCFA. Vous pouvez passer cette question.",
    type: "capital",
  },
];

function useTypewriter(txt) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(txt.length); return; }
    setN(0);
    const id = setInterval(() => setN((v) => (v >= txt.length ? (clearInterval(id), v) : v + 1)), 22);
    return () => clearInterval(id);
  }, [txt]);
  return txt.slice(0, n);
}

function Dialogue({ titre, aide }) {
  const texte = useTypewriter(titre);
  return (
    <div className={g.dialogue} aria-live="polite">
      <span className={g.guide}>Maître LAWRY</span>
      <h1 className={g.dtitre} aria-label={titre}>{texte}<i className={g.curseur} /></h1>
      <p className={g.daide}>{aide}</p>
    </div>
  );
}

function Logo({ grand }) {
  const cls = grand ? `${s.logo} ${s.logoLg}` : s.logo;
  if (LOGO_SRC) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={cls} src={LOGO_SRC} alt={CABINET.nom} />;
  }
  return (
    <span className={`${cls} ${s.logoMono}`} aria-hidden="true">
      {CABINET.nom.charAt(0)}
    </span>
  );
}

export default function Simulateur() {
  const [intro, setIntro] = useState("show"); // show -> out -> gone
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState("fwd");
  const [answers, setAnswers] = useState({});
  const [picked, setPicked] = useState(null);
  const [capital, setCapital] = useState("");
  const [copie, setCopie] = useState(false);
  const lock = useRef(false);
  const timer = useRef(null);

  useEffect(() => {
    const k = (e) => { if (e.key === "Enter" || e.key === " ") setIntro((v) => (v === "show" ? "out" : v)); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  useEffect(() => {
    if (intro !== "out") return;
    const t2 = setTimeout(() => setIntro("gone"), 500);
    return () => clearTimeout(t2);
  }, [intro]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const fini = step >= STEPS.length;
  const reco = useMemo(() => (fini ? recommander(answers) : null), [fini, answers]);

  function choisir(id, value) {
    if (lock.current) return;
    lock.current = true;
    setPicked(value);
    setAnswers((p) => ({ ...p, [id]: value }));
    timer.current = setTimeout(() => {
      setDir("fwd");
      setStep((n) => n + 1);
      setPicked(null);
      lock.current = false;
    }, 750);
  }

  function valider(passer) {
    setAnswers((p) => ({ ...p, capital: passer ? "" : capital }));
    setDir("fwd");
    setStep(STEPS.length);
  }

  function retour() {
    clearTimeout(timer.current);
    lock.current = false;
    setPicked(null);
    setDir("back");
    setStep((n) => Math.max(0, n - 1));
  }

  function recommencer() {
    setAnswers({});
    setCapital("");
    setDir("back");
    setStep(0);
  }

  async function copier() {
    try {
      await navigator.clipboard.writeText(buildSummary(answers, reco));
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      /* copie indisponible */
    }
  }

  const lien = reco ? whatsappUrl(CABINET.whatsapp, buildSummary(answers, reco)) : "";
  const courant = STEPS[step];

  return (
    <>
      <Decor salle={step} />
      <div key={`f${step}`} className={g.flash} aria-hidden="true" />

      {intro !== "gone" && (
        <div
          className={`${s.intro} ${intro === "out" ? s.introOut : ""}`}
          onClick={() => setIntro("out")}
          role="presentation"
          style={{ backgroundImage: "linear-gradient(rgba(74,15,18,.8), rgba(42,10,12,.94)), url(/decor/salle-1.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className={s.introInner}>
            <div className={s.introLogo}><Logo grand /></div>
            <p className={s.introNom}>{CABINET.nom}</p>
            <p className={s.introSig}>{CABINET.signature}</p>
            <p className={g.press}>▶ Appuyer pour entrer</p>
          </div>
        </div>
      )}

      <div className={s.wrap}>
        <header className={s.head}>
          <Logo />
          <div>
            <p className={s.headNom}>{CABINET.nom}</p>
            <p className={s.headSig}>Simulateur de création de société</p>
          </div>
        </header>

        <section className={fini ? s.card : g.stage}>
          {!fini && (
            <div className={g.hud}>
              <button className={g.hudBack} onClick={retour} disabled={step === 0} aria-label="Question précédente">
                <FiArrowLeft />
              </button>
              <div className={g.hudBar}><span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
              <span className={g.hudCount}>Salle {step + 1}/{STEPS.length}</span>
            </div>
          )}

          {!fini && (
            <div key={step} className={g.salle}>
              <Dialogue titre={courant.titre} aide={courant.aide} />

              {courant.type === "capital" ? (
                <div className={`${s.capital} ${g.panneau}`}>
                  <div className={s.inputWrap}>
                    <FiDollarSign aria-hidden="true" />
                    <input
                      className={s.input}
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={15}
                      placeholder="Ex : 1000000"
                      value={capital}
                      onChange={(e) => setCapital(chiffres(e.target.value))}
                      aria-label="Capital en FCFA"
                    />
                    <span>FCFA</span>
                  </div>
                  {capital && <p className={s.aide}>{formatFcfa(capital)}</p>}
                  <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => valider(false)} disabled={!capital}>
                    Voir mon résultat <FiArrowRight />
                  </button>
                  <button className={`${s.btn} ${s.btnGhost}`} onClick={() => valider(true)}>
                    Je ne sais pas encore
                  </button>
                </div>
              ) : (
                <div className={g.dossiers}>
                  {courant.options.map(({ value, label, hint, Icon }, i) => {
                    const on = picked === value;
                    return (
                      <button
                        key={value}
                        className={`${g.dossier} ${on ? g.ouvert : ""} ${picked && !on ? g.ferme : ""}`}
                        style={{ animationDelay: `${450 + i * 120}ms` }}
                        onClick={() => choisir(courant.id, value)}
                        aria-label={`${label} : ${hint}`}
                      >
                        <span className={g.onglet}>N°{i + 1}</span>
                        <span className={g.corps}>
                          <span className={g.pico}><Icon /></span>
                          <strong>{label}</strong>
                          <small>{hint}</small>
                          <span className={g.sceau} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {fini && reco && (
            <div key="resultat" className={s.stepFwd}>
              <p className={s.kicker}>Forme conseillée</p>
              <h1 className={`${s.titre} ${s.titreForme}`}>{reco.forme.nom}</h1>
              <p className={`${s.aide} ${s.aideLong}`}>{reco.forme.pourquoi}</p>

              <div className={s.chiffres}>
                <div className={s.chiffre} style={{ animationDelay: "80ms" }}>
                  <FiDollarSign />
                  <small>Frais estimés</small>
                  <strong>{formatFcfa(reco.forme.frais[0])} à {formatFcfa(reco.forme.frais[1])}</strong>
                </div>
                <div className={s.chiffre} style={{ animationDelay: "160ms" }}>
                  <FiClock />
                  <small>Délai estimé</small>
                  <strong>{reco.forme.delai}</strong>
                </div>
                <div className={s.chiffre} style={{ animationDelay: "240ms" }}>
                  <FiLayers />
                  <small>Capital envisagé</small>
                  <strong>{formatCapital(answers.capital)}</strong>
                </div>
              </div>

              {reco.notes.length > 0 && (
                <div className={s.savoir}>
                  <p><FiAlertTriangle /> À savoir</p>
                  <ul>{reco.notes.map((n) => <li key={n}>{n}</li>)}</ul>
                </div>
              )}

              <div className={s.bloc}>
                <h2><FiFileText /> Pièces à préparer</h2>
                <ul>{reco.forme.pieces.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
              <div className={s.bloc}>
                <h2><FiList /> Les étapes</h2>
                <ol>{reco.forme.etapes.map((e) => <li key={e}>{e}</li>)}</ol>
              </div>

              <p className={s.mention}>
                Estimation indicative, non contractuelle.{" "}
                {DATE_VERIFICATION ? `Données vérifiées le ${DATE_VERIFICATION}.` : "Données en cours de validation par le cabinet."}{" "}
                {CABINET.honoraires}
              </p>

              <div className={s.actions}>
                {lien ? (
                  <a className={`${s.btn} ${s.btnWa}`} href={lien} target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp /> Envoyer au cabinet sur WhatsApp
                  </a>
                ) : (
                  <p className={s.mention}>Numéro WhatsApp non configuré (voir .env.local).</p>
                )}
                <div className={s.actionsRow}>
                  <button className={`${s.btn} ${s.btnGhost}`} onClick={copier}>
                    {copie ? <FiCheck /> : <FiCopy />} {copie ? "Copié" : "Copier"}
                  </button>
                  <button className={`${s.btn} ${s.btnGhost}`} onClick={() => window.print()}>
                    <FiPrinter /> Imprimer
                  </button>
                  <button className={`${s.btn} ${s.btnGhost}`} onClick={recommencer}>
                    <FiRefreshCw /> Refaire
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}