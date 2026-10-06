import { useEffect, useState } from "react";
import { Clock, FileCheck2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormaOfferDocument, printOffer } from "@/components/forma-offer-document";
import { APPROVED_STATUS, type Offer } from "@/lib/forma-offer";
import { supabase } from "@/integrations/supabase/client";

type Row = { id: string; created_at: string; pole: string; place: string; status: string; offer: unknown; amount: string | null };

export function ClientQuotes({ userId }: { userId: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [open, setOpen] = useState<Offer | null>(null);
  useEffect(() => {
    void supabase.from("quote_requests").select("id, created_at, pole, place, status, offer, amount").eq("user_id", userId).order("created_at", { ascending: false }).then(({ data }) => setRows((data as Row[]) ?? []));
  }, [userId]);
  if (!rows) return <p className="text-sm text-muted-foreground">Chargement de vos devis…</p>;
  if (!rows.length) return <p className="border border-dashed border-border p-6 text-sm text-muted-foreground">Aucune demande de devis liée à votre compte. Les demandes envoyées en étant connecté apparaissent ici.</p>;
  return <>
    <div className="divide-y divide-border border border-border bg-card">{rows.map((r) => {
      const ready = r.status === APPROVED_STATUS && !!r.offer;
      return <div key={r.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-bold">{r.pole} — {r.place}</p><p className="text-xs text-muted-foreground">Demande du {new Date(r.created_at).toLocaleDateString("fr-FR")}</p></div>
        {ready ? <div className="flex items-center gap-3"><span className="flex items-center gap-1 text-sm font-semibold text-accent"><FileCheck2 className="h-4 w-4" /> Offre officielle disponible{r.amount ? ` · ${r.amount}` : ""}</span><Button size="sm" onClick={() => setOpen(r.offer as Offer)}>Consulter l’offre</Button></div>
          : <span className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> En cours d’étude par la direction FORMA</span>}
      </div>;
    })}</div>
    <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto p-0">
        <DialogHeader className="flex-row items-center justify-between gap-3 border-b border-border p-5"><DialogTitle>Offre officielle FORMA</DialogTitle><Button size="sm" variant="outline" className="mr-8" onClick={printOffer}><Printer /> Télécharger / Imprimer (PDF)</Button></DialogHeader>
        {open && <FormaOfferDocument offer={open} />}
      </DialogContent>
    </Dialog>
  </>;
}
