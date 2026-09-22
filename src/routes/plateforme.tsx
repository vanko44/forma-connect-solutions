import { createFileRoute } from "@tanstack/react-router";
import { Building2, ClipboardList, LayoutDashboard, WalletCards } from "lucide-react";
import { PageIntro, CtaBand } from "@/components/page-shell";
import { FormaAdminDashboard } from "@/components/forma-admin-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/plateforme")({
  head: () => ({ meta: [{ title: "Future plateforme digitale — FORMA" }, { name: "description", content: "Aperçu interactif des futurs espaces Client, Prestataire et Admin de la plateforme FORMA." }, { property: "og:title", content: "Future plateforme digitale FORMA" }, { property: "og:description", content: "Suivi des sites, interventions, missions, paiements, rapports et factures dans un espace digital FORMA." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "/plateforme" }] }),
  component: Platform,
});

const dashboards = [
  { title: "Espace Client", icon: Building2, rows: ["Mes sites", "Mes interventions", "Rapports", "Factures"], stat: "Suivi consolidé" },
  { title: "Espace Partenaire", icon: ClipboardList, rows: ["Profil & documents", "Disponibilités", "Missions & ordres de service", "Rapports & paiements"], stat: "Collaboration sécurisée" },
  { title: "Dashboard Central FORMA", icon: LayoutDashboard, rows: ["Planning", "Qualité", "Alertes", "Reporting"], stat: "Pilotage admin" },
];

function Platform() {
  return <><PageIntro eyebrow="Plateforme digitale" title="Un pilotage clair pour chaque acteur." text="Clients, partenaires et administration FORMA disposent d’une vue adaptée à leurs responsabilités, du suivi de la demande à l’exécution terrain." /><section className="py-14 md:py-20"><div className="section-shell"><Tabs defaultValue="admin"><div className="overflow-x-auto"><TabsList className="h-auto min-w-max justify-start"><TabsTrigger value="client" className="gap-2 px-4 py-3"><Building2 className="h-4 w-4" />Espace Client</TabsTrigger><TabsTrigger value="partner" className="gap-2 px-4 py-3"><ClipboardList className="h-4 w-4" />Espace Partenaire</TabsTrigger><TabsTrigger value="admin" className="gap-2 px-4 py-3"><LayoutDashboard className="h-4 w-4" />FORMA Admin</TabsTrigger></TabsList></div><TabsContent value="client" className="mt-6"><DashboardPreview dashboard={dashboards[0]} /></TabsContent><TabsContent value="partner" className="mt-6"><DashboardPreview dashboard={dashboards[1]} /></TabsContent><TabsContent value="admin" className="mt-6"><FormaAdminDashboard /></TabsContent></Tabs></div></section><CtaBand /></>;
}

function DashboardPreview({ dashboard }: { dashboard: (typeof dashboards)[number] | undefined }) {
  if (!dashboard) return null;
  const Icon = dashboard.icon;
  return <article className="border border-border bg-card shadow-soft"><div className="border-b border-border p-6 md:p-8"><div className="flex items-center justify-between"><Icon className="h-7 w-7 text-accent" /><span className="text-xs font-bold uppercase text-muted-foreground">Maquette évolutive</span></div><h2 className="mt-8 text-2xl font-bold md:text-3xl">{dashboard.title}</h2><p className="mt-2 text-sm text-muted-foreground">{dashboard.stat}</p></div><div className="grid gap-3 p-6 sm:grid-cols-2 md:p-8">{dashboard.rows.map((row) => <div key={row} className="flex min-h-14 items-center justify-between border border-border p-4 text-sm font-semibold"><span>{row}</span><WalletCards className="h-4 w-4 text-accent" /></div>)}</div></article>;
}