import { useLanguage } from "@/components/language-provider";
import { useEffect, useState } from "react";
import { Clock, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormaOfferDocument } from "@/components/forma-offer-document";
import { APPROVED_STATUS, type Offer } from "@/lib/forma-offer";
import { supabase } from "@/integrations/supabase/client";

import { FormaOfferDownloads } from "@/components/forma-offer-downloads";

type Row = {
  id: string;
  created_at: string;
  pole: string;
  place: string;
  status: string;
  offer: unknown;
  amount: string | null;
};

export function ClientQuotes({ userId }: { userId: string }) {
  const { t: tr } = useLanguage();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [open, setOpen] = useState<Offer | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    setRows(null);
    setError(false);
    void supabase
      .from("portal_quotes")
      .select("id, created_at, pole, place, status, offer, amount")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setError(Boolean(error));
        setRows((data as Row[]) ?? []);
      });
  }, [userId]);
  if (error)
    return (
      <p role="alert" className="text-sm text-destructive">
        {tr("Impossible de charger vos devis. Réessayez en rouvrant cet onglet.")}
      </p>
    );
  if (!rows)
    return <p className="text-sm text-muted-foreground">{tr("Chargement de vos devis…")}</p>;
  if (!rows.length)
    return (
      <p className="border border-dashed border-border p-6 text-sm text-muted-foreground">
        {tr(
          "Aucune demande de devis liée à votre compte. Les demandes envoyées en étant connecté apparaissent ici.",
        )}
      </p>
    );
  return (
    <>
      <div className="divide-y divide-border border border-border bg-card">
        {rows.map((r) => {
          const ready = r.status === APPROVED_STATUS && !!r.offer;
          return (
            <div
              key={r.id}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-bold">
                  {tr(r.pole)} — {r.place}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tr("Demande du")}
                  {new Date(r.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              {ready ? (
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-sm font-semibold text-accent">
                    <FileCheck2 className="h-4 w-4" /> {tr("Offre officielle disponible")}
                    {r.amount ? ` · ${r.amount}` : ""}
                  </span>
                  <Button size="sm" onClick={() => setOpen(r.offer as Offer)}>
                    {tr("Consulter l’offre")}
                  </Button>
                </div>
              ) : (
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> {tr("En cours d’étude par la direction FORMA")}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="offer-dialog max-h-[92vh] max-w-5xl overflow-y-auto p-0">
          <DialogHeader className="gap-3 border-b border-border p-5 pr-12">
            <DialogTitle>{tr("Offre officielle FORMA")}</DialogTitle>
            {open && <FormaOfferDownloads offer={open} />}
          </DialogHeader>
          {open && <FormaOfferDocument offer={open} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
