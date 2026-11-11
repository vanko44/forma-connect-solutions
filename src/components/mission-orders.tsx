import { useLanguage } from "@/components/language-provider";
import { useEffect, useState, type ReactNode } from "react";
import { Plus, Pencil, Eye, Download, Printer, Mail, MessageCircle, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  MISSION_POLES,
  MISSION_STATUSES,
  missionFinance,
  missionMessage,
  missionSchema,
  usd,
  type MissionOrder,
} from "@/lib/mission-order";
import { openMissionPdf } from "@/lib/mission-order-pdf";
import { FORMA_ADDRESS, FORMA_EMAIL, FORMA_PHONE } from "@/lib/forma-contact";
type Partner = { id: string; business_name: string; phone: string; email: string };
const empty = {
  partner_id: null as string | null,
  partner_name: "",
  partner_phone: "",
  partner_email: "",
  title: "",
  pole: "Facility Management",
  client_site: "",
  location: "Kinshasa",
  start_date: "",
  end_date: "",
  instructions: "",
  supervisor: "",
  amount: 0,
  paid_amount: 0,
  due_date: null as string | null,
  status: "Brouillon",
};
function Field({ label, children }: { label: string; children: ReactNode }) {
  const { t: tr } = useLanguage();
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {tr(label)}
      {children}
    </label>
  );
}
function Choice({
  value,
  options,
  onChange,
}: {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  const { t: tr } = useLanguage();
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {tr(o)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export function MissionOrders({ partners, search }: { partners: Partner[]; search: string }) {
  const { t: tr } = useLanguage();
  const [rows, setRows] = useState<MissionOrder[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [editing, setEditing] = useState(false),
    [id, setId] = useState<string | null>(null),
    [draft, setDraft] = useState(empty),
    [busy, setBusy] = useState(false),
    [view, setView] = useState<MissionOrder | null>(null),
    [filter, setFilter] = useState("Tous");
  useEffect(() => {
    void supabase
      .from("mission_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError("Impossible de charger les ordres de mission.");
        else setRows(data ?? []);
        setLoading(false);
      });
  }, []);
  const edit = (r?: MissionOrder) => {
    setId(r?.id ?? null);
    setDraft(r ? { ...r } : { ...empty });
    setError("");
    setEditing(true);
  };
  const set = (key: keyof typeof empty, value: string | number | null) =>
    setDraft((d) => ({ ...d, [key]: value }));
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = missionSchema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Vérifiez les informations.");
      return;
    }
    setBusy(true);
    setError("");
    const query = id
      ? supabase.from("mission_orders").update(parsed.data).eq("id", id)
      : supabase.from("mission_orders").insert(parsed.data);
    const { data, error } = await query.select().single();
    setBusy(false);
    if (error || !data) {
      setError("Enregistrement impossible. Vérifiez les montants et les dates puis réessayez.");
      return;
    }
    setRows((r) => [data, ...r.filter((x) => x.id !== data.id)]);
    setEditing(false);
  };
  const exportDoc = async (r: MissionOrder, print = false) => {
    setBusy(true);
    setError("");
    try {
      await openMissionPdf(r, print);
    } catch {
      setError("Le document n’a pas pu être ouvert. Autorisez les fenêtres puis réessayez.");
    } finally {
      setBusy(false);
    }
  };
  const visible = rows.filter(
    (r) =>
      (filter === "Tous" || r.status === filter) &&
      `${r.order_number} ${r.title} ${r.partner_name} ${r.client_site}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
  );
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">{tr("Ordres de mission")}</h2>
        <div className="flex flex-wrap gap-3">
          <Choice value={filter} options={["Tous", ...MISSION_STATUSES]} onChange={setFilter} />
          <Button onClick={() => edit()}>
            <Plus />
            {tr("Nouvel ordre de mission")}
          </Button>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-4 text-destructive">
          {tr(error)}
        </p>
      )}
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((r) => {
          const f = missionFinance(r.amount, r.paid_amount);
          let phone = r.partner_phone.replace(/\D/g, "");
          if (phone.startsWith("0")) phone = "243" + phone.slice(1);
          const message = missionMessage(r);
          return (
            <article key={r.id} className="rounded-md border border-border bg-card p-5">
              <p className="text-xs font-bold text-accent">
                {r.order_number} · {r.pole}
              </p>
              <h3 className="mt-2 break-words text-lg font-bold">{r.title}</h3>
              <p className="mt-2 text-sm">
                {r.partner_name} · {r.client_site}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {r.start_date} → {r.end_date}
              </p>
              <p className="mt-4 text-sm font-semibold">{tr(r.status)}</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <dt>{tr("Montant")}</dt>
                <dd>{usd(r.amount)}</dd>
                <dt>{tr("Versé")}</dt>
                <dd>{usd(r.paid_amount)}</dd>
                <dt>{tr("Solde")}</dt>
                <dd className="font-bold">{usd(f.balance)}</dd>
                <dt>{tr("Paiement")}</dt>
                <dd>{tr(f.status)}</dd>
                <dt>{tr("Échéance")}</dt>
                <dd>{r.due_date || "À convenir"}</dd>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  title={tr("Modifier")}
                  aria-label={`Modifier ${r.order_number}`}
                  onClick={() => edit(r)}
                >
                  <Pencil />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  title={tr("Consulter")}
                  aria-label={`Consulter ${r.order_number}`}
                  onClick={() => setView(r)}
                >
                  <Eye />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  title={tr("Télécharger PDF")}
                  aria-label={`Télécharger ${r.order_number}`}
                  disabled={busy}
                  onClick={() => void exportDoc(r)}
                >
                  <Download />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  title={tr("Imprimer le PDF")}
                  aria-label={`Imprimer ${r.order_number}`}
                  disabled={busy}
                  onClick={() => void exportDoc(r, true)}
                >
                  <Printer />
                </Button>
                {phone && (
                  <Button
                    size="icon"
                    variant="outline"
                    asChild
                    title={tr("Transmettre par WhatsApp")}
                  >
                    <a
                      href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={tr("Transmettre par WhatsApp")}
                    >
                      <MessageCircle />
                    </a>
                  </Button>
                )}
                {r.partner_email && (
                  <Button size="icon" variant="outline" asChild title={tr("Transmettre par email")}>
                    <a
                      href={`mailto:${r.partner_email}?subject=${encodeURIComponent(`Ordre de mission FORMA ${r.order_number}`)}&body=${encodeURIComponent(message)}`}
                      aria-label={tr("Transmettre par email")}
                    >
                      <Mail />
                    </a>
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {!visible.length && (
        <p className="py-12 text-center text-muted-foreground">
          {tr(loading ? "Chargement…" : "Aucun ordre de mission.")}
        </p>
      )}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogTitle>
            {tr(id ? "Modifier l’ordre de mission" : "Nouvel ordre de mission")}
          </DialogTitle>
          <DialogDescription>
            {tr("FORMA · Direction et partenaires professionnels")}
          </DialogDescription>
          <form onSubmit={save} className="grid gap-5">
            <Field label={tr("Prestataire")}>
              <Select
                value={draft.partner_id ?? "new"}
                onValueChange={(v) => {
                  const p = partners.find((p) => p.id === v);
                  setDraft((d) => ({
                    ...d,
                    partner_id: p?.id ?? null,
                    partner_name: p?.business_name ?? "",
                    partner_phone: p?.phone ?? "",
                    partner_email: p?.email ?? "",
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">{tr("Nouveau prestataire")}</SelectItem>
                  {partners.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["partner_name", "Nom du prestataire"],
                  ["partner_phone", "Téléphone / WhatsApp"],
                  ["partner_email", "Email"],
                  ["title", "Intitulé de mission"],
                  ["client_site", "Client / site"],
                  ["location", "Lieu d’intervention"],
                  ["supervisor", "Superviseur FORMA"],
                ] as const
              ).map(([k, label]) => (
                <Field key={k} label={label}>
                  <Input
                    value={draft[k]}
                    maxLength={k === "partner_email" ? 255 : 200}
                    type={k === "partner_email" ? "email" : "text"}
                    required={!["partner_phone", "partner_email"].includes(k)}
                    onChange={(e) => set(k, e.target.value)}
                  />
                </Field>
              ))}
              <Field label={tr("Pôle")}>
                <Choice
                  value={draft.pole}
                  options={MISSION_POLES}
                  onChange={(v) => set("pole", v)}
                />
              </Field>
              <Field label={tr("Date de début")}>
                <Input
                  required
                  type="date"
                  value={draft.start_date}
                  onChange={(e) => set("start_date", e.target.value)}
                />
              </Field>
              <Field label={tr("Date de fin")}>
                <Input
                  required
                  type="date"
                  min={draft.start_date}
                  value={draft.end_date}
                  onChange={(e) => set("end_date", e.target.value)}
                />
              </Field>
              <Field label={tr("Montant convenu (USD)")}>
                <Input
                  required
                  type="number"
                  min={0}
                  step="0.01"
                  value={draft.amount}
                  onChange={(e) => set("amount", Number(e.target.value))}
                />
              </Field>
              <Field label={tr("Acompte / règlements versés (USD)")}>
                <Input
                  required
                  type="number"
                  min={0}
                  max={draft.amount}
                  step="0.01"
                  value={draft.paid_amount}
                  onChange={(e) => set("paid_amount", Number(e.target.value))}
                />
              </Field>
              <Field label={tr("Échéance de paiement")}>
                <Input
                  type="date"
                  value={draft.due_date ?? ""}
                  onChange={(e) => set("due_date", e.target.value || null)}
                />
              </Field>
              <Field label={tr("Statut de mission")}>
                <Choice
                  value={draft.status}
                  options={MISSION_STATUSES}
                  onChange={(v) => set("status", v)}
                />
              </Field>
            </div>
            <p className="border-y border-border py-3 text-sm">
              {tr("Solde :")}{" "}
              <strong>{usd(missionFinance(draft.amount, draft.paid_amount).balance)}</strong> ·{" "}
              {tr(missionFinance(draft.amount, draft.paid_amount).status)}
            </p>
            <Field label={tr("Cahier des charges / consignes")}>
              <Textarea
                rows={6}
                maxLength={12000}
                value={draft.instructions}
                onChange={(e) => set("instructions", e.target.value)}
              />
            </Field>
            {error && (
              <p role="alert" className="text-destructive">
                {tr(error)}
              </p>
            )}
            <Button disabled={busy} type="submit">
              <Save />
              {tr(busy ? "Enregistrement…" : "Enregistrer l’ordre de mission")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!view}
        onOpenChange={(o) => {
          if (!o) setView(null);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogTitle>{tr("Ordre de mission officiel")}</DialogTitle>
          <DialogDescription>{view?.order_number}</DialogDescription>
          {view && (
            <>
              <div className="flex gap-3">
                <Button disabled={busy} onClick={() => void exportDoc(view)}>
                  <Download />
                  {tr("PDF")}
                </Button>
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => void exportDoc(view, true)}
                >
                  <Printer />
                  {tr("Imprimer")}
                </Button>
              </div>
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-4">
                  <img src="/images/forma-logo.jpeg" alt={tr("FORMA")} width="64" height="64" />
                  <div>
                    <h2 className="font-bold">{tr("ETS FORMA EVENT AND SECURITY")}</h2>
                    <p className="text-xs">{tr("RCCM CD/KNM/RCCM/25-A-10490")}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs">
                  {FORMA_ADDRESS}
                  <br />
                  {FORMA_PHONE} · {FORMA_EMAIL}
                </p>
                <pre className="mt-6 whitespace-pre-wrap break-words font-sans text-sm leading-7">
                  {missionMessage(view)}
                </pre>
                <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-4 text-sm">
                  <p>
                    {tr("Direction FORMA")}
                    <br />
                    {tr("Nom et signature :")}
                    <br />
                    <br />
                    ________________
                  </p>
                  <p>
                    {tr("Partenaire")}
                    <br />
                    {tr("Nom et signature :")}
                    <br />
                    <br />
                    ________________
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
