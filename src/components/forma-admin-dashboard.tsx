import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, FileText, Mail, MessageCircle, Plus, RefreshCw, Search, ShieldCheck, Trash2, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { whatsappLink } from "@/lib/forma-contact";

type Quote = { id: string; created_at: string; pole: string; name: string; organization: string | null; phone: string; email: string | null; needs: string; place: string; desired_date: string | null; amount: string | null; status: string };
type Partner = { id: string; created_at: string; business_name: string; manager_name: string; trade: string; phone: string; email: string; documents: string | null; status: string };
type Site = { id: string; site: string; location: string; day_posts: number; night_posts: number; supervisor: string | null; last_report: string | null; status: string };

const quoteStatuses = ["Nouveau", "Chiffrage envoyé", "En négociation", "Signé", "Traité"];
const partnerStatuses = ["Candidature reçue", "En vérification", "Compléments demandés", "Validé", "Partenaire actif"];
const siteStatuses = ["Opérationnel", "Ronde effectuée", "Vigilance"];

const tone = (s: string) => s === "Vigilance" ? "border-destructive/35 bg-destructive/10 text-destructive" : ["Nouveau", "Candidature reçue", "En négociation", "Compléments demandés"].includes(s) ? "border-accent/50 bg-accent/15 text-foreground" : "border-primary/25 bg-primary/10 text-foreground";
const fmt = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
const waTo = (phone: string, text: string) => {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "243" + digits.slice(1);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

function StatusSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger className={`h-8 w-[170px] text-xs ${tone(value)}`}><SelectValue /></SelectTrigger><SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>;
}

export function FormaAdminDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [pole, setPole] = useState("Tous les pôles");
  const [newSite, setNewSite] = useState({ site: "", location: "", day_posts: "0", night_posts: "0", supervisor: "" });

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const [q, p, s] = await Promise.all([
      supabase.from("quote_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("partner_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("security_sites").select("*").order("created_at", { ascending: false }),
    ]);
    if (q.error || p.error || s.error) setError("Impossible de charger certaines données. Réessayez.");
    setQuotes((q.data as Quote[]) ?? []); setPartners((p.data as Partner[]) ?? []); setSites((s.data as Site[]) ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const n = search.trim().toLocaleLowerCase("fr");
  const match = (t: string) => !n || t.toLocaleLowerCase("fr").includes(n);
  const vQuotes = useMemo(() => quotes.filter((q) => match(`${q.name} ${q.organization ?? ""} ${q.place} ${q.status}`) && (pole === "Tous les pôles" || q.pole.startsWith(pole))), [quotes, n, pole]);
  const vSites = useMemo(() => sites.filter((s) => match(`${s.site} ${s.location} ${s.supervisor ?? ""} ${s.status}`)), [sites, n]);
  const vPartners = useMemo(() => partners.filter((p) => match(`${p.business_name} ${p.trade} ${p.status}`)), [partners, n]);

  const updQuote = async (id: string, patch: Partial<Quote>) => { setQuotes((c) => c.map((q) => q.id === id ? { ...q, ...patch } : q)); const { error } = await supabase.from("quote_requests").update(patch).eq("id", id); if (error) setError("La mise à jour du devis a échoué."); };
  const updPartner = async (id: string, status: string) => { setPartners((c) => c.map((p) => p.id === id ? { ...p, status } : p)); const { error } = await supabase.from("partner_applications").update({ status }).eq("id", id); if (error) setError("La mise à jour de la candidature a échoué."); };
  const updSite = async (id: string, patch: Partial<Site>) => { setSites((c) => c.map((s) => s.id === id ? { ...s, ...patch } : s)); const { error } = await supabase.from("security_sites").update(patch).eq("id", id); if (error) setError("La mise à jour du site a échoué."); };
  const delSite = async (id: string) => { if (!confirm("Supprimer ce site ?")) return; setSites((c) => c.filter((s) => s.id !== id)); await supabase.from("security_sites").delete().eq("id", id); };
  const addSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSite.site.trim().length < 2 || newSite.location.trim().length < 2) { setError("Indiquez le nom du site et sa commune."); return; }
    const { data, error } = await supabase.from("security_sites").insert({ site: newSite.site.trim().slice(0, 120), location: newSite.location.trim().slice(0, 80), day_posts: Math.max(0, Number(newSite.day_posts) || 0), night_posts: Math.max(0, Number(newSite.night_posts) || 0), supervisor: newSite.supervisor.trim() || null }).select().single();
    if (error) { setError("L'ajout du site a échoué."); return; }
    setSites((c) => [data as Site, ...c]); setNewSite({ site: "", location: "", day_posts: "0", night_posts: "0", supervisor: "" });
  };

  const agents = sites.reduce((t, s) => t + s.day_posts + s.night_posts, 0);
  const kpis = [
    { icon: ShieldCheck, label: "Sites sous contrat · agents", value: `${sites.length} · ${agents}`, detail: "Kinshasa" },
    { icon: FileText, label: "Devis à chiffrer", value: quotes.filter((q) => q.status === "Nouveau").length, detail: "À traiter" },
    { icon: UserCheck, label: "Candidatures à examiner", value: partners.filter((p) => ["Candidature reçue", "En vérification", "Compléments demandés"].includes(p.status)).length, detail: "Qualification" },
    { icon: ClipboardCheck, label: "Devis signés", value: quotes.filter((q) => q.status === "Signé").length, detail: "Exécution" },
  ];
  const th = "px-4 py-3 font-semibold";
  const td = "px-4 py-3 align-top";

  return <div className="overflow-hidden border border-border bg-background shadow-soft">
    <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map(({ icon: Icon, label, value, detail }) => <div key={label} className="bg-card p-5 sm:p-6"><div className="flex items-start justify-between"><Icon className="h-5 w-5 text-accent" /><span className="text-xs font-semibold text-muted-foreground">{detail}</span></div><p className="mt-5 text-3xl font-bold">{loading ? "…" : value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></div>)}
    </div>

    <div className="border-b border-border p-4 sm:p-6">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto]"><label className="relative"><span className="sr-only">Rechercher</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value.slice(0, 80))} placeholder="Rechercher client, site, commune, métier…" className="h-11 pl-10" /></label><Select value={pole} onValueChange={setPole}><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent>{["Tous les pôles", "Sécurité", "Événement", "Facility", "Formation", "Photo", "Publicité", "Solution"].map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select><Button variant="outline" className="h-11" onClick={() => void load()}><RefreshCw /> Actualiser</Button></div>
      {error && <p className="mt-3 border-l-2 border-destructive pl-3 text-sm text-destructive">{error}</p>}
    </div>

    <Tabs defaultValue="devis">
      <div className="overflow-x-auto border-b border-border px-4 pt-4 sm:px-6"><TabsList className="h-auto min-w-max justify-start rounded-none bg-transparent p-0">{[["devis", `Devis (${quotes.length})`], ["operations", `Postes de sécurité (${sites.length})`], ["partners", `Partenaires (${partners.length})`]].map(([v, l]) => <TabsTrigger key={v} value={v} className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none">{l}</TabsTrigger>)}</TabsList></div>

      <TabsContent value="devis" className="m-0">
        {vQuotes.length === 0 ? <p className="p-10 text-center text-sm text-muted-foreground">{loading ? "Chargement…" : "Aucune demande de devis pour le moment. Les demandes envoyées depuis le site apparaissent ici."}</p> :
          <div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr>{["Date", "Client / organisation", "Pôle", "Lieu · date", "Besoin", "Montant indicatif", "Statut", "Actions"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead><tbody>{vQuotes.map((q) => <tr key={q.id} className="border-t border-border">
            <td className={`${td} whitespace-nowrap text-muted-foreground`}>{fmt(q.created_at)}</td>
            <td className={td}><p className="font-semibold">{q.name}</p><p className="text-xs text-muted-foreground">{q.organization ?? "Particulier"} · {q.phone}</p></td>
            <td className={td}>{q.pole}</td>
            <td className={td}>{q.place}<p className="text-xs text-muted-foreground">{q.desired_date ?? "—"}</p></td>
            <td className={`${td} max-w-[260px]`}><p className="line-clamp-3 text-xs text-muted-foreground" title={q.needs}>{q.needs}</p></td>
            <td className={td}><Input defaultValue={q.amount ?? ""} placeholder="À chiffrer" maxLength={40} className="h-8 w-32 text-xs" onBlur={(e) => e.target.value !== (q.amount ?? "") && void updQuote(q.id, { amount: e.target.value || null })} /></td>
            <td className={td}><StatusSelect value={q.status} options={quoteStatuses} onChange={(v) => void updQuote(q.id, { status: v })} /></td>
            <td className={td}><div className="flex gap-2"><Button asChild size="sm" variant="outline" title="WhatsApp"><a href={waTo(q.phone, `Bonjour ${q.name}, FORMA Event & Security revient vers vous concernant votre demande de devis (${q.pole}).`)} target="_blank" rel="noreferrer"><MessageCircle /></a></Button>{q.email && <Button asChild size="sm" variant="outline" title="Email"><a href={`mailto:${q.email}?subject=${encodeURIComponent(`Votre demande de devis FORMA — ${q.pole}`)}`}><Mail /></a></Button>}<Button size="sm" title="Marquer traité" disabled={q.status === "Traité"} onClick={() => void updQuote(q.id, { status: "Traité" })}><CheckCircle2 /></Button></div></td>
          </tr>)}</tbody></table></div>}
      </TabsContent>

      <TabsContent value="operations" className="m-0">
        <form onSubmit={addSite} className="grid gap-3 border-b border-border bg-muted/30 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-[1.4fr_1fr_100px_100px_1fr_auto]">
          <Input placeholder="Site client" maxLength={120} value={newSite.site} onChange={(e) => setNewSite({ ...newSite, site: e.target.value })} />
          <Input placeholder="Commune (ex. Gombe)" maxLength={80} value={newSite.location} onChange={(e) => setNewSite({ ...newSite, location: e.target.value })} />
          <Input type="number" min={0} aria-label="Postes jour" title="Postes 12h jour" value={newSite.day_posts} onChange={(e) => setNewSite({ ...newSite, day_posts: e.target.value })} />
          <Input type="number" min={0} aria-label="Postes nuit" title="Postes 12h nuit" value={newSite.night_posts} onChange={(e) => setNewSite({ ...newSite, night_posts: e.target.value })} />
          <Input placeholder="Superviseur" maxLength={80} value={newSite.supervisor} onChange={(e) => setNewSite({ ...newSite, supervisor: e.target.value })} />
          <Button type="submit"><Plus /> Ajouter</Button>
        </form>
        {vSites.length === 0 ? <p className="p-10 text-center text-sm text-muted-foreground">{loading ? "Chargement…" : "Aucun site enregistré. Ajoutez vos sites sous contrat ci-dessus."}</p> :
          <div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr>{["Site client", "Commune", "Jour 12h", "Nuit 12h", "Superviseur", "Dernier rapport de ronde", "Statut", ""].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead><tbody>{vSites.map((s) => <tr key={s.id} className="border-t border-border">
            <td className={`${td} font-semibold`}>{s.site}</td><td className={td}>{s.location}</td>
            <td className={td}><Input type="number" min={0} defaultValue={s.day_posts} className="h-8 w-16 text-xs" onBlur={(e) => void updSite(s.id, { day_posts: Math.max(0, Number(e.target.value) || 0) })} /></td>
            <td className={td}><Input type="number" min={0} defaultValue={s.night_posts} className="h-8 w-16 text-xs" onBlur={(e) => void updSite(s.id, { night_posts: Math.max(0, Number(e.target.value) || 0) })} /></td>
            <td className={td}>{s.supervisor ?? "—"}</td>
            <td className={td}><div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{s.last_report ?? "Aucun"}</span><Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => void updSite(s.id, { last_report: new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }), status: "Ronde effectuée" })}>Ronde ✓</Button></div></td>
            <td className={td}><StatusSelect value={s.status} options={siteStatuses} onChange={(v) => void updSite(s.id, { status: v })} /></td>
            <td className={td}><Button size="icon" variant="ghost" title="Supprimer" onClick={() => void delSite(s.id)}><Trash2 /></Button></td>
          </tr>)}</tbody></table></div>}
      </TabsContent>

      <TabsContent value="partners" className="m-0">
        {vPartners.length === 0 ? <p className="p-10 text-center text-sm text-muted-foreground">{loading ? "Chargement…" : "Aucune candidature pour le moment. Les candidatures envoyées depuis « Rejoindre le réseau » apparaissent ici."}</p> :
          <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr>{["Date", "Raison sociale / professionnel", "Métier", "Contact", "Documents", "Statut", "Actions"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead><tbody>{vPartners.map((p) => <tr key={p.id} className="border-t border-border">
            <td className={`${td} whitespace-nowrap text-muted-foreground`}>{fmt(p.created_at)}</td>
            <td className={td}><p className="font-semibold">{p.business_name}</p><p className="text-xs text-muted-foreground">{p.manager_name}</p></td>
            <td className={td}>{p.trade}</td>
            <td className={td}><p>{p.phone}</p><p className="text-xs text-muted-foreground">{p.email}</p></td>
            <td className={`${td} max-w-[200px] text-xs`}>{p.documents ?? <Badge variant="outline">Non précisés</Badge>}</td>
            <td className={td}><StatusSelect value={p.status} options={partnerStatuses} onChange={(v) => void updPartner(p.id, v)} /></td>
            <td className={td}><div className="flex gap-2"><Button size="sm" title="Valider" onClick={() => void updPartner(p.id, "Validé")}><UserCheck /></Button><Button asChild size="sm" variant="outline" title="Demander des pièces par email"><a href={`mailto:${p.email}?subject=${encodeURIComponent("Candidature FORMA — pièces complémentaires")}`} onClick={() => void updPartner(p.id, "Compléments demandés")}><Mail /></a></Button><Button asChild size="sm" variant="outline" title="WhatsApp"><a href={waTo(p.phone, `Bonjour ${p.manager_name}, FORMA Event & Security vous contacte au sujet de votre candidature au réseau de partenaires.`)} target="_blank" rel="noreferrer"><MessageCircle /></a></Button></div></td>
          </tr>)}</tbody></table></div>}
      </TabsContent>
    </Tabs>
  </div>;
}

export { whatsappLink };
