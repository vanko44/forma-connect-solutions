import { useLanguage } from "@/components/language-provider";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  const { t } = useLanguage();
  return (
    <section className="bg-primary py-20 text-primary-foreground md:py-28">
      <div className="section-shell reveal">
        <p className="eyebrow">{t(eyebrow)}</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.08] md:text-6xl">
          {t(title)}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-primary-foreground/65 md:text-lg">
          {t(text)}
        </p>
      </div>
    </section>
  );
}

export function CtaBand() {
  const { t } = useLanguage();
  return (
    <section className="bg-accent py-14 text-accent-foreground">
      <div className="section-shell flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase">{t("Parlons de votre besoin")}</p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">
            {t("Une réponse claire, adaptée à votre réalité.")}
          </h2>
        </div>
        <Button
          asChild
          className="h-12 bg-primary px-6 text-primary-foreground hover:bg-primary/90"
        >
          <Link to="/devis">
            {t("Demander un devis")} <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
