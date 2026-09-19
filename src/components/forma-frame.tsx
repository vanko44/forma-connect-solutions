import { Link } from "@tanstack/react-router";
import { Menu, Phone, X, ArrowUpRight, Mail, MessageCircle, Moon, Sun, Users } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/forma-logo.jpeg.asset.json";
import { FORMA_EMAIL, FORMA_WHATSAPP } from "@/lib/forma-contact";

const nav = [
  ["Accueil", "/"], ["À propos", "/a-propos"], ["Sécurité", "/securite"],
  ["Événements", "/evenements"], ["Media & Publicité", "/media-publicite"],
  ["Formations", "/formations"], ["Facility", "/facility"], ["Solutions", "/solutions"], ["Contact", "/contact"],
] as const;

export function FormaFrame({ children }: { children: ReactNode }) {
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
  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-50 border-b border-border/60 bg-primary/95 text-primary-foreground backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center gap-5">
        <Link to="/" className="mr-auto flex items-center gap-3" aria-label="FORMA — Accueil">
          <img src={logo.url} alt="FORMA Event Services & Security" className="h-14 w-14 object-cover object-top" width="640" height="640" />
          <span className="hidden border-l border-primary-foreground/20 pl-3 text-[10px] font-semibold uppercase leading-4 text-primary-foreground/70 sm:block">Event Services<br />& Security</span>
        </Link>
        <nav className="hidden items-center gap-4 xl:flex" aria-label="Navigation principale">
          {nav.map(([label, to]) => <Link key={to} to={to} activeProps={{ className: "text-accent" }} className="text-xs font-semibold text-primary-foreground/75 transition-colors hover:text-primary-foreground">{label}</Link>)}
          <Link to="/rejoindre" activeProps={{ className: "text-accent" }} className="border-l border-primary-foreground/20 pl-5 text-xs font-semibold text-primary-foreground/55 transition-colors hover:text-primary-foreground">Prestataires</Link>
        </nav>
        <Button asChild variant="outline" className="hidden border-primary-foreground/25 bg-transparent px-3 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground 2xl:inline-flex"><Link to="/rejoindre"><Users /> Espace partenaire</Link></Button>
        <Button asChild className="hidden bg-accent text-accent-foreground hover:bg-accent/90 md:inline-flex"><Link to="/devis">Demander un devis</Link></Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={toggleTheme} aria-label={dark ? "Activer le thème clair" : "Activer le thème sombre"} title={dark ? "Thème clair" : "Thème sombre"}>{dark ? <Sun /> : <Moon />}</Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground xl:hidden" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">{open ? <X /> : <Menu />}</Button>
      </div>
      {open && <nav className="max-h-[80vh] overflow-y-auto border-t border-primary-foreground/10 bg-primary px-5 py-5 xl:hidden" aria-label="Navigation mobile">
        <div className="grid gap-1">{nav.map(([label, to]) => <Link key={to} to={to} onClick={() => setOpen(false)} className="border-b border-primary-foreground/10 py-3 text-sm font-medium">{label}</Link>)}</div>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground/45">Espace prestataires</p>
        <Link to="/rejoindre" onClick={() => setOpen(false)} className="mt-2 flex items-center gap-2 border-b border-primary-foreground/10 pb-3 text-sm font-medium"><Users className="h-4 w-4 text-accent" />Rejoindre le réseau · Connexion partenaire</Link>
        <div className="mt-5 grid gap-3 text-sm">
          <a href="tel:+243977528234" className="flex items-center gap-2 font-semibold"><Phone className="h-4 w-4 text-accent" />+243 977 528 234</a>
          <a href={`mailto:${FORMA_EMAIL}`} className="flex items-center gap-2 break-all font-semibold"><Mail className="h-4 w-4 shrink-0 text-accent" />{FORMA_EMAIL}</a>
        </div>
        <div className="mt-5 grid grid-cols-[auto_1fr] gap-2"><Button variant="outline" size="icon" className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={toggleTheme} aria-label={dark ? "Activer le thème clair" : "Activer le thème sombre"}>{dark ? <Sun /> : <Moon />}</Button><Button asChild className="w-full bg-accent text-accent-foreground"><Link to="/devis" onClick={() => setOpen(false)}>Demander un devis</Link></Button></div>
      </nav>}
    </header>
    <main>{children}</main>
    <footer className="bg-primary pb-24 text-primary-foreground md:pb-0">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div><img src={logo.url} alt="FORMA Event Services & Security" className="h-28 w-28 object-cover" width="640" height="640" /><p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/65">Sécurité, événements et solutions multiservices pour les particuliers, entreprises et organisations en RDC. FORMA est votre unique interlocuteur contractuel et garant de la qualité.</p></div>
        <div><p className="eyebrow">Contact direct</p><a href="tel:+243977528234" className="mt-4 block font-display text-xl font-bold">+243 977 528 234</a><a href={`mailto:${FORMA_EMAIL}`} className="mt-3 block break-all text-sm font-semibold text-primary-foreground/80 underline">{FORMA_EMAIL}</a><p className="mt-3 text-sm text-primary-foreground/65">144, av. Ngandu, Q/Mpasa I<br />C/Nsele, Kinshasa, RDC</p></div>
        <div><p className="eyebrow">Entreprise</p><div className="mt-4 grid gap-3 text-sm"><Link to="/a-propos">À propos</Link><Link to="/devis">Demander un devis (clients)</Link><Link to="/plateforme">Future plateforme <ArrowUpRight className="ml-1 inline h-3 w-3" /></Link><Link to="/mentions-legales">Mentions légales</Link><Link to="/contact">Contact</Link></div><p className="eyebrow mt-7">Espace prestataires</p><div className="mt-4 grid gap-3 text-sm"><Link to="/rejoindre">Rejoindre le réseau FORMA</Link><span className="text-xs leading-5 text-primary-foreground/50">Réservé aux artisans et techniciens partenaires.</span></div></div>
      </div>
      <div className="border-t border-primary-foreground/10"><div className="section-shell flex flex-col gap-2 py-5 text-[11px] text-primary-foreground/45 md:flex-row md:justify-between"><span>© 2026 ETS FORMA EVENT AND SECURITY</span><span>RCCM CD/KNM/RCCM/25-A-10490 — Kinshasa</span></div></div>
    </footer>
    <a href={FORMA_WHATSAPP} target="_blank" rel="noreferrer" aria-label="Contacter FORMA sur WhatsApp" className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-xs font-bold text-accent-foreground shadow-xl transition-transform hover:scale-105 md:left-auto md:right-5"><MessageCircle className="h-5 w-5" /> WhatsApp</a>
  </div>;
}
