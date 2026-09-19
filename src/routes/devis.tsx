import { createFileRoute } from "@tanstack/react-router";
import { QuoteWizard } from "@/components/quote-wizard";
import { PageIntro } from "@/components/page-shell";
import { FORMA_EMAIL } from "@/lib/forma-contact";

export const Route = createFileRoute("/devis")({
  head: () => ({ meta: [{ title: "Demander un devis — FORMA Event & Security" }, { name: "description", content: "Formulaire de demande de devis FORMA : sécurité, événements, média, publicité, formation, facility. Envoi par email à formaeventandsecurity@gmail.com ou WhatsApp." }, { property: "og:title", content: "Demander un devis FORMA" }, { property: "og:description", content: "Précisez votre besoin et transmettez votre demande directement à FORMA." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "/devis" }] }),
  component: Quote,
});

function Quote() {
  return <><PageIntro eyebrow="Demande de devis — clients" title="Structurez votre besoin en quelques étapes." text="Votre demande est préparée avec les informations utiles, puis transmise directement à FORMA par email ou WhatsApp." />
    <section className="py-16 md:py-24"><div className="section-shell">
      <p className="mx-auto mb-8 max-w-3xl text-sm text-muted-foreground">Contact direct : <a className="font-semibold text-foreground underline" href={`mailto:${FORMA_EMAIL}`}>{FORMA_EMAIL}</a> — <a className="font-semibold text-foreground underline" href="tel:+243977528234">+243 977 528 234</a></p>
      <QuoteWizard />
      <p className="mx-auto mt-8 max-w-3xl border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">Vous êtes artisan ou technicien et souhaitez travailler avec FORMA ? Passez plutôt par l’espace prestataires « Rejoindre le réseau ».</p>
    </div></section></>;
}
