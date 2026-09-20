import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, ClipboardCheck, FileText, LogOut, MapPin, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/espace-client")({
  head: () => ({
    meta: [
      { title: "Tableau de bord client — FORMA" },
      { name: "description", content: "Espace sécurisé de suivi des devis, sites, interventions et rapports des clients FORMA." },
      { property: "og:title", content: "Tableau de bord client FORMA" },
      { property: "og:description", content: "Suivez vos prestations FORMA depuis votre espace client sécurisé." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClientDashboard,
});

function ClientDashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { void navigate({ to: "/connexion-client", replace: true }); return; }
      setEmail(data.session.user.email ?? "Client FORMA");
      setChecking(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) void navigate({ to: "/connexion-client", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);
  if (checking) return <div className="section-shell min-h-[55vh] py-20 text-sm text-muted-foreground">Ouverture de votre espace…</div>;
  const signOut = async () => { await supabase.auth.signOut(); await navigate({ to: "/connexion-client" }); };
  const items = [
    { icon: FileText, label: "Devis", value: "Aucun devis", text: "Vos demandes et propositions apparaîtront ici." },
    { icon: MapPin, label: "Sites", value: "Aucun site", text: "Les sites confiés à FORMA seront centralisés ici." },
    { icon: ShieldCheck, label: "Interventions", value: "Aucune intervention", text: "Consultez le suivi des opérations en cours." },
    { icon: ClipboardCheck, label: "Rapports", value: "Aucun rapport", text: "Retrouvez les comptes rendus validés par FORMA." },
  ];
  return <>
    <section className="border-b border-border bg-primary py-12 text-primary-foreground"><div className="section-shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow">Espace Client sécurisé</p><h1 className="mt-3 text-3xl font-extrabold md:text-4xl">Bienvenue dans votre espace FORMA.</h1><p className="mt-3 text-sm text-primary-foreground/65">{email}</p></div><Button variant="outline" className="w-fit border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={signOut}><LogOut />Se déconnecter</Button></div></section>
    <section className="py-14 md:py-20"><div className="section-shell"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><h2 className="text-2xl font-bold">Vue d’ensemble</h2><p className="mt-2 text-sm text-muted-foreground">Vos prestations seront ajoutées à mesure de leur validation par FORMA.</p></div><Button asChild className="w-fit bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/devis"><Plus />Nouvelle demande de devis</Link></Button></div><div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{items.map(({ icon: Icon, label, value, text }) => <article key={label} className="border border-border bg-card p-6 shadow-soft"><div className="flex h-10 w-10 items-center justify-center bg-secondary"><Icon className="h-5 w-5 text-accent" /></div><p className="mt-8 text-xs font-bold uppercase text-muted-foreground">{label}</p><h3 className="mt-2 text-xl font-bold">{value}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div><div className="mt-10 border-l-2 border-accent bg-card p-6"><div className="flex items-start gap-4"><Building2 className="mt-1 h-5 w-5 shrink-0 text-accent" /><div><h2 className="font-bold">Un espace exclusivement réservé aux clients.</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Les artisans et techniciens partenaires utilisent l’espace prestataire distinct pour candidater et réaliser leurs missions.</p><Link to="/rejoindre" className="mt-3 inline-block text-sm font-bold underline">Accéder à l’Espace Prestataire</Link></div></div></div></div></section>
  </>;
}