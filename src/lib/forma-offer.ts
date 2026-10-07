export const PENDING_STATUS = "En attente d'approbation direction";
export const APPROVED_STATUS = "Offre approuvée";

export const TARIFFS = [
  { label: "Agent de sécurité non armé — poste 12h (jour)", unit: "1 agent / poste", price: 18 },
  { label: "Agent de sécurité non armé — poste 12h (nuit)", unit: "1 agent / poste", price: 20 },
  {
    label: "Engagement mensuel — poste fixe (1 agent, 30 jours)",
    unit: "1 agent / mois",
    price: 480,
  },
  {
    label: "Superviseur / chef d'équipe (supervision multi-sites)",
    unit: "1 superviseur / mois",
    price: 650,
  },
  { label: "Ronde mobile de surveillance (véhicule + 2 agents)", unit: "par ronde", price: 35 },
  { label: "Protection rapprochée / VIP (agent formé)", unit: "1 agent / jour", price: 60 },
  { label: "Sécurité événementielle (agent, jour ou soirée)", unit: "1 agent / jour", price: 25 },
  { label: "Audit sécuritaire préalable du site", unit: "forfait unique", price: 150 },
] as const;

export const SERVICE_GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Gardiennage & surveillance",
    items: [
      "Gardiennage statique de site (jour / nuit / 24h-24)",
      "Rondes de surveillance mobiles motorisées",
      "Contrôle d'accès et filtrage des entrées/sorties",
      "Surveillance de chantier",
      "Sécurité résidentielle",
    ],
  },
  {
    title: "Protection des personnes",
    items: [
      "Protection rapprochée / VIP",
      "Escorte et accompagnement de personnalités",
      "Sécurité de convoi et de transport de valeurs",
    ],
  },
  {
    title: "Services événementiels",
    items: [
      "Sécurité événementielle (conférences, mariages, concerts)",
      "Gestion des flux et du placement du public",
      "Coordination avec les services d'ordre publics",
      "Stewarding et accueil sécurisé",
    ],
  },
  {
    title: "Prestations complémentaires",
    items: [
      "Audit sécuritaire préalable du site",
      "Formation et sensibilisation du personnel client",
      "Renfort ponctuel en agents supplémentaires",
    ],
  },
];

export type OfferLine = { label: string; unit: string; price: number; qty: number };
export const TEAM_ROLES = [
  { key: "direction", label: "Direction Générale / Fondateur" },
  { key: "operations", label: "Responsable Opérations & Sécurité" },
  { key: "commercial", label: "Responsable Commercial & Administratif" },
  { key: "supervisors", label: "Chefs d'équipe / Superviseurs de site" },
  { key: "events", label: "Coordinateur Événementiel" },
  { key: "agents", label: "Agents de terrain (gardiennage, rondes, protection, événementiel)" },
] as const;
export type OfferTeam = Partial<Record<(typeof TEAM_ROLES)[number]["key"], string>>;
export type Offer = {
  clientName: string;
  signatory: string;
  signatoryRole: string;
  date: string;
  services: string[];
  lines: OfferLine[];
  discountPct: number;
  notes: string;
  team?: OfferTeam;
};

export function offerTeamRows(offer: Pick<Offer, "team">) {
  return TEAM_ROLES.map((role) => ({ ...role, name: offer.team?.[role.key]?.trim() || "" }));
}

export function defaultOffer(q: { name: string; organization: string | null }): Offer {
  return {
    clientName: q.organization || q.name,
    signatory: "",
    signatoryRole: "Direction Générale",
    date: new Date().toISOString().slice(0, 10),
    services: ["Gardiennage statique de site (jour / nuit / 24h-24)"],
    lines: TARIFFS.map((t) => ({ ...t, qty: 0 })),
    discountPct: 0,
    notes: "",
    team: {},
  };
}

export function offerTotals(o: Pick<Offer, "lines" | "discountPct">) {
  const subtotal = o.lines.reduce((s, l) => s + Math.max(0, l.price) * Math.max(0, l.qty), 0);
  const pct = Math.min(100, Math.max(0, o.discountPct));
  const discount = Math.round(subtotal * pct) / 100;
  return { subtotal, discount, total: subtotal - discount };
}

export const usd = (n: number) => `${n.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} USD`;
