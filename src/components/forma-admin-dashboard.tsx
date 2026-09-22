import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  MessageCircle,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type QuoteStatus = "Nouveau" | "Chiffrage envoyé" | "En négociation" | "Signé" | "Traité";
type PartnerStatus = "Candidature reçue" | "En vérification" | "Validé" | "Partenaire actif";

const initialQuotes = [
  { id: 1, date: "22 sept.", client: "Organisation exemple A", pole: "Sécurité", location: "Gombe", amount: "À chiffrer", status: "Nouveau" as QuoteStatus },
  { id: 2, date: "21 sept.", client: "Organisation exemple B", pole: "Facility", location: "Limete", amount: "Sur étude", status: "Chiffrage envoyé" as QuoteStatus },
  { id: 3, date: "19 sept.", client: "Organisation exemple C", pole: "Événement", location: "Ngaliema", amount: "Sur étude", status: "En négociation" as QuoteStatus },
];

const sites = [
  { site: "Site client exemple A", location: "Gombe", day: 4, night: 3, supervisor: "Superviseur assigné", report: "Aujourd’hui · 07:42", status: "Opérationnel" },
  { site: "Site client exemple B", location: "Limete", day: 2, night: 2, supervisor: "Superviseur assigné", report: "Aujourd’hui · 06:18", status: "Ronde effectuée" },
  { site: "Site client exemple C", location: "Nsele", day: 3, night: 3, supervisor: "À confirmer", report: "Hier · 22:05", status: "Vigilance" },
];

const initialPartners = [
  { id: 1, name: "Entreprise exemple A", trade: "Climatisation", contact: "+243 ••• ••• •••", documents: "RCCM · Références", status: "En vérification" as PartnerStatus },
  { id: 2, name: "Professionnel exemple B", trade: "Électricité", contact: "+243 ••• ••• •••", documents: "RCCM", status: "Candidature reçue" as PartnerStatus },
  { id: 3, name: "PME exemple C", trade: "Nettoyage", contact: "+243 ••• ••• •••", documents: "RCCM · Agréments", status: "Validé" as PartnerStatus },
];

const statusStyle: Record<string, string> = {
  Nouveau: "border-accent/50 bg-accent/15 text-foreground",
  "Chiffrage envoyé": "border-border bg-muted text-foreground",
  "En négociation": "border-accent/50 bg-accent/15 text-foreground",
  Signé: "border-primary/25 bg-primary/10 text-foreground",
  Traité: "border-primary/25 bg-primary/10 text-foreground",
  Opérationnel: "border-primary/25 bg-primary/10 text-foreground",
  "Ronde effectuée": "border-primary/25 bg-primary/10 text-foreground",
  Vigilance: "border-destructive/35 bg-destructive/10 text-destructive",
  "Candidature reçue": "border-accent/50 bg-accent/15 text-foreground",
  "En vérification": "border-border bg-muted text-foreground",
  Validé: "border-primary/25 bg-primary/10 text-foreground",
  "Partenaire actif": "border-primary/25 bg-primary/10 text-foreground",
};

function StatusBadge({ children }: { children: string }) {
  return <Badge variant="outline" className={statusStyle[children] ?? ""}>{children}</Badge>;
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="border-b border-border px-4 py-5 sm:px-6"><p className="eyebrow">{eyebrow}</p><h3 className="mt-2 text-xl font-bold sm:text-2xl">{title}</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p></div>;
}

export function FormaAdminDashboard() {
  const [search, setSearch] = useState("");
  const [pole, setPole] = useState("Tous les pôles");
  const [quotes, setQuotes] = useState(initialQuotes);
  const [partners, setPartners] = useState(initialPartners);

  const normalized = search.trim().toLocaleLowerCase("fr");
  const visibleQuotes = useMemo(() => quotes.filter((quote) =>
    (!normalized || `${quote.client} ${quote.location} ${quote.status}`.toLocaleLowerCase("fr").includes(normalized)) &&
    (pole === "Tous les pôles" || quote.pole === pole),
  ), [normalized, pole, quotes]);
  const visibleSites = useMemo(() => sites.filter((site) => !normalized || `${site.site} ${site.location} ${site.supervisor} ${site.status}`.toLocaleLowerCase("fr").includes(normalized)), [normalized]);
  const visiblePartners = useMemo(() => partners.filter((partner) => !normalized || `${partner.name} ${partner.trade} ${partner.status}`.toLocaleLowerCase("fr").includes(normalized)), [normalized, partners]);

  const markQuoteHandled = (id: number) => setQuotes((current) => current.map((quote) => quote.id === id ? { ...quote, status: "Traité" } : quote));
  const setPartnerStatus = (id: number, status: PartnerStatus) => setPartners((current) => current.map((partner) => partner.id === id ? { ...partner, status } : partner));

  return <div className="overflow-hidden border border-border bg-background shadow-soft">
    <header className="border-b border-border bg-primary px-4 py-6 text-primary-foreground sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="eyebrow">FORMA Admin</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Centre de pilotage opérationnel</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/65">Vue de démonstration destinée à la direction générale et aux superviseurs. Les données affichées sont illustratives.</p></div>
        <div className="flex items-center gap-2 text-xs font-semibold text-primary-foreground/70"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-accent" /></span>Mise à jour en temps réel</div>
      </div>
    </header>

    <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
      {[
        { icon: ShieldCheck, label: "Sites & agents déployés", value: "—", detail: "Kinshasa" },
        { icon: FileText, label: "Devis à chiffrer", value: quotes.filter((quote) => quote.status === "Nouveau").length.toString(), detail: "À traiter" },
        { icon: UserCheck, label: "Candidatures à examiner", value: partners.filter((partner) => partner.status === "Candidature reçue" || partner.status === "En vérification").length.toString(), detail: "Qualification" },
        { icon: ClipboardCheck, label: "Missions en cours", value: "—", detail: "Exécution" },
      ].map(({ icon: Icon, label, value, detail }) => <div key={label} className="bg-card p-5 sm:p-6"><div className="flex items-start justify-between"><Icon className="h-5 w-5 text-accent" /><span className="text-xs font-semibold text-muted-foreground">{detail}</span></div><p className="mt-5 text-3xl font-bold">{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></div>)}
    </div>

    <div className="border-b border-border p-4 sm:p-6">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_240px]"><label className="relative"><span className="sr-only">Rechercher</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value.slice(0, 80))} placeholder="Rechercher client, site, commune, métier…" className="h-11 pl-10" maxLength={80} /></label><Select value={pole} onValueChange={setPole}><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent>{["Tous les pôles", "Sécurité", "Événement", "Facility"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
    </div>

    <Tabs defaultValue="devis" className="w-full">
      <div className="overflow-x-auto border-b border-border px-4 pt-4 sm:px-6"><TabsList className="h-auto min-w-max justify-start rounded-none bg-transparent p-0"><TabsTrigger value="devis" className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none">Devis & pipeline</TabsTrigger><TabsTrigger value="operations" className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none">Opérations & sécurité</TabsTrigger><TabsTrigger value="partners" className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none">Réseau partenaires</TabsTrigger></TabsList></div>

      <TabsContent value="devis" className="m-0"><SectionHeader eyebrow="Commercial" title="Suivi des devis & pipeline" description="Priorisez les demandes, suivez l’avancement du chiffrage et accédez aux actions courantes." /><div className="hidden overflow-x-auto lg:block"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr>{["Date", "Client / organisation", "Pôle", "Commune / lieu", "Montant indicatif", "Statut", "Actions"].map((head) => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody>{visibleQuotes.map((quote) => <tr key={quote.id} className="border-t border-border"><td className="px-4 py-4 text-muted-foreground">{quote.date}</td><td className="px-4 py-4 font-semibold">{quote.client}</td><td className="px-4 py-4">{quote.pole}</td><td className="px-4 py-4">{quote.location}</td><td className="px-4 py-4">{quote.amount}</td><td className="px-4 py-4"><StatusBadge>{quote.status}</StatusBadge></td><td className="px-4 py-4"><div className="flex gap-2"><Button size="sm" variant="outline" title="Contacter par WhatsApp"><MessageCircle /><span>WhatsApp</span></Button><Button size="sm" onClick={() => markQuoteHandled(quote.id)} disabled={quote.status === "Traité"}><CheckCircle2 /><span>Traité</span></Button></div></td></tr>)}</tbody></table></div><div className="grid gap-3 p-4 lg:hidden">{visibleQuotes.map((quote) => <article key={quote.id} className="border border-border bg-card p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{quote.client}</p><p className="mt-1 text-xs text-muted-foreground">{quote.date} · {quote.location}</p></div><StatusBadge>{quote.status}</StatusBadge></div><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-xs text-muted-foreground">Pôle</dt><dd className="mt-1 font-semibold">{quote.pole}</dd></div><div><dt className="text-xs text-muted-foreground">Montant</dt><dd className="mt-1 font-semibold">{quote.amount}</dd></div></dl><div className="mt-4 grid grid-cols-2 gap-2"><Button size="sm" variant="outline"><MessageCircle />WhatsApp</Button><Button size="sm" onClick={() => markQuoteHandled(quote.id)} disabled={quote.status === "Traité"}><CheckCircle2 />Traité</Button></div></article>)}</div>{visibleQuotes.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">Aucun devis ne correspond à ces filtres.</p>}</TabsContent>

      <TabsContent value="operations" className="m-0"><SectionHeader eyebrow="Terrain" title="Supervision opérationnelle & postes de sécurité" description="Contrôlez les effectifs jour et nuit, les responsables de site et la fraîcheur des rapports de ronde." /><div className="hidden overflow-x-auto lg:block"><table className="w-full min-w-[980px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr>{["Site client", "Localisation", "Postes 12h jour", "Postes 12h nuit", "Superviseur", "Dernier rapport", "Statut"].map((head) => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody>{visibleSites.map((site) => <tr key={site.site} className="border-t border-border"><td className="px-4 py-4 font-semibold">{site.site}</td><td className="px-4 py-4">{site.location}</td><td className="px-4 py-4">{site.day}</td><td className="px-4 py-4">{site.night}</td><td className="px-4 py-4">{site.supervisor}</td><td className="px-4 py-4 text-muted-foreground">{site.report}</td><td className="px-4 py-4"><StatusBadge>{site.status}</StatusBadge></td></tr>)}</tbody></table></div><div className="grid gap-3 p-4 lg:hidden">{visibleSites.map((site) => <article key={site.site} className="border border-border bg-card p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{site.site}</p><p className="mt-1 text-xs text-muted-foreground">{site.location}</p></div><StatusBadge>{site.status}</StatusBadge></div><div className="mt-4 grid grid-cols-2 gap-3 border-y border-border py-3 text-sm"><p><span className="block text-xs text-muted-foreground">Jour · 12h</span><strong>{site.day} postes</strong></p><p><span className="block text-xs text-muted-foreground">Nuit · 12h</span><strong>{site.night} postes</strong></p></div><p className="mt-3 text-sm"><span className="text-muted-foreground">Supervision :</span> {site.supervisor}</p><p className="mt-1 text-xs text-muted-foreground">Dernier rapport : {site.report}</p></article>)}</div>{visibleSites.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">Aucun site ne correspond à cette recherche.</p>}</TabsContent>

      <TabsContent value="partners" className="m-0"><SectionHeader eyebrow="Qualification" title="Gestion du réseau partenaires" description="Centralisez les candidatures, contrôlez les documents et faites progresser chaque professionnel dans le processus." /><div className="hidden overflow-x-auto lg:block"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr>{["Raison sociale / professionnel", "Métier", "Contact", "Documents soumis", "Statut", "Actions"].map((head) => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody>{visiblePartners.map((partner) => <tr key={partner.id} className="border-t border-border"><td className="px-4 py-4 font-semibold">{partner.name}</td><td className="px-4 py-4">{partner.trade}</td><td className="px-4 py-4">{partner.contact}</td><td className="px-4 py-4">{partner.documents}</td><td className="px-4 py-4"><StatusBadge>{partner.status}</StatusBadge></td><td className="px-4 py-4"><div className="flex flex-wrap gap-2"><Button size="sm" onClick={() => setPartnerStatus(partner.id, "Validé")}><UserCheck />Valider</Button><Button size="sm" variant="outline" onClick={() => setPartnerStatus(partner.id, "En vérification")}><FileText />Pièces</Button><Button size="sm" variant="outline" onClick={() => setPartnerStatus(partner.id, "Partenaire actif")}><ClipboardCheck />Mission</Button></div></td></tr>)}</tbody></table></div><div className="grid gap-3 p-4 lg:hidden">{visiblePartners.map((partner) => <article key={partner.id} className="border border-border bg-card p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{partner.name}</p><p className="mt-1 text-xs text-muted-foreground">{partner.trade}</p></div><StatusBadge>{partner.status}</StatusBadge></div><p className="mt-4 text-sm"><span className="text-muted-foreground">Documents :</span> {partner.documents}</p><p className="mt-1 text-sm"><span className="text-muted-foreground">Contact :</span> {partner.contact}</p><div className="mt-4 grid grid-cols-3 gap-2"><Button size="sm" onClick={() => setPartnerStatus(partner.id, "Validé")} title="Valider"><UserCheck /><span className="sr-only">Valider</span></Button><Button size="sm" variant="outline" onClick={() => setPartnerStatus(partner.id, "En vérification")} title="Demander des pièces"><FileText /><span className="sr-only">Demander des pièces</span></Button><Button size="sm" variant="outline" onClick={() => setPartnerStatus(partner.id, "Partenaire actif")} title="Affecter une mission"><ClipboardCheck /><span className="sr-only">Affecter une mission</span></Button></div></article>)}</div>{visiblePartners.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">Aucune candidature ne correspond à cette recherche.</p>}</TabsContent>
    </Tabs>

    <footer className="flex flex-col gap-2 border-t border-border bg-muted/50 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6"><span className="flex items-center gap-2"><Clock3 className="h-4 w-4" />Dernière synchronisation : à l’instant</span><span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-accent" />Données de démonstration</span></footer>
  </div>;
}