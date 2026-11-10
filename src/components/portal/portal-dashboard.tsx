import { useState, type FormEvent } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRouter } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PortalLayout } from "./portal-layout";
import { RecordEditor } from "./record-editor";
import { ClientQuotes } from "@/components/client-quotes";
import { FormaAdminDashboard } from "@/components/forma-admin-dashboard";
import {
  getPortal,
  actOnMission,
  documentUrl,
  saveProfile,
  manageAccount,
} from "@/lib/portal/portal.functions";
import {
  labels,
  money,
  date,
  settlement,
  attributes,
  missionActions,
  portalAllowed,
  canAccessSection,
  type PortalRecord,
  type Environment,
  type PortalProfile,
} from "@/lib/portal/model";
export const portalQuery = (environment:Environment)=>queryOptions({ queryKey: ["portal",environment], queryFn: () => getPortal({data:{environment}}), staleTime:30_000 });
export function PortalDashboard({ environment }: { environment: Environment }) {
  const { data, refetch } = useSuspenseQuery(portalQuery(environment));
  const [section, setSection] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState<{ kind: string; record: PortalRecord | null } | null>(null);
  const [detail, setDetail] = useState<PortalRecord | null>(null);
  const [error, setError] = useState("");
  const act = useServerFn(actOnMission);
  const download = useServerFn(documentUrl);
  const allowed = portalAllowed(environment,data.admin,data.roles);
  const refresh = async () => {
    await refetch();
  };
  const canEdit = (kind: string) =>
    data.admin ||
    (data.roles.includes("finance") && ["invoice", "payment"].includes(kind)) ||
    (data.roles.includes("operations") && ["mission", "service", "report"].includes(kind)) ||
    (data.roles.includes("customer") && ["contract", "complaint", "notification"].includes(kind));
  const notifications = data.records.filter(
    (r) => r.kind === "notification" && r.status === "nouvelle",
  );
  const invoices = data.records.filter((r) => r.kind === "invoice" && r.status === "émise");
  const missions = data.records.filter((r) => r.kind === "mission");
  const outstanding = invoices.reduce((s, r) => s + settlement(r, data.records).balance, 0);
  const providerDue = missions.reduce((s, r) => s + settlement(r, data.records).balance, 0);
  const stats =
    environment === "client"
      ? [
          [
            "Contrats actifs",
            data.records.filter((r) => r.kind === "contract" && r.status === "actif").length,
            FileText,
          ],
          [
            "Prestations en cours",
            data.records.filter((r) => r.kind === "service" && r.status === "en cours").length,
            BriefcaseBusiness,
          ],
          [
            "Demandes en attente",
            data.records.filter((r) => r.kind === "complaint" && r.status !== "clôturée").length,
            Clock3,
          ],
          [
            "Factures impayées",
            invoices.filter((r) => settlement(r, data.records).balance > 0).length,
            ShieldCheck,
          ],
        ]
      : environment === "provider"
        ? [
            ["À accepter", missions.filter((r) => r.status === "attribuée").length, Clock3],
            [
              "Missions en cours",
              missions.filter((r) => r.status === "en cours").length,
              BriefcaseBusiness,
            ],
            ["Terminées", missions.filter((r) => r.status === "terminée").length, CheckCircle2],
            [
              "En validation",
              missions.filter((r) => r.status === "en attente de validation").length,
              FileText,
            ],
          ]
        : [
            [
              "Contrats actifs",
              data.records.filter((r) => r.kind === "contract" && r.status === "actif").length,
              FileText,
            ],
            [
              "Opérations en cours",
              data.records.filter(
                (r) => ["service", "mission"].includes(r.kind) && r.status === "en cours",
              ).length,
              BriefcaseBusiness,
            ],
            [
              "Réclamations ouvertes",
              data.records.filter((r) => r.kind === "complaint" && r.status !== "clôturée").length,
              Clock3,
            ],
            [
              "Rapports à valider",
              data.records.filter((r) => r.kind === "report" && r.status === "soumis").length,
              ShieldCheck,
            ],
          ];
  const rows = data.records
    .filter((r) =>
      section === "dashboard"
        ? true
        : section === "available"
          ? r.kind === "mission" && r.status === "attribuée"
          : section === "history"
            ? r.kind === "mission" && ["terminée", "refusée"].includes(r.status)
            : section === "payment"
              ? ["payment", "mission"].includes(r.kind)
              : section === "invoice"
                ? ["invoice", "payment"].includes(r.kind)
                : r.kind === section,
    )
    .filter((r) =>
      `${r.title} ${r.reference} ${r.status}`.toLowerCase().includes(search.toLowerCase()),
    );
  const sectionTitle =
    section === "dashboard"
      ? "Vue d’ensemble"
      : section === "available"
        ? "Missions à accepter"
        : section === "history"
          ? "Historique"
          : section === "accounts"
            ? "Clients & prestataires"
            : section === "audit"
              ? "Journal d’activité"
              : section === "profile"
                ? "Mon profil"
                : section === "legacy"
                  ? "Pilotage opérationnel"
                  : section === "quotes"
                    ? "Devis & offres officielles"
                    : (labels[section] ?? "Mon espace");
  async function missionAction(r: PortalRecord, action: string) {
    setError("");
    try {
      await act({ data: { id: r.id, action: action as "accept" | "refuse" | "start" | "finish" } });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action impossible.");
    }
  }
  async function getDocument(id: string) {
    try {
      const { url } = await download({ data: { id } });
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Document indisponible.");
    }
  }
  return (
    <PortalLayout
      environment={environment}
      admin={data.admin}
      roles={data.roles}
      name={data.profile?.display_name || data.profile?.company || "Mon compte"}
      section={section}
      onSection={(s) => {
        setSection(s);
        setSearch("");
      }}
      notifications={notifications.length}
    >
      {!allowed ? (
        <div role="alert" className="border border-destructive p-6">
          <h1 className="text-xl font-bold">Accès non autorisé</h1>
          <p className="mt-2 text-sm">Votre compte ne dispose pas des droits pour cet espace.</p>
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-accent">
                {environment === "admin"
                  ? "Direction & contrôle interne"
                  : environment === "provider"
                    ? "Opérations partenaires"
                    : "Relation client"}
              </p>
              <h1 className="text-2xl font-bold md:text-3xl">
                {section === "dashboard"
                  ? `Bonjour${data.profile?.display_name ? ", " + data.profile.display_name : ""}.`
                  : sectionTitle}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {section === "dashboard"
                  ? "Votre activité FORMA, en un regard."
                  : data.profile?.company || "FORMA Event & Security"}
              </p>
            </div>
            {environment === "client" && (
              <Button
                onClick={() => {
                  setSection("complaint");
                  setEditor({ kind: "complaint", record: null });
                }}
              >
                <Plus />
                Nouvelle réclamation
              </Button>
            )}
            {canEdit(section) && labels[section] && (
              <Button onClick={() => setEditor({ kind: section, record: null })}>
                <Plus />
                Créer un dossier
              </Button>
            )}
          </div>
          {error && (
            <p role="alert" className="mb-5 text-sm text-destructive">
              {error}
            </p>
          )}
          {section === "dashboard" && (
            <>
              <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(([label, value, Icon]) => {
                  const I = Icon as typeof FileText;
                  return (
                    <article
                      className="rounded-md border border-border bg-card p-5 shadow-soft"
                      key={String(label)}
                    >
                      <div className="flex justify-between">
                        <p className="text-xs font-medium text-muted-foreground">{String(label)}</p>
                        <I className="h-4 w-4 text-accent" />
                      </div>
                      <p className="mt-5 text-3xl font-bold">{String(value)}</p>
                    </article>
                  );
                })}
              </div>
              <div className="mb-8 grid gap-8 xl:grid-cols-[1.5fr_1fr]">
                <section className="min-w-0">
                  <div className="mb-5 flex justify-between">
                    <h2 className="font-bold">Activité des six derniers mois</h2>
                    <span className="text-xs text-muted-foreground">Dossiers enregistrés</span>
                  </div>
                  <ActivityChart records={data.records} />
                </section>
                <section className="border-l border-border pl-6">
                  {(environment !== 'admin' || canAccessSection(data.admin,data.roles,'invoice')) && <>
                  <h2 className="font-bold">Situation financière</h2>
                  <p className="mt-5 text-3xl font-bold">
                    {money(environment === "provider" ? providerDue : outstanding)}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {environment === "provider"
                      ? "Montants restant à régler sur les missions"
                      : "Solde des factures émises"}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-5"
                    onClick={() => setSection(environment === "provider" ? "payment" : "invoice")}
                  >
                    Consulter les règlements
                    <ArrowUpRight />
                  </Button>
                  </>}
                  <h3 className="mt-6 text-sm font-semibold">Notifications importantes</h3>
                  {notifications.length ? (
                    notifications.slice(0, 2).map((n) => (
                      <p className="mt-2 text-sm text-muted-foreground" key={n.id}>
                        {n.title}
                      </p>
                    ))
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Aucune nouvelle notification.
                    </p>
                  )}
                </section>
              </div>
            </>
          )}
          {section === "quotes" ? (
            <ClientQuotes userId={data.userId} />
          ) : section === "legacy" ? (
            data.admin ? (
              <FormaAdminDashboard />
            ) : (
              <p>Ce module est réservé à la direction.</p>
            )
          ) : section === "profile" ? (
            <ProfileForm profile={data.profile} refresh={refresh} />
          ) : section === "accounts" ? (
            data.admin ? (
              <Accounts people={data.people} refresh={refresh} />
            ) : (
              <p>Gestion des comptes réservée à la direction.</p>
            )
          ) : section === "audit" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="p-3">Date</th>
                    <th>Action</th>
                    <th>Auteur</th>
                  </tr>
                </thead>
                <tbody>
                  {data.audit.map((a) => (
                    <tr className="border-b border-border" key={a.id}>
                      <td className="p-3">{date(a.created_at)}</td>
                      <td>{a.action}</td>
                      <td>
                        {data.people.find((p) => p.id === a.actor_id)?.display_name ||
                          a.actor_id?.slice(0, 8) ||
                          "Système"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-bold">
                  {section === "dashboard" ? "Dernières activités" : sectionTitle}
                </h2>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    aria-label="Rechercher les dossiers"
                    className="pl-10"
                    placeholder="Rechercher une référence, un dossier…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              {!rows.length ? (
                <div className="rounded-md border border-dashed border-border py-14 text-center">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <h3 className="mt-4 font-semibold">Aucun dossier pour le moment</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Les dossiers attribués à votre compte apparaîtront ici.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md border border-border bg-card">
                  <table className="w-full min-w-[650px] text-sm">
                    <thead className="bg-secondary/50 text-left text-xs text-muted-foreground">
                      <tr>
                        <th className="px-5 py-4">Référence / dossier</th>
                        <th className="px-4">Statut</th>
                        <th className="px-4">Dates</th>
                        <th className="px-4">Montant / solde</th>
                        <th className="px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.slice(0, section === "dashboard" ? 8 : rows.length).map((r) => {
                        const finance = settlement(r, data.records);
                        return (
                          <tr className="border-t border-border" key={r.id}>
                            <td className="px-5 py-4">
                              <p className="text-xs text-muted-foreground">{r.reference}</p>
                              <p className="mt-1 font-semibold">{r.title}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{labels[r.kind]}</p>
                            </td>
                            <td className="px-4">
                              <span
                                className={`inline-flex rounded-sm px-2 py-1 text-xs ${["validé", "actif", "terminée"].includes(r.status) ? "bg-success/10 text-success" : "bg-secondary text-secondary-foreground"}`}
                              >
                                {r.kind === "invoice" &&
                                r.status === "émise" &&
                                finance.balance === 0
                                  ? "Soldée"
                                  : r.status}
                              </span>
                            </td>
                            <td className="px-4 text-xs text-muted-foreground">
                              {date(r.start_date || r.created_at)}
                              {r.end_date && <p className="mt-1">au {date(r.end_date)}</p>}
                              {r.due_date && <p className="mt-1">Échéance : {date(r.due_date)}</p>}
                            </td>
                            <td className="px-4">
                              {["invoice", "mission", "payment"].includes(r.kind) ? (
                                <>
                                  <p className="font-semibold">{money(r.amount)}</p>
                                  {r.kind !== "payment" && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      Solde : {money(finance.balance)}
                                    </p>
                                  )}
                                </>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-4">
                              <div className="flex flex-wrap justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => setDetail(r)}>
                                  Consulter
                                </Button>
                                {canEdit(r.kind) &&
                                  !(r.kind === "payment" && r.status === "validé") && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditor({ kind: r.kind, record: r })}
                                    >
                                      Modifier
                                    </Button>
                                  )}
                                {environment === "provider" &&
                                  r.kind === "mission" &&
                                  missionActions(r.status).map((action) => (
                                    <Button
                                      size="sm"
                                      key={action}
                                      onClick={() => void missionAction(r, action)}
                                    >
                                      {
                                        {
                                          accept: "Accepter",
                                          refuse: "Refuser",
                                          start: "Démarrer",
                                          finish: "Terminer",
                                        }[action]
                                      }
                                    </Button>
                                  ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {environment === "provider" && section === "report" && (
                <Button
                  className="mt-5"
                  onClick={() => setEditor({ kind: "report", record: null })}
                >
                  <Plus />
                  Transmettre un rapport
                </Button>
              )}
              {canEdit("payment") && section === "invoice" && (
                <Button
                  className="mt-5"
                  onClick={() => setEditor({ kind: "payment", record: null })}
                >
                  <Plus />
                  Enregistrer un règlement
                </Button>
              )}
            </section>
          )}
          {editor && (
            <RecordEditor
              {...editor}
              records={data.records}
              people={data.people}
              environment={environment}
              onClose={() => setEditor(null)}
              onSaved={refresh}
            />
          )}
          {detail && (
            <Dialog open onOpenChange={() => setDetail(null)}>
              <DialogContent className="portal-theme max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{detail.title}</DialogTitle>
                </DialogHeader>
                <p className="text-xs text-muted-foreground">
                  {detail.reference} · {detail.status}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <p className="text-sm">Début : {date(detail.start_date)}</p>
                  <p className="text-sm">Fin : {date(detail.end_date)}</p>
                  {Object.entries(attributes(detail))
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div className="break-words" key={k}>
                        <p className="text-xs font-bold uppercase text-muted-foreground">
                          {(
                            {
                              description: "Description",
                              site: "Site",
                              supervisor: "Responsable de suivi",
                              team: "Équipe affectée",
                              instructions: "Consignes autorisées",
                              hours: "Horaires",
                              response: "Réponse FORMA",
                              validation: "Validation FORMA",
                              incident: "Incident",
                              difficulties: "Difficultés",
                              proof: "Référence de règlement",
                            } as Record<string, string>
                          )[k] ?? k}
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm">{v}</p>
                      </div>
                    ))}
                </div>
                {["invoice", "mission"].includes(detail.kind) && (
                  <p className="border-t border-border pt-4 text-sm">
                    Montant : {money(detail.amount)} · Règlements validés :{" "}
                    {money(settlement(detail, data.records).paid)} · Solde :{" "}
                    {money(settlement(detail, data.records).balance)}
                  </p>
                )}
                <h3 className="mt-3 font-semibold">Documents</h3>
                {data.documents
                  .filter((d) => d.record_id === detail.id)
                  .map((d) => (
                    <Button
                      key={d.id}
                      variant="outline"
                      className="justify-start"
                      onClick={() => void getDocument(d.id)}
                    >
                      <Download />
                      {d.name}
                    </Button>
                  ))}
                {!data.documents.some((d) => d.record_id === detail.id) && (
                  <p className="text-sm text-muted-foreground">Aucun document joint.</p>
                )}
                {["contract", "invoice"].includes(detail.kind) && (
                  <Button
                    variant="outline"
                    onClick={() => void downloadRecordPdf(detail, data.people.find(p=>p.id===detail.owner_id) ?? null, data.records)}
                  >
                    <Download />
                    Télécharger la fiche PDF
                  </Button>
                )}
                <h3 className="mt-3 font-semibold">Dossiers associés</h3>
                {data.records
                  .filter((r) => r.parent_id === detail.id)
                  .map((r) => (
                    <Button
                      variant="ghost"
                      className="justify-start"
                      key={r.id}
                      onClick={() => setDetail(r)}
                    >
                      {r.title} · {r.status}
                    </Button>
                  ))}
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </PortalLayout>
  );
}
function ActivityChart({ records }: { records: PortalRecord[] }) {
  const now = new Date();
  const months = Array.from(
    { length: 6 },
    (_, i) => new Date(now.getFullYear(), now.getMonth() - 5 + i, 1),
  );
  const values = months.map(
    (m) =>
      records.filter(
        (r) =>
          new Date(r.created_at).getMonth() === m.getMonth() &&
          new Date(r.created_at).getFullYear() === m.getFullYear(),
      ).length,
  );
  const max = Math.max(1, ...values);
  return (
    <svg
      viewBox="0 0 600 180"
      className="h-44 w-full text-primary"
      role="img"
      aria-label={`Activité mensuelle : ${values.join(", ")} dossiers`}
    >
      <line x1="20" y1="140" x2="590" y2="140" stroke="currentColor" opacity="0.15" />
      {months.map((m, i) => (
        <g key={i}>
          <rect
            x={40 + i * 92}
            y={140 - ((values[i] ?? 0) / max) * 100}
            width="38"
            height={((values[i] ?? 0) / max) * 100}
            rx="3"
            fill="currentColor"
            opacity="0.8"
          />
          <text x={59 + i * 92} y="165" textAnchor="middle" fill="currentColor" fontSize="12">
            {m.toLocaleDateString("fr", { month: "short" })}
          </text>
          <text
            x={59 + i * 92}
            y={130 - ((values[i] ?? 0) / max) * 100}
            textAnchor="middle"
            fill="currentColor"
            fontSize="12"
          >
            {values[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}
function ProfileForm({
  profile,
  refresh,
}: {
  profile: PortalProfile | null;
  refresh: () => Promise<void>;
}) {
  const save = useServerFn(saveProfile);
  const [message, setMessage] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      await save({
        data: {
          display_name: String(f.get("display_name")),
          company: String(f.get("company")),
          phone: String(f.get("phone")),
          avatar_url: profile?.avatar_url ?? "",
        },
      });
      await refresh();
      setMessage("Profil enregistré.");
    } catch {
      setMessage("Impossible d’enregistrer votre profil.");
    }
  }
  return (
    <form onSubmit={submit} className="grid max-w-lg gap-5">
      {[
        ["display_name", "Nom complet"],
        ["company", "Entreprise / organisation"],
        ["phone", "Téléphone"],
      ].map(([key, label]) => (
        <label key={key} className="grid gap-2 text-sm font-semibold">
          {label}
          <Input
            name={key}
            required={key === "display_name"}
            defaultValue={profile?.[key as "display_name"] ?? ""}
          />
        </label>
      ))}
      <Button>Enregistrer mon profil</Button>
      {message && (
        <p role="status" className="text-sm">
          {message}
        </p>
      )}
    </form>
  );
}
function Accounts({ people, refresh }: { people: PortalProfile[]; refresh: () => Promise<void> }) {
  const manage = useServerFn(manageAccount);
  const [person, setPerson] = useState<PortalProfile | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const f = new FormData(e.currentTarget);
    try {
      await manage({
        data: {
          ...(person ? { id: person.id } : { email: String(f.get("email")) }),
          display_name: String(f.get("display_name")),
          company: String(f.get("company")),
          phone: String(f.get("phone")),
          role: String(f.get("role")) as
            "client" | "provider" | "operations" | "finance" | "customer",
        },
      });
      await refresh();
      setMessage(person ? "Compte mis à jour." : "Invitation envoyée.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Action impossible.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="grid gap-8 xl:grid-cols-2">
      <div>
        <h2 className="mb-4 font-bold">Comptes enregistrés</h2>
        {people.map((p) => (
          <div key={p.id} className="flex justify-between gap-3 border-b border-border py-4">
            <div>
              <p className="font-semibold">{p.display_name || "Profil à compléter"}</p>
              <p className="text-sm text-muted-foreground">
                {p.company} · {p.phone}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setPerson(p)}>
              Gérer
            </Button>
          </div>
        ))}
      </div>
      <form onSubmit={submit} key={person?.id ?? "new"} className="grid content-start gap-4">
        <h2 className="font-bold">{person ? "Modifier le compte" : "Inviter un utilisateur"}</h2>
        {!person && (
          <label className="grid gap-2 text-sm">
            Email
            <Input type="email" name="email" required />
          </label>
        )}
        {[
          ["display_name", "Nom complet"],
          ["company", "Entreprise"],
          ["phone", "Téléphone"],
        ].map(([key, label]) => (
          <label key={key} className="grid gap-2 text-sm">
            {label}
            <Input
              name={key}
              required={key === "display_name"}
              defaultValue={person?.[key as "display_name"] ?? ""}
            />
          </label>
        ))}
        <label className="grid gap-2 text-sm">
          Niveau d’accès
          <select name="role" className="h-10 rounded-md border border-input bg-background px-3">
            <option value="client">Client</option>
            <option value="provider">Prestataire</option>
            <option value="operations">Responsable des opérations</option>
            <option value="finance">Responsable financier</option>
            <option value="customer">Gestionnaire clientèle</option>
          </select>
        </label>
        <Button disabled={busy}>
          {busy ? "Enregistrement…" : person ? "Enregistrer les droits" : "Envoyer l’invitation"}
        </Button>
        {person && (
          <Button variant="ghost" type="button" onClick={() => setPerson(null)}>
            Nouvelle invitation
          </Button>
        )}
        {message && (
          <p role="status" className="text-sm">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
async function downloadRecordPdf(
  record: PortalRecord,
  profile: PortalProfile | null,
  records: PortalRecord[],
) {
  const { PDFDocument, StandardFonts } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  let page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  let y = 780;
  const safe = (s: string) => s.replace(/[^\x20-\x7E\xA0-\xFF]/g, " ");
  const lines = [
    "FORMA EVENT & SECURITY",
    record.kind === "invoice" ? "FICHE FACTURE" : "FICHE CONTRAT",
    record.reference,
    record.title,
    `Client : ${profile?.display_name || profile?.company || ""}`,
    `Statut : ${record.status}`,
    `Début : ${date(record.start_date)} - Fin : ${date(record.end_date)}`,
    `Échéance : ${date(record.due_date)}`,
    `Montant : ${money(record.amount)}`,
    `Règlements validés : ${money(settlement(record, records).paid)}`,
    `Solde : ${money(settlement(record, records).balance)}`,
    attributes(record)["description"] ?? "",
    "Les documents signés joints au dossier font foi.",
  ];
  for (const line of lines) {
    for (const chunk of safe(line).match(/.{1,85}/g) ?? [""]) {
      if (y < 60) {
        page = pdf.addPage([595, 842]);
        y = 780;
      }
      page.drawText(chunk, { x: 45, y, size: 11, font });
      y -= 20;
    }
    y -= 8;
  }
  const bytes = await pdf.save();
  const blob = new Blob([new Uint8Array(bytes).buffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${record.reference}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
