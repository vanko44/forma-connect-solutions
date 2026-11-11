import { ArrowRight, Bell, CalendarDays, ClipboardCheck, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { FORMA_EMAIL, FORMA_PHONE, FORMA_WHATSAPP } from "@/lib/forma-contact";
import { date, labels, money, type Environment, type PortalRecord } from "@/lib/portal/model";

export function PortalOverview({ records, environment, financial, onOpen, onSection }: {
  records: PortalRecord[];
  environment: Environment;
  financial: boolean;
  onOpen: (record: PortalRecord) => void;
  onSection: (section: string) => void;
}) {
  const { t, language } = useLanguage();
  const priorities = records.filter((r) => environment === "provider"
    ? r.kind === "mission" && ["attribuée", "acceptée", "en cours"].includes(r.status)
    : environment === "client"
      ? (r.kind === "complaint" && r.status !== "clôturée") || (r.kind === "notification" && r.status === "nouvelle")
      : (r.kind === "report" && r.status === "soumis") || (r.kind === "complaint" && r.status !== "clôturée") || (r.kind === "payment" && r.status === "en attente"));
  const recent = [...records].sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, 5);
  const months = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setDate(1);
    month.setMonth(month.getMonth() - 5 + i);
    const inMonth = (r: PortalRecord) => {
      const created = new Date(r.created_at);
      return created.getMonth() === month.getMonth() && created.getFullYear() === month.getFullYear();
    };
    return {
      label: month.toLocaleDateString(language, { month: "short" }),
      invoices: records.filter((r) => r.kind === "invoice" && r.status === "émise" && inMonth(r)).reduce((sum, r) => sum + Number(r.amount), 0),
      payments: records.filter((r) => r.kind === "payment" && r.status === "validé" && inMonth(r)).reduce((sum, r) => sum + Number(r.amount), 0),
    };
  });
  const max = Math.max(1, ...months.flatMap((m) => [m.invoices, m.payments]));
  const priorityTitle = environment === "provider" ? "Vos prochaines actions" : environment === "client" ? "Suivi de vos demandes" : "À traiter en priorité";
  return (
    <div className="mb-8 space-y-8">
      <div className="grid gap-8 xl:grid-cols-[1.2fr_1fr]">
        <section className="min-w-0">
          <div className="mb-4 flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-accent" /><h2 className="font-bold">{t(priorityTitle)}</h2><span className="ml-auto text-sm text-muted-foreground">{priorities.length}</span></div>
          {priorities.length ? priorities.slice(0, 5).map((r) => (
            <Button key={r.id} variant="ghost" className="h-auto min-h-20 w-full justify-between gap-4 rounded-none border-t border-border px-0 py-4 text-left" onClick={() => onOpen(r)}>
              <span className="min-w-0"><span className="block whitespace-normal font-semibold">{r.title}</span><span className="mt-1 block whitespace-normal text-xs font-normal text-muted-foreground">{t(labels[r.kind] ?? r.kind)} · {t(r.status)}{r.due_date ? ` · ${date(r.due_date)}` : ""}</span></span><ArrowRight className="h-4 w-4 shrink-0" />
            </Button>
          )) : <p className="border-t border-border py-6 text-sm text-muted-foreground">{t("Aucune action en attente.")}</p>}
        </section>
        <section className="min-w-0">
          <div className="mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-accent" /><h2 className="font-bold">{t("Activité récente")}</h2></div>
          {recent.length ? recent.map((r) => (
            <div key={r.id} className="flex gap-3 border-t border-border py-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
              <div className="min-w-0 flex-1"><Button variant="link" className="h-auto max-w-full justify-start whitespace-normal p-0 text-left text-foreground" onClick={() => onOpen(r)}>{r.title}</Button><p className="mt-1 text-xs text-muted-foreground">{t(r.status)} · {date(r.updated_at)}</p></div>
            </div>
          )) : <p className="border-t border-border py-6 text-sm text-muted-foreground">{t("Aucun dossier pour le moment")}</p>}
        </section>
      </div>
      {financial && environment !== "provider" && <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="font-bold">{t("Factures & paiements validés")}</h2><div className="flex flex-wrap gap-4 text-xs"><span className="flex items-center gap-2"><span className="h-2 w-2 bg-primary" />{t("Factures émises")}</span><span className="flex items-center gap-2"><span className="h-2 w-2 bg-success" />{t("Paiements validés")}</span></div></div>
        <div className="overflow-x-auto border-y border-border py-4">
          <div className="grid min-w-[480px] grid-cols-6 gap-5" role="img" aria-label={t("Factures & paiements validés")}>
            {months.map((m) => <div key={m.label} className="min-w-0 text-center">
              <div className="relative flex h-32 items-end justify-center gap-2 border-b border-border"><svg viewBox="0 0 80 128" className="h-32 w-20" aria-hidden="true"><rect x="14" y={128 - m.invoices / max * 120} width="22" height={m.invoices / max * 120} rx="2" className="fill-primary" /><rect x="42" y={128 - m.payments / max * 120} width="22" height={m.payments / max * 120} rx="2" className="fill-success" /></svg></div>
              <p className="mt-3 text-xs font-semibold">{m.label}</p><p className="mt-1 text-[10px] text-muted-foreground">{money(m.invoices)}</p><p className="text-[10px] text-success">{money(m.payments)}</p>
            </div>)}
          </div>
        </div>
      </section>}
      {environment !== "admin" && environment !== "staff" && <section className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-5">
        <div className="flex items-center gap-3"><LifeBuoy className="h-5 w-5 text-accent" /><div><h2 className="font-bold">{t("Votre contact FORMA")}</h2><a href={`tel:${FORMA_PHONE.replaceAll(" ", "")}`} className="text-sm text-muted-foreground">{FORMA_PHONE}</a></div></div>
        <div className="flex flex-wrap gap-2"><Button asChild variant="outline"><a href={`mailto:${FORMA_EMAIL}`}>{t("Email")}</a></Button><Button asChild variant="outline"><a href={FORMA_WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a></Button><Button variant="ghost" onClick={() => onSection(environment === "client" ? "complaint" : "mission")}><CalendarDays className="h-4 w-4" />{t(environment === "client" ? "Réclamations" : "Mes missions")}</Button></div>
      </section>}
    </div>
  );
}