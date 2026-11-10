import { useLanguage } from "@/components/language-provider";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Camera,
  Check,
  ClipboardCheck,
  GraduationCap,
  Handshake,
  Megaphone,
  MessageSquareCheck,
  Scale,
  Shield,
  Target,
  UserRoundCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const domains = [
  {
    icon: Shield,
    name: "FORMA SECURITY",
    to: "/securite" as const,
    description:
      "Un dispositif de sécurité adapté aux personnes, aux sites et aux activités, avec un encadrement opérationnel de proximité.",
    services: [
      "Gardiennage et surveillance",
      "Contrôle d’accès",
      "Sécurisation des événements",
      "Rondes et surveillance des installations",
      "Audit et diagnostic sécuritaire",
      "Encadrement et supervision des agents",
    ],
  },
  {
    icon: CalendarDays,
    name: "FORMA EVENTS",
    to: "/evenements" as const,
    description:
      "Une préparation structurée et une coordination attentive pour vos événements professionnels, institutionnels et privés.",
    services: [
      "Organisation événementielle",
      "Coordination logistique",
      "Gestion des accès et accueil",
      "Protocole et assistance événementielle",
    ],
  },
  {
    icon: Camera,
    name: "FORMA MEDIA & COVERAGE",
    to: "/media-publicite" as const,
    description:
      "Des images et des contenus conçus pour documenter vos événements et valoriser la communication de votre organisation.",
    services: [
      "Couverture photographique",
      "Production audiovisuelle",
      "Reportages événementiels",
      "Création de contenus",
    ],
  },
  {
    icon: Megaphone,
    name: "FORMA ADVERTISING",
    to: "/media-publicite" as const,
    description:
      "Un accompagnement de votre communication commerciale pour présenter vos offres et développer la visibilité de votre marque.",
    services: [
      "Communication commerciale",
      "Publicité",
      "Promotion de marques",
      "Accompagnement de la visibilité des entreprises",
    ],
  },
  {
    icon: GraduationCap,
    name: "FORMA TRAINING",
    to: "/formations" as const,
    description:
      "Des formations orientées vers la pratique, pour renforcer les compétences et les réflexes professionnels de vos équipes.",
    services: [
      "Formation professionnelle",
      "Sensibilisation à la sécurité",
      "Formation aux bonnes pratiques opérationnelles",
    ],
  },
  {
    icon: Building2,
    name: "FORMA FACILITY",
    to: "/facility" as const,
    description:
      "Un interlocuteur pour coordonner les expertises complémentaires et suivre les services nécessaires au fonctionnement de vos sites.",
    services: [
      "Facility Management",
      "Coordination des prestataires",
      "Gestion et suivi des services généraux",
      "Solutions multiservices pour les entreprises",
    ],
  },
];

const commitments = [
  {
    icon: UserRoundCheck,
    title: "Professionnalisme",
    text: "Apporter une réponse adaptée aux besoins de chaque client, avec une préparation attentive et des équipes encadrées.",
  },
  {
    icon: ClipboardCheck,
    title: "Qualité de service",
    text: "Assurer un suivi rigoureux des prestations et rechercher l’amélioration continue de nos méthodes et de nos interventions.",
  },
  {
    icon: Scale,
    title: "Responsabilité",
    text: "Respecter les obligations contractuelles, les règles applicables et les engagements pris auprès de nos clients.",
  },
  {
    icon: Zap,
    title: "Réactivité",
    text: "Favoriser une communication rapide et une prise en charge efficace des demandes, selon leur contexte et leur priorité.",
  },
  {
    icon: Handshake,
    title: "Transparence",
    text: "Privilégier des relations commerciales claires, des prestations définies et un suivi compréhensible.",
  },
  {
    icon: MessageSquareCheck,
    title: "Satisfaction client",
    text: "Évaluer les prestations, recueillir les observations et apporter des mesures correctives lorsque cela est nécessaire.",
  },
];

export function FormaIdentity({ detailed = false }: { detailed?: boolean }) {
  const { t } = useLanguage();
  return (
    <section
      className="border-b border-border py-16 md:py-24"
      aria-labelledby="forma-identity-title"
    >
      <div className="section-shell grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
        <div className="scroll-reveal">
          <p className="eyebrow">{t("Identité & vision")}</p>
          <h2
            id="forma-identity-title"
            className="mt-4 text-3xl font-bold leading-tight md:text-4xl"
          >
            {t("Qui sommes-nous ?")}
          </h2>
          <p className="mt-6 text-xl font-medium leading-8">FORMA Event & Security</p>
          <p className="mt-2 max-w-md leading-7 text-muted-foreground">
            Une entreprise de services intégrés, ancrée à Kinshasa et tournée vers les besoins des
            organisations en République démocratique du Congo.
          </p>
          {!detailed && (
            <Button asChild variant="outline" className="mt-7">
              <Link to="/a-propos">
                {t("Découvrir FORMA")} <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>
        <div className="space-y-6 text-base leading-7 text-muted-foreground">
          <p>
            FORMA réunit la sécurité, l’événementiel, la communication, la formation et les
            solutions multiservices dans une approche coordonnée. Nous accompagnons les entreprises,
            institutions, organisations, hôtels et organisateurs d’événements, ainsi que les
            particuliers, dans la préparation et le suivi de leurs prestations.
          </p>
          <p>
            Notre mission est de comprendre chaque besoin, de définir un dispositif adapté et d’en
            organiser la mise en œuvre avec rigueur. La sécurité constitue le cœur de notre offre ;
            les autres pôles apportent des expertises complémentaires sous un pilotage cohérent.
          </p>
          <div className="border-l-2 border-accent pl-5 font-medium text-foreground">
            Un interlocuteur contractuel unique : FORMA coordonne les prestations et assume les
            engagements de sécurité et de qualité convenus avec le client.
          </div>
          {detailed && (
            <p>
              Notre vision est de construire une entreprise multiservices de référence en RDC,
              reconnue pour sa discipline d’exécution et la clarté de ses relations commerciales.
              Nous souhaitons inscrire chaque collaboration dans la durée, en associant
              responsabilité, qualité de service et écoute du client.
            </p>
          )}
          <div className="grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
            <div>
              <Target className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="mt-3 font-bold text-foreground">Une réponse structurée</h3>
              <p className="mt-2 text-sm leading-6">
                Analyser, organiser, encadrer et rendre compte.
              </p>
            </div>
            <div>
              <Handshake className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="mt-3 font-bold text-foreground">Une relation durable</h3>
              <p className="mt-2 text-sm leading-6">
                Des engagements définis et un dialogue suivi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FormaDomains() {
  const { t } = useLanguage();
  return (
    <section className="py-16 md:py-24" aria-labelledby="forma-domains-title">
      <div className="section-shell">
        <div className="scroll-reveal max-w-3xl">
          <p className="eyebrow">{t("Nos expertises")}</p>
          <h2
            id="forma-domains-title"
            className="mt-4 text-3xl font-bold leading-tight md:text-4xl"
          >
            {t("Nos domaines d’intervention")}
          </h2>
          <p className="mt-5 leading-7 text-muted-foreground">
            Six pôles complémentaires, une même exigence de coordination et de suivi pour vos sites,
            vos équipes et vos événements.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {domains.map(({ icon: Icon, name, description, services, to }, index) => (
            <article
              key={name}
              className="service-card flex min-w-0 flex-col rounded-md border border-border bg-card p-6 md:p-7"
            >
              <div className="flex items-center justify-between border-b border-border pb-5">
                <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                <span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-bold leading-7">{name}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{t(description)}</p>
              <ul className="my-6 space-y-3 text-sm leading-6">
                {services.map((service) => (
                  <li key={t(service)} className="flex gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    <span>{t(service)}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant="outline"
                className="mt-auto h-auto min-h-11 w-full whitespace-normal py-3"
              >
                <Link to={to} aria-label={`Découvrir nos services — ${name}`}>
                  {t("Découvrir nos services")}{" "}
                  <ArrowRight className="shrink-0" aria-hidden="true" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FormaCommitments() {
  const { t } = useLanguage();
  return (
    <section
      className="border-y border-border bg-secondary/40 py-16 md:py-24"
      aria-labelledby="forma-commitments-title"
    >
      <div className="section-shell">
        <div className="scroll-reveal grid gap-5 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">{t("Notre exigence au quotidien")}</p>
            <h2 id="forma-commitments-title" className="mt-4 text-3xl font-bold md:text-4xl">
              {t("Nos engagements")}
            </h2>
          </div>
          <p className="max-w-xl leading-7 text-muted-foreground">
            La confiance se construit par des engagements clairs. Ils guident notre préparation,
            notre conduite des prestations et notre relation avec chaque client.
          </p>
        </div>
        <div className="mt-10 grid gap-x-8 md:grid-cols-2 lg:grid-cols-3">
          {commitments.map(({ icon: Icon, title, text }) => (
            <article key={t(title)} className="border-t border-border py-7">
              <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-bold">{t(title)}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{t(text)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
