import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, BookOpenCheck, ClipboardList, Moon, Plus, RefreshCw, ShieldCheck, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  currentLocalDateTime,
  SECURITY_ENTRY_TYPES,
  SECURITY_SEVERITIES,
  SECURITY_SHIFT_TYPES,
  securityOperationSchema,
  type SecurityOperationInput,
} from "@/lib/security-operations";

type SecuritySite = {
  id: string;
  site: string;
  location: string;
  supervisor: string | null;
  instructions: string;
};

type SecurityOperation = {
  id: string;
  site_id: string;
  entry_type: string;
  shift_type: string | null;
  occurred_at: string;
  agent_name: string;
  supervisor: string;
  severity: string;
  summary: string;
  details: string;
  action_taken: string;
};

const initialEntry = (siteId = ""): SecurityOperationInput => ({
  site_id: siteId,
  entry_type: "Prise de poste",
  shift_type: "Jour",
  occurred_at: currentLocalDateTime(),
  agent_name: "",
  supervisor: "",
  severity: "Information",
  summary: "Prise de poste effectuée",
  details: "",
  action_taken: "",
});

const dateTime = (value: string) =>
  new Date(value).toLocaleString("fr-CD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const severityTone = (severity: string) =>
  severity === "Critique"
    ? "border-destructive/40 bg-destructive/10 text-destructive"
    : severity === "Vigilance"
      ? "border-accent/50 bg-accent/15 text-foreground"
      : "border-primary/20 bg-primary/10 text-foreground";

export function SecurityOperations({ sites }: { sites: SecuritySite[] }) {
  const [operations, setOperations] = useState<SecurityOperation[]>([]);
  const [instructions, setInstructions] = useState<Record<string, string>>({});
  const [entry, setEntry] = useState<SecurityOperationInput>(() => initialEntry());
  const [siteFilter, setSiteFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setInstructions(Object.fromEntries(sites.map((site) => [site.id, site.instructions])));
    if (!entry.site_id && sites[0]) setEntry((current) => ({ ...current, site_id: sites[0].id }));
  }, [sites, entry.site_id]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: loadError } = await supabase
      .from("security_operations")
      .select("*")
      .order("occurred_at", { ascending: false })
      .limit(250);
    if (loadError) setError("La main courante n’a pas pu être chargée.");
    setOperations((data as SecurityOperation[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(
    () =>
      operations.filter(
        (operation) =>
          (siteFilter === "all" || operation.site_id === siteFilter) &&
          (typeFilter === "all" || operation.entry_type === typeFilter),
      ),
    [operations, siteFilter, typeFilter],
  );
  const siteById = useMemo(() => new Map(sites.map((site) => [site.id, site])), [sites]);

  const chooseType = (entryType: SecurityOperationInput["entry_type"]) => {
    setEntry((current) => ({
      ...current,
      entry_type: entryType,
      shift_type: entryType === "Prise de poste" ? (current.shift_type ?? "Jour") : null,
      severity: entryType === "Incident" ? "Vigilance" : "Information",
      summary:
        entryType === "Prise de poste"
          ? "Prise de poste effectuée"
          : entryType === "Ronde de patrouille"
            ? "Ronde de patrouille effectuée"
            : "Incident signalé",
    }));
    setError("");
    setNotice("");
  };

  const saveEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const parsed = securityOperationSchema.safeParse(entry);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Vérifiez les informations saisies.");
      return;
    }
    setBusy(true);
    const payload = { ...parsed.data, occurred_at: new Date(parsed.data.occurred_at).toISOString() };
    const { data, error: insertError } = await supabase
      .from("security_operations")
      .insert(payload)
      .select()
      .single();
    setBusy(false);
    if (insertError) {
      setError("L’enregistrement dans la main courante a échoué.");
      return;
    }
    setOperations((current) => [data as SecurityOperation, ...current]);
    setEntry(initialEntry(parsed.data.site_id));
    setNotice("Entrée enregistrée dans la main courante.");
  };

  const saveInstructions = async (siteId: string) => {
    setError("");
    setNotice("");
    setBusy(true);
    const value = (instructions[siteId] ?? "").trim().slice(0, 5000);
    const { error: updateError } = await supabase
      .from("security_sites")
      .update({ instructions: value })
      .eq("id", siteId);
    setBusy(false);
    if (updateError) {
      setError("Les consignes du site n’ont pas pu être enregistrées.");
      return;
    }
    setNotice("Fiche de consignes mise à jour.");
  };

  if (sites.length === 0) {
    return (
      <div className="p-8 text-center sm:p-12">
        <ShieldCheck className="mx-auto h-7 w-7 text-accent" />
        <p className="mt-4 font-semibold">Aucun site de sécurité enregistré</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Ajoutez d’abord un site dans « Postes de sécurité » pour ouvrir sa main courante.
        </p>
      </div>
    );
  }

  return (
    <div className="grid divide-y divide-border">
      <section className="grid gap-6 p-4 sm:p-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,.7fr)]">
        <form onSubmit={saveEntry} className="border border-border bg-card p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Nouvelle entrée</p>
              <h2 className="mt-2 text-xl font-bold">Main courante terrain</h2>
            </div>
            <ClipboardList className="h-6 w-6 text-accent" />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {SECURITY_ENTRY_TYPES.map((type) => (
              <Button
                key={type}
                type="button"
                variant={entry.entry_type === type ? "default" : "outline"}
                className="h-auto min-h-10 whitespace-normal px-3 py-2"
                onClick={() => chooseType(type)}
              >
                {type === "Incident" ? <AlertTriangle /> : type === "Ronde de patrouille" ? <ShieldCheck /> : <BookOpenCheck />}
                {type}
              </Button>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Site client">
              <Select value={entry.site_id} onValueChange={(site_id) => setEntry({ ...entry, site_id })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un site" /></SelectTrigger>
                <SelectContent>{sites.map((site) => <SelectItem key={site.id} value={site.id}>{site.site} · {site.location}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Date et heure">
              <Input type="datetime-local" value={entry.occurred_at} onChange={(event) => setEntry({ ...entry, occurred_at: event.target.value })} />
            </Field>
            <Field label="Agent / chef de poste">
              <Input maxLength={120} value={entry.agent_name} onChange={(event) => setEntry({ ...entry, agent_name: event.target.value })} placeholder="Nom complet" />
            </Field>
            <Field label="Superviseur FORMA">
              <Input maxLength={120} value={entry.supervisor} onChange={(event) => setEntry({ ...entry, supervisor: event.target.value })} placeholder="Nom du superviseur" />
            </Field>
            {entry.entry_type === "Prise de poste" && (
              <Field label="Service">
                <Select value={entry.shift_type ?? "Jour"} onValueChange={(shift_type) => setEntry({ ...entry, shift_type: shift_type as SecurityOperationInput["shift_type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SECURITY_SHIFT_TYPES.map((shift) => <SelectItem key={shift} value={shift}>{shift === "Jour" ? <Sun className="mr-2 inline h-4 w-4" /> : <Moon className="mr-2 inline h-4 w-4" />}{shift}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            )}
            <Field label="Niveau">
              <Select value={entry.severity} onValueChange={(severity) => setEntry({ ...entry, severity: severity as SecurityOperationInput["severity"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SECURITY_SEVERITIES.map((severity) => <SelectItem key={severity} value={severity}>{severity}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
          <div className="mt-4 grid gap-4">
            <Field label="Résumé">
              <Input maxLength={180} value={entry.summary} onChange={(event) => setEntry({ ...entry, summary: event.target.value })} />
            </Field>
            <Field label={entry.entry_type === "Incident" ? "Description détaillée de l’incident" : "Observations terrain"}>
              <Textarea rows={4} maxLength={3000} value={entry.details} onChange={(event) => setEntry({ ...entry, details: event.target.value })} placeholder="Faits observés, personnes présentes, matériel ou points contrôlés…" />
            </Field>
            <Field label="Mesures prises / suite à donner">
              <Textarea rows={3} maxLength={1500} value={entry.action_taken} onChange={(event) => setEntry({ ...entry, action_taken: event.target.value })} placeholder="Action immédiate, information transmise, suivi requis…" />
            </Field>
          </div>
          {(error || notice) && <p role="status" className={`mt-4 border-l-2 pl-3 text-sm ${error ? "border-destructive text-destructive" : "border-accent text-foreground"}`}>{error || notice}</p>}
          <Button type="submit" disabled={busy} className="mt-5 w-full sm:w-auto">
            <Plus /> {busy ? "Enregistrement…" : "Enregistrer dans la main courante"}
          </Button>
        </form>

        <div className="space-y-4">
          <div>
            <p className="eyebrow">Fiches permanentes</p>
            <h2 className="mt-2 text-xl font-bold">Consignes par site</h2>
          </div>
          {sites.map((site) => (
            <div key={site.id} className="border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div><p className="font-semibold">{site.site}</p><p className="text-xs text-muted-foreground">{site.location} · {site.supervisor || "Superviseur non assigné"}</p></div>
                <BookOpenCheck className="h-5 w-5 text-accent" />
              </div>
              <Textarea
                aria-label={`Consignes ${site.site}`}
                rows={5}
                maxLength={5000}
                className="mt-3"
                value={instructions[site.id] ?? ""}
                onChange={(event) => setInstructions((current) => ({ ...current, [site.id]: event.target.value }))}
                placeholder="Accès, zones sensibles, contacts d’urgence, contrôles obligatoires…"
              />
              <Button type="button" size="sm" variant="outline" disabled={busy} className="mt-3" onClick={() => void saveInstructions(site.id)}>
                Enregistrer les consignes
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="eyebrow">Historique</p><h2 className="mt-2 text-xl font-bold">Journal des opérations</h2></div>
          <div className="grid gap-2 sm:grid-cols-[220px_190px_auto]">
            <Select value={siteFilter} onValueChange={setSiteFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tous les sites</SelectItem>{sites.map((site) => <SelectItem key={site.id} value={site.id}>{site.site}</SelectItem>)}</SelectContent></Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tous les événements</SelectItem>{SECURITY_ENTRY_TYPES.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select>
            <Button type="button" variant="outline" onClick={() => void load()}><RefreshCw /> Actualiser</Button>
          </div>
        </div>
        {loading ? <p className="py-10 text-center text-sm text-muted-foreground">Chargement de la main courante…</p> : visible.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">Aucune entrée pour ces filtres.</p> : (
          <div className="mt-5 grid gap-3">
            {visible.map((operation) => {
              const site = siteById.get(operation.site_id);
              return (
                <article key={operation.id} className="grid gap-4 border border-border bg-card p-4 md:grid-cols-[170px_minmax(0,1fr)_auto] md:p-5">
                  <div><p className="text-sm font-semibold">{dateTime(operation.occurred_at)}</p><p className="mt-1 text-xs text-muted-foreground">{site?.site ?? "Site supprimé"}<br />{site?.location}</p></div>
                  <div><div className="flex flex-wrap items-center gap-2"><Badge variant="outline">{operation.entry_type}</Badge>{operation.shift_type && <Badge variant="secondary">Service {operation.shift_type.toLowerCase()}</Badge>}<Badge variant="outline" className={severityTone(operation.severity)}>{operation.severity}</Badge></div><h3 className="mt-3 font-semibold">{operation.summary}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{operation.details || "Aucune observation complémentaire."}</p>{operation.action_taken && <p className="mt-3 border-l-2 border-accent pl-3 text-sm"><span className="font-semibold">Mesures prises :</span> {operation.action_taken}</p>}</div>
                  <div className="text-xs text-muted-foreground md:text-right"><p className="font-semibold text-foreground">{operation.agent_name}</p><p>{operation.supervisor || "Sans superviseur indiqué"}</p></div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-2"><Label>{label}</Label>{children}</div>;
}
