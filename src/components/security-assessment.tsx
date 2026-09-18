import { useMemo, useState } from "react";
import { ShieldCheck, MapPin, Clock3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sites = ["Entreprise / bureau", "Chantier", "Résidence", "Commerce", "Événement", "Institution"];
const risks = ["Standard", "Renforcé", "Élevé"];

export function SecurityAssessment() {
  const [site, setSite] = useState(sites[0]);
  const [location, setLocation] = useState("Gombe");
  const [surface, setSurface] = useState(500);
  const [agents, setAgents] = useState(2);
  const [risk, setRisk] = useState(risks[0]);
  const [hours, setHours] = useState("24 h / 24");
  const score = useMemo(() => Math.min(100, 25 + agents * 8 + (risk === "Élevé" ? 28 : risk === "Renforcé" ? 16 : 6) + (surface > 2000 ? 16 : surface > 750 ? 9 : 3)), [agents, risk, surface]);
  const message = encodeURIComponent(`Bonjour FORMA, je souhaite une évaluation sécuritaire : ${site}, ${location}, ${surface} m², ${agents} agent(s), risque ${risk}, horaires ${hours}.`);
  return <div className="border border-border bg-card p-5 md:p-8">
    <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Diagnostic interactif</p><h3 className="mt-2 text-2xl font-bold">Évaluation sécuritaire de site</h3></div><ShieldCheck className="h-8 w-8 text-accent" /></div>
    <div className="mt-8 grid gap-5 sm:grid-cols-2">
      <label className="text-xs font-bold uppercase text-muted-foreground">Type de site<select value={site} onChange={(e) => setSite(e.target.value)} className="mt-2 h-11 w-full border border-input bg-background px-3 text-sm font-medium">{sites.map(x => <option key={x}>{x}</option>)}</select></label>
      <label className="text-xs font-bold uppercase text-muted-foreground">Commune / localisation<div className="relative mt-2"><MapPin className="absolute left-3 top-3 h-4 w-4 text-accent" /><Input value={location} onChange={(e) => setLocation(e.target.value.slice(0, 80))} maxLength={80} className="h-11 pl-10" /></div></label>
      <label className="text-xs font-bold uppercase text-muted-foreground">Superficie estimée (m²)<Input type="number" min="20" max="100000" value={surface} onChange={(e) => setSurface(Math.max(20, Number(e.target.value)))} className="mt-2 h-11" /></label>
      <label className="text-xs font-bold uppercase text-muted-foreground">Agents envisagés<div className="relative mt-2"><Users className="absolute left-3 top-3 h-4 w-4 text-accent" /><Input type="number" min="1" max="100" value={agents} onChange={(e) => setAgents(Math.max(1, Math.min(100, Number(e.target.value))))} className="h-11 pl-10" /></div></label>
      <label className="text-xs font-bold uppercase text-muted-foreground">Niveau de risque<select value={risk} onChange={(e) => setRisk(e.target.value)} className="mt-2 h-11 w-full border border-input bg-background px-3 text-sm font-medium">{risks.map(x => <option key={x}>{x}</option>)}</select></label>
      <label className="text-xs font-bold uppercase text-muted-foreground">Horaires<div className="relative mt-2"><Clock3 className="absolute left-3 top-3 h-4 w-4 text-accent" /><select value={hours} onChange={(e) => setHours(e.target.value)} className="h-11 w-full border border-input bg-background pl-10 pr-3 text-sm font-medium"><option>24 h / 24</option><option>Journée</option><option>Nuit</option><option>Ponctuel</option></select></div></label>
    </div>
    <div className="mt-7 border-t border-border pt-6"><div className="mb-3 flex justify-between text-sm"><span>Indice d’attention estimé</span><strong>{score}/100</strong></div><div className="h-1.5 bg-muted"><div className="h-full bg-accent transition-all" style={{ width: `${score}%` }} /></div><p className="mt-4 text-xs leading-5 text-muted-foreground">Cette première lecture est indicative. Une visite du site permet à FORMA de dimensionner le dispositif avec précision.</p><Button asChild className="mt-5 h-11 w-full"><a href={`https://wa.me/243977528234?text=${message}`} target="_blank" rel="noreferrer">Transmettre mon évaluation</a></Button></div>
  </div>;
}