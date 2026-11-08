import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, PageIntro } from "@/components/page-shell";
import { FormaIdentity, FormaCommitments } from "@/components/forma-institutional";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://forma-connect-solutions.lovable.app/a-propos" },
      { title: "À propos — FORMA Event & Security" },
      {
        name: "description",
        content:
           "Découvrez l’identité, la mission et les engagements de FORMA : sécurité et services intégrés pour les organisations en RDC.",
      },
      { property: "og:title", content: "À propos de FORMA" },
      {
        property: "og:description",
        content:
          "Une entreprise congolaise de services guidée par la rigueur, la sécurité et la responsabilité.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://forma-connect-solutions.lovable.app/a-propos" }],
  }),
  component: About,
});
function About() {
  return (
    <>
      <PageIntro
        eyebrow="Notre entreprise"
        title="FORMA Event & Security"
        text="Sécurité et services intégrés : une approche professionnelle pour accompagner les organisations et les particuliers en République démocratique du Congo."
      />
      <FormaIdentity detailed />
      <FormaCommitments />
      <section className="py-12 md:py-16">
        <div className="section-shell grid gap-5 md:grid-cols-2">
          <h2 className="text-2xl font-bold">Notre charte éthique</h2>
          <p className="leading-7 text-muted-foreground">Respect des personnes, confidentialité, transparence commerciale et stricte conformité aux obligations légales : ces principes encadrent notre manière de travailler et nos relations avec les clients et partenaires.</p>
        </div>
      </section>
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="section-shell grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Conformité légale</p>
            <h2 className="mt-3 text-3xl font-bold">Une existence administrative vérifiable.</h2>
            <p className="mt-5 leading-7 text-primary-foreground/60">
              Aucune certification commerciale n’est revendiquée. Les références ci-contre
              correspondent aux documents officiels d’enregistrement de l’établissement.
            </p>
          </div>
          <dl className="divide-y divide-primary-foreground/15 border-y border-primary-foreground/15 text-sm">
            <Row k="Raison sociale" v="ETS FORMA EVENT AND SECURITY" />
            <Row k="RCCM" v="CD/KNM/RCCM/25-A-10490" />
            <Row k="Identification Nationale" v="Ministère de l’Économie Nationale" />
            <Row k="Enregistrements" v="INPP · ONEM" />
            <Row k="Siège" v="144, av. Ngandu, Q/Mpasa I, C/Nsele, Kinshasa" />
            <Row k="Téléphone / WhatsApp" v="+243 977 528 234" />
            <Row k="Email officiel" v="formaeventandsecurity@gmail.com" />
          </dl>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid gap-2 py-4 sm:grid-cols-[180px_1fr]">
      <dt className="text-primary-foreground/45">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  );
}
