import { createFileRoute } from "@tanstack/react-router";
import { QuoteWizard } from "@/components/quote-wizard";
import { PageIntro } from "@/components/page-shell";

export const Route = createFileRoute("/devis")({
  head: () => ({ meta: [{ title: "Demander un devis — FORMA Event & Security" }, { name: "description", content: "Formulaire de demande de devis FORMA pour sécurité, événements, média, publicité, formation, facility ou solutions multiservices." }, { property: "og:title", content: "Demander un devis FORMA" }, { property: "og:description", content: "Précisez votre besoin et transmettez votre demande directement à FORMA." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "/devis" }] }),
  component: () => <><PageIntro eyebrow="Demande de devis" title="Structurez votre besoin en quelques étapes." text="Votre demande est préparée avec les informations utiles, puis transmise directement à FORMA via WhatsApp." /><section className="py-16 md:py-24"><div className="section-shell"><QuoteWizard /></div></section></>,
});