import { useState } from "react";
import { CheckCircle2, Eye, Pencil, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormaOfferDocument, printOffer } from "@/components/forma-offer-document";
import { APPROVED_STATUS, defaultOffer, offerTotals, SERVICE_GROUPS, usd, type Offer } from "@/lib/forma-offer";
import { supabase } from "@/integrations/supabase/client";

type Q = { id: string; name: string; organization: string | null; needs: string; pole: string; offer?: unknown };

export function FormaOfferEditor({ quote, onDone }: { quote: Q; onDone: (patch: Record<string, unknown>) => void }) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [offer, setOffer] = useState<Offer>(() => (quote.offer as Offer) ?? defaultOffer(quote));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const t = offerTotals(offer);
  const setLine = (i: number, k: "qty" | "price", v: string) => setOffer((o) => ({ ...o, lines: o.lines.map((l, j) => j === i ? { ...l, [k]: Math.max(0, Number(v) || 0) } : l) }));
  const toggle = (s: string) => setOffer((o) => ({ ...o, services: o.services.includes(s) ? o.services.filter((x) => x !== s) : [...o.services, s] }));

  const approve = async () => {
    if (offer.signatory.trim().length < 2) { setError("Indiquez le responsable FORMA signataire."); return; }
    if (t.subtotal <= 0) { setError("Ajoutez au moins une ligne chiffrée."); return; }
    setBusy(true); setError("");
    const patch = { offer: offer as unknown as never, status: APPROVED_STATUS, approved_at: new Date().toISOString(), amount: usd(t.total) };
    const { error } = await supabase.from("quote_requests").update(patch).eq("id", quote.id);
    setBusy(false);
    if (error) { setError("L'approbation a échoué. Réessayez."); return; }
    onDone(patch); setPreview(true);
  };

  return <>
    <Button size="sm" variant="outline" onClick={() => setOpen(true)}><Pencil /> Éditer & Approuver</Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto p-0">
        <DialogHeader className="border-b border-border p-5"><DialogTitle>Offre officielle — {quote.organization || quote.name}</DialogTitle>
          <div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant={preview ? "outline" : "default"} onClick={() => setPreview(false)}><Pencil /> Édition</Button><Button size="sm" variant={preview ? "default" : "outline"} onClick={() => setPreview(true)}><Eye /> Aperçu</Button>{preview && <Button size="sm" variant="outline" onClick={printOffer}><Printer /> Imprimer / PDF</Button>}</div>
        </DialogHeader>
        {preview ? <FormaOfferDocument offer={offer} /> : <div className="grid gap-6 p-5">
          <p className="border-l-2 border-accent pl-3 text-sm text-muted-foreground"><b className="text-foreground">Besoin client ({quote.pole}) :</b> {quote.needs}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <L t="Organisation cliente"><Input maxLength={140} value={offer.clientName} onChange={(e) => setOffer({ ...offer, clientName: e.target.value })} /></L>
            <L t="Date de l'offre"><Input type="date" value={offer.date} onChange={(e) => setOffer({ ...offer, date: e.target.value })} /></L>
            <L t="Responsable FORMA signataire *"><Input maxLength={100} value={offer.signatory} onChange={(e) => setOffer({ ...offer, signatory: e.target.value })} /></L>
            <L t="Fonction"><Input maxLength={100} value={offer.signatoryRole} onChange={(e) => setOffer({ ...offer, signatoryRole: e.target.value })} /></L>
          </div>
          <div><p className="text-xs font-bold uppercase text-muted-foreground">Prestations retenues</p><div className="mt-3 grid gap-4 sm:grid-cols-2">{SERVICE_GROUPS.map((g) => <div key={g.title}><p className="text-sm font-bold">{g.title}</p>{g.items.map((i) => <label key={i} className="mt-2 flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 accent-[var(--accent)]" checked={offer.services.includes(i)} onChange={() => toggle(i)} />{i}</label>)}</div>)}</div></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr><th className="p-2">Prestation</th><th className="p-2">Tarif unitaire (USD)</th><th className="p-2">Quantité / effectif</th><th className="p-2 text-right">Montant</th></tr></thead><tbody>{offer.lines.map((l, i) => <tr key={l.label} className="border-t border-border"><td className="p-2">{l.label}<p className="text-xs text-muted-foreground">{l.unit}</p></td><td className="p-2"><Input type="number" min={0} className="h-8 w-24" value={l.price} onChange={(e) => setLine(i, "price", e.target.value)} /></td><td className="p-2"><Input type="number" min={0} className="h-8 w-24" value={l.qty} onChange={(e) => setLine(i, "qty", e.target.value)} /></td><td className="p-2 text-right">{usd(l.price * l.qty)}</td></tr>)}</tbody></table></div>
          <div className="grid gap-4 sm:grid-cols-[200px_1fr]"><L t="Remise (%)"><Input type="number" min={0} max={100} value={offer.discountPct} onChange={(e) => setOffer({ ...offer, discountPct: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })} /></L><div className="self-end text-right text-sm">Sous-total {usd(t.subtotal)} · Remise {usd(t.discount)} · <b className="text-base">Total HT {usd(t.total)}</b></div></div>
          <L t="Notes et conditions particulières"><Textarea maxLength={2000} className="min-h-24" value={offer.notes} onChange={(e) => setOffer({ ...offer, notes: e.target.value })} placeholder="Durée d'engagement, équipement inclus, modalités de paiement…" /></L>
          {error && <p className="border-l-2 border-destructive pl-3 text-sm text-destructive">{error}</p>}
          <Button disabled={busy} onClick={() => void approve()} className="h-11 bg-accent text-accent-foreground hover:bg-accent/90"><CheckCircle2 /> {busy ? "Publication…" : "Approuver & Publier l'offre"}</Button>
        </div>}
      </DialogContent>
    </Dialog>
  </>;
}
function L({ t, children }: { t: string; children: React.ReactNode }) { return <label className="block text-xs font-bold uppercase text-muted-foreground">{t}<div className="mt-2 normal-case">{children}</div></label>; }
