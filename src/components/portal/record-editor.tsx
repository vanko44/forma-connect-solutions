import { useLanguage } from "@/components/language-provider";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveRecord } from "@/lib/portal/portal.functions";
import { supabase } from "@/integrations/supabase/client";
import {
  attributes,
  statuses,
  labels,
  parentKinds,
  reportableMission,
  type PortalRecord,
  type PortalProfile,
  type Environment,
} from "@/lib/portal/model";
export function RecordEditor({
  kind,
  record,
  records,
  people,
  accountRoles,
  environment,
  onClose,
  onSaved,
}: {
  kind: string;
  record: PortalRecord | null;
  records: PortalRecord[];
  people: PortalProfile[];
  accountRoles: { user_id: string; role: string }[];
  environment: Environment;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const { t: tr } = useLanguage();
  const save = useServerFn(saveRecord);
  const a = record ? attributes(record) : {};
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const text = (k: string) => String(f.get(k) ?? "");
    const parent = records.find((r) => r.id === text("parent_id"));
    try {
      const row = await save({
        data: {
          ...(record ? { id: record.id } : {}),
          kind: kind as PortalRecord["kind"],
          title: text("title"),
          status: text("status") || (kind === "report" ? "soumis" : "nouvelle"),
          owner_id: parent?.owner_id ?? (text("owner_id") || null),
          provider_id: ["report", "payment"].includes(kind) ? parent?.provider_id ?? null : text("provider_id") || null,
          parent_id: text("parent_id") || null,
          start_date: text("start_date") || null,
          end_date: text("end_date") || null,
          due_date: text("due_date") || null,
          amount: Number(text("amount") || 0),
          attributes: Object.fromEntries(
            [
              "description",
              "site",
              "team",
              "supervisor",
              "instructions",
              "hours",
              "response",
              "incident",
              "difficulties",
              "validation",
              "proof",
            ].map((k) => [k, text(k)]),
          ),
        },
      });
      if (!row) throw new Error("Enregistrement indisponible.");
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024)
          throw new Error("Fichier trop volumineux (10 Mo maximum).");
        const path = `${row.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const u = await supabase.storage.from("portal-documents").upload(path, file);
        if (u.error) throw new Error("Dossier enregistré, mais pièce jointe non envoyée.");
        const d = await supabase
          .from("portal_documents")
          .insert({ record_id: row.id, name: file.name, storage_path: path });
        if (d.error) throw new Error("Dossier enregistré, mais pièce jointe non rattachée.");
      }
      await onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Enregistrement impossible.");
    } finally {
      setBusy(false);
    }
  }
  const staff = environment === "admin" || environment === "staff";
  const field = (key: string, label: string, type = "text") => (
    <label className="grid gap-2 text-xs font-semibold" key={key}>
      {tr(label ?? "")}
      <Input name={key} type={type} defaultValue={record?.[key as "start_date"] ?? ""} />
    </label>
  );
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="portal-theme max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {tr(record ? "Modifier" : "Nouveau dossier")} · {tr(labels[kind] ?? kind)}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-5">
          <fieldset disabled={busy} className="grid gap-5">
            <label className="grid gap-2 text-xs font-semibold">
              {tr("Objet")}
              <Input
                name="title"
                required
                minLength={2}
                maxLength={200}
                defaultValue={record?.title ?? ""}
              />
            </label>
            {staff && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-xs font-semibold">
                  {tr("Client")}
                  <select
                    name="owner_id"
                    defaultValue={record?.owner_id ?? ""}
                    className="h-10 rounded-md border border-input bg-background px-3"
                  >
                    <option value="">{tr("Sans client")}</option>
                    {people.filter((p) => accountRoles.some((r) => r.user_id === p.id && r.role === "client")).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.display_name || p.company || p.id.slice(0, 8)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-xs font-semibold">
                  {tr("Prestataire")}
                  <select
                    name="provider_id"
                    defaultValue={record?.provider_id ?? ""}
                    className="h-10 rounded-md border border-input bg-background px-3"
                  >
                    <option value="">{tr("Sans prestataire")}</option>
                    {people.filter((p) => accountRoles.some((r) => r.user_id === p.id && r.role === "provider")).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.display_name || p.company || p.id.slice(0, 8)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-xs font-semibold">
                  {tr("Statut")}
                  <select
                    name="status"
                    defaultValue={record?.status ?? statuses[kind]?.[0]}
                    className="h-10 rounded-md border border-input bg-background px-3"
                  >
                    {statuses[kind]?.map((s) => (
                      <option key={s} value={s}>
                        {tr(s)}
                      </option>
                    ))}
                  </select>
                </label>
                {["invoice", "mission", "payment"].includes(kind) && (
                  <label className="grid gap-2 text-xs font-semibold">
                    {tr("Montant convenu (USD)")}
                    <Input
                      name="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      defaultValue={record?.amount ?? 0}
                    />
                  </label>
                )}
              </div>
            )}
            {["report", "payment", "service", "mission"].includes(kind) && (
              <label className="grid gap-2 text-xs font-semibold">
                {tr(kind === "report" ? "Mission" : "Dossier associé")}
                <select
                  name="parent_id"
                  required={["report", "payment", "mission"].includes(kind)}
                  defaultValue={record?.parent_id ?? ""}
                  className="h-10 rounded-md border border-input bg-background px-3"
                >
                  <option value="">{tr("Choisir")}</option>
                  {records
                    .filter((r) => parentKinds(kind).includes(r.kind) && (kind !== "report" || staff || reportableMission(r)))
                    .map((r) => (
                      <option value={r.id} key={r.id}>
                        {r.reference} · {r.title}
                      </option>
                    ))}
                </select>
              </label>
            )}
            {staff && (
              <div className="grid gap-4 sm:grid-cols-3">
                {field("start_date", "Date de début", "date")}
                {field("end_date", "Date de fin", "date")}
                {field("due_date", "Échéance", "date")}
              </div>
            )}
            <label className="grid gap-2 text-xs font-semibold">
              {tr("Description")}
              <Textarea
                name="description"
                required={!staff}
                maxLength={6000}
                defaultValue={a["description"] ?? ""}
              />
            </label>
            {staff && ["service", "mission"].includes(kind) && (
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["site", "Site / lieu"],
                  ["supervisor", "Responsable de suivi"],
                  ["team", "Équipe (désignation autorisée)"],
                  ["hours", "Horaires"],
                ].filter(([key]) => kind === "mission" || key !== "team").map(([key, label]) => (
                  <label className="grid gap-2 text-xs font-semibold" key={key}>
                    {tr(label ?? "")}
                    <Input name={key} defaultValue={a[key ?? ""] ?? ""} />
                  </label>
                ))}
                {kind === "mission" && <label className="grid gap-2 text-xs font-semibold sm:col-span-2">
                  {tr("Consignes autorisées")}
                  <Textarea name="instructions" defaultValue={a["instructions"] ?? ""} />
                </label>}
              </div>
            )}
            {kind === "report" && (
              <>
                <label className="grid gap-2 text-xs font-semibold">
                  {tr("Incident signalé")}
                  <Textarea name="incident" defaultValue={a["incident"] ?? ""} />
                </label>
                <label className="grid gap-2 text-xs font-semibold">
                  {tr("Difficultés rencontrées")}
                  <Textarea name="difficulties" defaultValue={a["difficulties"] ?? ""} />
                </label>
                {staff && (
                  <label className="grid gap-2 text-xs font-semibold">
                    {tr("Réponse de validation")}
                    <Textarea name="validation" defaultValue={a["validation"] ?? ""} />
                  </label>
                )}
              </>
            )}
            {staff && kind === "complaint" && (
              <label className="grid gap-2 text-xs font-semibold">
                {tr("Réponse FORMA")}
                <Textarea name="response" defaultValue={a["response"] ?? ""} />
              </label>
            )}
            {staff && kind === "payment" && (
              <label className="grid gap-2 text-xs font-semibold">
                {tr("Référence de règlement / preuve")}
                <Input name="proof" required defaultValue={a["proof"] ?? ""} />
              </label>
            )}
            <label className="grid gap-2 text-xs font-semibold">
              {tr("Pièces justificatives (PDF, photos · 10 Mo par fichier)")}
              <Input
                type="file"
                multiple
                accept="application/pdf,image/jpeg,image/png"
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {tr(error)}
              </p>
            )}
            <Button type="submit">
              {tr(
                busy
                  ? "Enregistrement…"
                  : record
                    ? "Enregistrer les modifications"
                    : "Créer et enregistrer",
              )}
            </Button>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
