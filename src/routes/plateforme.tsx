import { createFileRoute } from "@tanstack/react-router";
import { Building2, ClipboardList, LayoutDashboard, WalletCards } from "lucide-react";
import { PageIntro, CtaBand } from "@/components/page-shell";

export const Route = createFileRoute("/plateforme")({
  head: () => ({ meta: [{ title: "Future plateforme digitale — FORMA" }, { name: "description", content: "Aperçu interactif des futurs espaces Client, Prestataire et Admin de la plateforme FORMA." }, { property: "og:title", content: "Future plateforme digitale FORMA" }, { property: "og:description", content: "Suivi des sites, interventions, missions, paiements, rapports et factures dans un espace digital FORMA." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "/plateforme" }] }),
  component: Platform,
});

const dashboards = [
  { title: "Espace Client", icon: Building2, rows: ["Mes sites", "Mes interventions", "Rapports", "Factures"], stat: "Suivi consolidé" },
  { title: "Espace Partenaire", icon: ClipboardList, rows: ["Profil & documents", "Disponibilités", "Missions & ordres de service", "Rapports & paiements"], stat: "Collaboration sécurisée" },
  { title: "Dashboard Central FORMA", icon: LayoutDashboard, rows: ["Planning", "Qualité", "Alertes", "Reporting"], stat: "Pilotage admin" },
];

function Platform() { return <><PageIntro eyebrow="Phase 3" title="Aperçu de la future plateforme digitale FORMA." text="La première version du site prépare un écosystème où clients, prestataires et administration FORMA pourront suivre les opérations avec clarté." /><section className="py-20"><div className="section-shell grid gap-6 lg:grid-cols-3">{dashboards.map(({ title, icon: Icon, rows, stat }) => <article key={title} className="border border-border bg-card"><div className="border-b border-border p-6"><div className="flex items-center justify-between"><Icon className="h-6 w-6 text-accent" /><span className="text-xs font-bold uppercase text-muted-foreground">Prototype</span></div><h2 className="mt-8 text-2xl font-bold">{title}</h2><p className="mt-2 text-sm text-muted-foreground">{stat}</p></div><div className="p-6"><div className="mb-5 grid grid-cols-3 gap-2"><span className="h-16 bg-muted" /><span className="h-16 bg-muted" /><span className="h-16 bg-accent/25" /></div><div className="grid gap-3">{rows.map((row) => <div key={row} className="flex items-center justify-between border border-border p-3 text-sm"><span>{row}</span><WalletCards className="h-4 w-4 text-accent" /></div>)}</div></div></article>)}</div></section><CtaBand /></>; }