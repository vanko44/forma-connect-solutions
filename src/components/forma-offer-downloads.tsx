import { useState } from "react";
import { Download, Presentation, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Offer } from "@/lib/forma-offer";
export function FormaOfferDownloads({ offer }: { offer: Offer }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const run = async (format: "pdf" | "pptx") => {
    setBusy(true);
    setError("");
    try {
      const { downloadOffer } = await import("@/lib/forma-offer-export");
      await downloadOffer(offer, format);
    } catch {
      setError("Le téléchargement a échoué. Réessayez ou téléchargez le modèle original.");
    } finally {
      setBusy(false);
    }
  };
  const print = () => {
    setError("");
    document.body.classList.add("printing-offer");
    const cleanup = () => document.body.classList.remove("printing-offer");
    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline" disabled={busy} onClick={() => void run("pdf")}>
        <Download /> PDF
      </Button>
      <Button size="sm" variant="outline" disabled={busy} onClick={() => void run("pptx")}>
        <Presentation /> PowerPoint
      </Button>
      <Button size="sm" variant="outline" disabled={busy} onClick={() => void print()}>
        <Printer /> Imprimer
      </Button>
      <a
        href="/documents/forma-offre-originale.pdf"
        download
        className="text-xs text-muted-foreground underline underline-offset-4"
      >
        Modèle PDF original
      </a>
      {busy && (
        <span role="status" className="text-xs text-muted-foreground">
          Préparation du fichier…
        </span>
      )}
      {error && (
        <p role="alert" className="w-full text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
