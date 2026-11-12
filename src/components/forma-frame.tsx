import { Link } from "@tanstack/react-router";
import { Menu, Phone, X, ArrowUpRight, Mail, Moon, Sun, UserRound, Users, ChevronDown } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PageMotion } from "@/components/page-motion";
import { LanguageSelect, useLanguage } from "@/components/language-provider";
const whatsappIcon = { url: "/images/forma-whatsapp.png" };
const logo = { url: "/images/forma-logo.jpeg" };
import { FORMA_EMAIL, FORMA_WHATSAPP } from "@/lib/forma-contact";

const nav = [
  ["Accueil", "/"],
  ["À propos", "/a-propos"],
  ["Sécurité", "/securite"],
  ["Événements", "/evenements"],
  ["Media & Publicité", "/media-publicite"],
  ["Formations", "/formations"],
  ["Facility", "/facility"],
  ["Solutions", "/solutions"],
  ["Contact", "/contact"],
] as const;

export function FormaFrame({ children }: { children: ReactNode }) {
  const { t: tr } = useLanguage();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("forma-theme", next ? "dark" : "light");
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageMotion />
      <header className="sticky top-0 z-50 border-b border-border/60 bg-primary/95 text-primary-foreground backdrop-blur-xl">
        <div className="section-shell flex h-20 items-center gap-5">
          <Link
            to="/"
            className="mr-auto flex items-center gap-3"
            aria-label={tr("FORMA — Accueil")}
          >
            <img
              src={logo.url}
              alt={tr("FORMA Event Services & Security")}
              className="h-14 w-14 object-cover object-top"
              width="640"
              height="640"
            />
            <span className="hidden border-l border-primary-foreground/20 pl-3 text-[10px] font-semibold uppercase leading-4 text-primary-foreground/70 sm:block">
              {tr("Event Services")}
              <br />
              {tr("& Security")}
            </span>
          </Link>
          <nav
            className="hidden items-center gap-4 xl:flex"
            aria-label={tr("Navigation principale")}
          >
            {[nav[0], nav[1], nav[8]].map(([label, to]) => (
              <Button asChild variant="ghost" key={to} className="text-primary-foreground/75 hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to={to} activeProps={{ className: "text-accent" }}>{t(label)}</Link>
              </Button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-primary-foreground/75 hover:bg-primary-foreground/10 hover:text-primary-foreground">{t("Nos services")} <ChevronDown /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-56">
                {nav.slice(2, 8).map(([label, to]) => <DropdownMenuItem asChild key={to}><Link to={to}>{t(label)}</Link></DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden text-primary-foreground/75 hover:bg-primary-foreground/10 hover:text-primary-foreground xl:inline-flex"><UserRound /> {t("Mes espaces")} <ChevronDown /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-60">
              <DropdownMenuItem asChild><Link to="/portal">{t("Ouvrir mon espace")}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/connexion-client">{t("Espace Client")}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/provider/dashboard">{t("Espace Prestataire")}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/rejoindre">{t("Rejoindre le réseau FORMA")}</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            asChild
            className="hidden bg-accent text-accent-foreground hover:bg-accent/90 md:inline-flex"
          >
            <Link to="/devis">{t("Demander un devis")}</Link>
          </Button>
          <LanguageSelect />
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            onClick={toggleTheme}
            aria-label={dark ? "Activer le thème clair" : "Activer le thème sombre"}
            title={dark ? "Thème clair" : "Thème sombre"}
          >
            {dark ? <Sun /> : <Moon />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground xl:hidden"
            onClick={() => setOpen(!open)}
            aria-label={tr("Ouvrir le menu")}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
        {open && (
          <nav
            className="max-h-[80vh] overflow-y-auto border-t border-primary-foreground/10 bg-primary px-5 py-5 xl:hidden"
            aria-label={tr("Navigation mobile")}
          >
            <div className="grid gap-1">
              {[nav[0], nav[1], nav[8]].map(([label, to]) => (
                <Button asChild variant="ghost" className="justify-start text-primary-foreground" key={to}><Link to={to} onClick={() => setOpen(false)}>{t(label)}</Link></Button>
              ))}
              <details className="border-y border-primary-foreground/10 py-3">
                <summary className="cursor-pointer text-sm font-semibold">{t("Nos services")}</summary>
                <div className="mt-3 grid gap-1 pl-3">{nav.slice(2, 8).map(([label, to]) => <Button asChild variant="ghost" className="justify-start text-primary-foreground" key={to}><Link to={to} onClick={() => setOpen(false)}>{t(label)}</Link></Button>)}</div>
              </details>
            </div>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground/45">
              {tr("Espace clients — demandeurs de services")}
            </p>
            <Link
              to="/connexion-client"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center gap-2 border-b border-primary-foreground/10 pb-3 text-sm font-medium"
            >
              <UserRound className="h-4 w-4 text-accent" />
              {tr("Se connecter · Compte client gratuit")}
            </Link>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground/45">
              {tr("Réseau de partenaires professionnels")}
            </p>
            <Link
              to="/rejoindre"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center gap-2 border-b border-primary-foreground/10 pb-3 text-sm font-medium"
            >
              <Users className="h-4 w-4 text-accent" />
              {tr("Candidater · Découvrir l’espace partenaire")}
            </Link>
            <div className="mt-5 grid gap-3 text-sm">
              <a href="tel:+243977528234" className="flex items-center gap-2 font-semibold">
                <Phone className="h-4 w-4 text-accent" />
                +243 977 528 234
              </a>
              <a
                href={`mailto:${FORMA_EMAIL}`}
                className="flex items-center gap-2 break-all font-semibold"
              >
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                {FORMA_EMAIL}
              </a>
            </div>
            <div className="mt-5 grid grid-cols-[auto_1fr] gap-2">
              <Button
                variant="outline"
                size="icon"
                className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                onClick={toggleTheme}
                aria-label={dark ? "Activer le thème clair" : "Activer le thème sombre"}
              >
                {dark ? <Sun /> : <Moon />}
              </Button>
              <Button asChild className="w-full bg-accent text-accent-foreground">
                <Link to="/devis" onClick={() => setOpen(false)}>
                  {t("Demander un devis")}
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="bg-primary pb-24 text-primary-foreground md:pb-0">
        <div className="section-shell grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <img
              src={logo.url}
              alt={tr("FORMA Event Services & Security")}
              className="h-28 w-28 object-cover"
              width="640"
              height="640"
            />
            <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/65">
              {tr(
                "Sécurité, événements et solutions multiservices pour les particuliers, entreprises et organisations en RDC. FORMA est votre unique interlocuteur contractuel et garant de la qualité.",
              )}
            </p>
          </div>
          <div>
            <p className="eyebrow">{tr("Contact direct")}</p>
            <a href="tel:+243977528234" className="mt-4 block font-display text-xl font-bold">
              +243 977 528 234
            </a>
            <a
              href={`mailto:${FORMA_EMAIL}`}
              className="mt-3 block break-all text-sm font-semibold text-primary-foreground/80 underline"
            >
              {FORMA_EMAIL}
            </a>
            <p className="mt-3 text-sm text-primary-foreground/65">
              {tr("144, av. Ngandu, Q/Mpasa I")}
              <br />
              {tr("C/Nsele, Kinshasa, RDC")}
            </p>
          </div>
          <div>
            <p className="eyebrow">{tr("Entreprise")}</p>
            <div className="mt-4 grid gap-3 text-sm">
              <Link to="/a-propos">{tr("À propos")}</Link>
              <Link to="/devis">{tr("Demander un devis (clients)")}</Link>
              <Link to="/plateforme">
                {t("Portails professionnels")} <ArrowUpRight className="ml-1 inline h-3 w-3" />
              </Link>
              <Link to="/admin">{t("Espace Direction")}</Link>
              <Link to="/mentions-legales">{tr("Mentions légales")}</Link>
              <Link to="/contact">{tr("Contact")}</Link>
            </div>
            <p className="eyebrow mt-7">{tr("Espace Client")}</p>
            <div className="mt-4 grid gap-3 text-sm">
              <Link to="/connexion-client">{tr("Se connecter · Créer un compte gratuit")}</Link>
              <span className="text-xs leading-5 text-primary-foreground/50">
                {tr("Pour les particuliers et organisations qui commandent des prestations.")}
              </span>
            </div>
            <p className="eyebrow mt-7">{tr("Réseau de partenaires")}</p>
            <div className="mt-4 grid gap-3 text-sm">
              <Link to="/rejoindre">{tr("Rejoindre le réseau professionnel FORMA")}</Link>
              <span className="text-xs leading-5 text-primary-foreground/50">
                {tr(
                  "Artisans, indépendants, PME et entreprises spécialisées, sous coordination FORMA.",
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10">
          <div className="section-shell flex flex-col gap-2 py-5 text-[11px] text-primary-foreground/45 md:flex-row md:justify-between">
            <span>{tr("© 2026 ETS FORMA EVENT AND SECURITY")}</span>
            <span>{tr("RCCM CD/KNM/RCCM/25-A-10490 — Kinshasa")}</span>
          </div>
        </div>
      </footer>
      <a
        href={FORMA_WHATSAPP}
        target="_blank"
        rel="noreferrer"
        aria-label={tr("Contacter FORMA sur WhatsApp")}
        title={tr("WhatsApp")}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-40 flex h-11 w-11 items-center justify-center shadow-soft transition-transform motion-safe:hover:scale-105 md:left-auto md:right-5"
      >
        <img
          src={whatsappIcon.url}
          alt=""
          width="44"
          height="44"
          className="h-11 w-11 object-contain"
        />
      </a>
    </div>
  );
}
