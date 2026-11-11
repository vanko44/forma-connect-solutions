import { useLanguage } from "@/components/language-provider";
import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, PageIntro } from "@/components/page-shell";
import { CheckCircle2 } from "lucide-react";
import { FormaDomains } from "@/components/forma-institutional";
export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://forma-connect-solutions.lovable.app/solutions" },
      { title: "Solutions multiservices — FORMA Event & Security" },
      {
        name: "description",
        content:
          "Un dispositif sur mesure combinant sécurité, événementiel, média, publicité, formation et facility management.",
      },
      { property: "og:title", content: "Solutions multiservices FORMA" },
      {
        property: "og:description",
        content: "Un interlocuteur pour coordonner plusieurs expertises en RDC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://forma-connect-solutions.lovable.app/solutions" }],
  }),
  component: () => {
    const { t: tr } = useLanguage();
    return (
      <>
        <PageIntro
          eyebrow={tr("Solutions intégrées")}
          title={tr("Les services intégrés FORMA")}
          text="FORMA construit un dispositif combiné et cohérent autour d’un responsable de coordination unique, pour répondre aux besoins des organisations en RDC."
        />
        <FormaDomains />
        <section className="border-t border-border py-16 md:py-24">
          <div className="section-shell grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="eyebrow">{tr("Un pilotage commun")}</p>
              <h2 className="mt-4 text-3xl font-bold">
                {tr("Une coordination rigoureuse, du besoin au reporting.")}
              </h2>
              <p className="mt-5 leading-7 text-muted-foreground">
                {tr(
                  "Les prestations retenues s’articulent dans un dispositif défini avec vous, suivi par FORMA et adapté à votre organisation.",
                )}
              </p>
            </div>
            <ul className="grid content-start gap-5 sm:grid-cols-2">
              {[
                "Diagnostic initial",
                "Sécurité du site",
                "Accueil & protocole",
                "Production média",
                "Communication digitale",
                "Services opérationnels",
                "Reporting consolidé",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-border pb-5 text-sm font-medium"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <CtaBand />
      </>
    );
  },
});
