import { useLanguage } from "@/components/language-provider";
export function FormaSecurityPhotography() {
  const { t: tr } = useLanguage();
  return (
    <section className="border-y border-border bg-secondary/30 py-16 md:py-24">
      <div className="section-shell">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">{tr("FORMA Security · Sur le terrain")}</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            {tr("Présence humaine. Vigilance au quotidien.")}
          </h2>
        </div>
        <div className="grid items-start gap-8 md:grid-cols-[.8fr_1.2fr] md:gap-12">
          <figure className="group">
            <div className="overflow-hidden">
              <img
                src="/images/forma-equipe-cynophile.jpg"
                alt={tr(
                  "Agent FORMA en uniforme avec un chien de sécurité équipé d’un harnais FORMA",
                )}
                width="768"
                height="1152"
                loading="lazy"
                decoding="async"
                className="aspect-[2/3] w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]"
              />
            </div>
            <figcaption className="mt-4 border-t border-border pt-4 text-sm font-semibold">
              {tr("Équipe de terrain FORMA")}
            </figcaption>
          </figure>
          <figure className="group md:pt-16">
            <div className="overflow-hidden">
              <img
                src="/images/forma-videosurveillance.jpg"
                alt={tr("Caméra de vidéosurveillance installée sous un plafond éclairé")}
                width="1153"
                height="768"
                loading="lazy"
                decoding="async"
                className="aspect-[3/2] w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]"
              />
            </div>
            <figcaption className="mt-4 border-t border-border pt-4 text-sm font-semibold">
              {tr("Surveillance & vigilance des sites")}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
