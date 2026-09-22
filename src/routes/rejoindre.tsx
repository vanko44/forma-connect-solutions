import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, BadgeCheck, BriefcaseBusiness, Check, ClipboardCheck, FileText, Handshake, MessageSquareText, ShieldCheck, TimerReset, UserRoundCheck, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerApplication } from "@/components/partner-application";

export const Route = createFileRoute("/rejoindre")({
  head: () => ({ meta: [
    { title: "Réseau de partenaires professionnels — FORMA" },
    { name: "description", content: "Artisans, indépendants, PME et entreprises spécialisées : candidatez au réseau professionnel coordonné par FORMA en RDC." },
    { property: "og:title", content: "Rejoignez le réseau de partenaires FORMA" },
    { property: "og:description", content: "Présentez votre structure, vos expertises et vos capacités pour rejoindre le réseau professionnel coordonné par FORMA." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/rejoindre" }] }),
  component: Join,
});

const steps = [
  "Candidature en ligne", "Analyse du dossier", "Vérification des compétences & références",
  "Évaluation & entretien technique", "Validation du partenariat & conventionnement", "Affectation de missions & suivi qualité continu",
];
const statuses = ["Candidature reçue", "En vérification", "Compléments demandés", "Validé", "Partenaire actif"];
const benefits = ["Accès à des missions qualifiées régulières", "Gestion commerciale et administrative assurée par FORMA", "Cadre contractuel sécurisé", "Reporting et paiements transparents"];
const requirements = ["Professionnalisme rigoureux", "Réactivité", "Ponctualité", "Conformité légale et technique", "Respect de la charte qualité FORMA"];
const portal = [
  { icon: UserRoundCheck, title: "Mon profil & documents", text: "Informations de structure, pièces professionnelles et conformité." },
  { icon: TimerReset, title: "Mes disponibilités", text: "Zones couvertes, créneaux et capacité d’intervention actualisés." },
  { icon: BriefcaseBusiness, title: "Missions proposées", text: "Ordres de service, validation et acceptation ou refus encadrés." },
  { icon: FileText, title: "Rapports d’intervention", text: "Transmission des rapports, preuves et fiches d’intervention." },
  { icon: WalletCards, title: "Paiements & qualité", text: "Suivi des paiements et des attestations qualité associées." },
];

function Join() {
  return <>
    <section className="bg-primary py-20 text-primary-foreground md:py-28"><div className="section-shell reveal"><p className="eyebrow">Réseau de partenaires professionnels</p><h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.08] md:text-6xl">Rejoignez le réseau de partenaires FORMA</h1><p className="mt-6 max-w-3xl text-base leading-7 text-primary-foreground/70 md:text-lg">FORMA collabore avec des artisans, indépendants, PME et entreprises spécialisées afin de proposer à ses clients des solutions complètes et coordonnées.</p><p className="mt-5 max-w-3xl border-l-2 border-accent pl-4 text-sm leading-6 text-primary-foreground/65">Les partenaires interviennent dans leur domaine d’expertise sous la coordination exclusive de FORMA. Le client reste en relation contractuelle et opérationnelle unique avec FORMA.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild className="h-12 bg-accent px-6 text-accent-foreground hover:bg-accent/90"><a href="#candidature">Devenir partenaire <ArrowDown /></a></Button><Button asChild variant="outline" className="h-12 border-primary-foreground/30 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><a href="#processus">Comprendre le processus</a></Button></div></div></section>

    <section className="py-20 md:py-24"><div className="section-shell"><div className="max-w-3xl"><p className="eyebrow">Un modèle de responsabilité clair</p><h2 className="mt-4 text-3xl font-bold md:text-4xl">Deux expertises, un pilotage cohérent.</h2><p className="mt-4 leading-7 text-muted-foreground">FORMA conduit ses activités stratégiques en régie directe et coordonne un réseau qualifié pour les expertises complémentaires.</p></div><div className="mt-10 grid gap-5 lg:grid-cols-2"><article className="border-t-4 border-primary bg-card p-6 shadow-soft md:p-8"><ShieldCheck className="h-7 w-7 text-accent" /><p className="eyebrow mt-8">Pilotage interne</p><h3 className="mt-3 text-2xl font-bold">Activités conduites en régie directe par FORMA</h3><ul className="mt-6 grid gap-3 text-sm font-semibold">{["Sécurité", "Gardiennage", "Protection", "Coordination événementielle", "Média"].map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{item}</li>)}</ul></article><article className="border-t-4 border-accent bg-card p-6 shadow-soft md:p-8"><Handshake className="h-7 w-7 text-accent" /><p className="eyebrow mt-8">Réseau coordonné</p><h3 className="mt-3 text-2xl font-bold">Expertises complémentaires du Réseau de Partenaires</h3><ul className="mt-6 grid gap-3 text-sm font-semibold sm:grid-cols-2">{["Maintenance", "Électricité", "Climatisation", "Nettoyage", "Logistique", "Décoration", "Traiteur"].map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{item}</li>)}</ul></article></div></div></section>

    <section id="processus" className="scroll-mt-24 bg-primary py-20 text-primary-foreground md:py-24"><div className="section-shell"><p className="eyebrow">Qualification & sélection</p><h2 className="mt-4 text-3xl font-bold md:text-4xl">Un processus exigeant, lisible à chaque étape.</h2><div className="mt-10 grid gap-px bg-primary-foreground/15 sm:grid-cols-2 lg:grid-cols-3">{steps.map((step, index) => <article key={step} className="bg-primary p-6"><span className="font-display text-3xl font-bold text-accent">0{index + 1}</span><h3 className="mt-7 font-bold leading-6">{step}</h3></article>)}</div><div className="mt-10"><p className="text-xs font-bold uppercase text-primary-foreground/55">Statuts de suivi</p><div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap">{statuses.map((status, index) => <div key={status} className="flex items-center text-sm font-semibold"><span className="my-1 border border-primary-foreground/20 px-4 py-3">{status}</span>{index < statuses.length - 1 && <span className="hidden px-2 text-accent sm:block">→</span>}</div>)}</div></div></div></section>

    <section className="py-20 md:py-24"><div className="section-shell grid gap-12 lg:grid-cols-2"><div><p className="eyebrow">Pourquoi rejoindre FORMA ?</p><h2 className="mt-4 text-3xl font-bold">Un cadre professionnel pour mieux intervenir.</h2><ul className="mt-7 grid gap-4">{benefits.map((item) => <li key={item} className="flex gap-3 text-sm leading-6"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />{item}</li>)}</ul><p className="mt-6 text-sm leading-6 text-muted-foreground">Les opportunités dépendent des besoins clients, des zones et de la qualification de chaque partenaire. Aucun volume de mission ou revenu n’est garanti.</p></div><div><p className="eyebrow">Nos exigences</p><h2 className="mt-4 text-3xl font-bold">La qualité avant l’affectation.</h2><ul className="mt-7 grid gap-4">{requirements.map((item) => <li key={item} className="flex gap-3 text-sm leading-6"><ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />{item}</li>)}</ul></div></div></section>

    <section className="bg-muted py-20 md:py-24"><div className="section-shell"><PartnerApplication /></div></section>

    <section className="py-20 md:py-24"><div className="section-shell"><div className="max-w-3xl"><p className="eyebrow">Portail privé partenaire · Maquette évolutive</p><h2 className="mt-4 text-3xl font-bold md:text-4xl">Un espace sécurisé pour chaque mission.</h2><p className="mt-4 leading-7 text-muted-foreground">Après validation et conventionnement, le futur portail centralisera les échanges opérationnels avec FORMA.</p></div><div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-5">{portal.map(({ icon: Icon, title, text }) => <article key={title} className="service-card bg-card p-6"><Icon className="h-6 w-6 text-accent" /><h3 className="mt-8 font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div><div className="mt-8 flex items-start gap-3 border-l-2 border-accent pl-4 text-sm text-muted-foreground"><MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-accent" /><p>Les missions sont proposées et encadrées par FORMA. Le partenaire peut les accepter ou les refuser avant émission de l’ordre de service.</p></div></div></section>
  </>;
}