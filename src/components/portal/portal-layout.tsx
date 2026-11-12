import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  FileText,
  BriefcaseBusiness,
  Receipt,
  MessageSquare,
  Bell,
  UserRound,
  Users,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  ClipboardCheck,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LanguageSelect, useLanguage } from "@/components/language-provider";
import { canAccessSection, type Environment } from "@/lib/portal/model";
export const sections = {
  client: [
    ["dashboard", "Vue d’ensemble"],
    ["contract", "Mes contrats"],
    ["service", "Mes prestations"],
    ["quotes", "Devis & offres"],
    ["complaint", "Réclamations"],
    ["invoice", "Factures & règlements"],
    ["notification", "Notifications"],
    ["profile", "Mon profil"],
  ],
  provider: [
    ["dashboard", "Vue d’ensemble"],
    ["mission", "Mes missions"],
    ["available", "À accepter"],
    ["report", "Rapports d’intervention"],
    ["history", "Historique"],
    ["payment", "Paiements"],
    ["notification", "Notifications"],
    ["profile", "Mon profil"],
  ],
  admin: [
    ["dashboard", "Vue exécutive"],
    ["accounts", "Clients & prestataires"],
    ["contract", "Contrats"],
    ["service", "Prestations"],
    ["mission", "Missions"],
    ["invoice", "Suivi financier"],
    ["complaint", "Réclamations"],
    ["report", "Rapports opérationnels"],
    ["legacy", "Pilotage existant"],
    ["audit", "Journal d’activité"],
    ["profile", "Mon profil"],
  ],
};
const icons: Record<string, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  contract: FileText,
  service: BriefcaseBusiness,
  quotes: FileText,
  complaint: MessageSquare,
  invoice: Receipt,
  notification: Bell,
  profile: UserRound,
  mission: BriefcaseBusiness,
  available: ClipboardCheck,
  report: FileText,
  history: ClipboardCheck,
  payment: Receipt,
  accounts: Users,
  legacy: ShieldCheck,
  audit: ClipboardCheck,
};
export function PortalLayout({
  environment,
  name,
  section,
  onSection,
  notifications,
  children,
  admin = false,
  roles = [],
}: {
  environment: Environment;
  name: string;
  section: string;
  onSection: (s: string) => void;
  notifications: number;
  children: ReactNode;
  admin?: boolean;
  roles?: string[];
}) {
  const { t: tr } = useLanguage();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const menuGroups = environment === "provider"
    ? [{ label: "Missions", keys: ["mission", "available", "report", "history"] }, { label: "Finances & documents", keys: ["payment", "documents"] }]
    : environment === "client"
      ? [{ label: "Mes prestations", keys: ["quotes", "contract", "service", "complaint"] }, { label: "Finances & documents", keys: ["invoice", "documents"] }]
      : [{ label: "Relation client", keys: ["accounts", "contract", "complaint"] }, { label: "Opérations", keys: ["service", "mission", "report", "legacy"] }, { label: "Finances & documents", keys: ["invoice", "documents"] }, { label: "Contrôle", keys: ["audit"] }];
  const entries = [...sections[environment === "staff" ? "admin" : environment], ["documents", "Mes documents"]].filter(([key]) => key === "documents" || !["admin", "staff"].includes(environment) || canAccessSection(admin, roles, key ?? ""));
  const renderEntry = ([key, label]: string[]) => {
    if (!key) return null;
    const Icon = icons[key] ?? FileText;
    return <Button key={key} title={t(label ?? key)} aria-label={t(label ?? key)} aria-current={section === key ? "page" : undefined} variant="ghost" onClick={() => { onSection(key); setOpen(false); }} className={`h-11 w-full justify-start gap-3 text-sm ${section === key ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}><Icon className="h-4 w-4 shrink-0" /><span className={collapsed ? "lg:hidden" : ""}>{t(label ?? key)}</span></Button>;
  };
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggleTheme = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("forma-theme", next ? "dark" : "light");
    setDark(next);
  };
  const query = useQueryClient();
  const navigate = useNavigate();
  const title = t(
    environment === "client"
      ? "Portail Client"
      : environment === "provider"
        ? "Portail Prestataire"
        : environment === "staff"
          ? "Espace collaborateurs"
          : "Espace Direction",
  );
  async function signOut() {
    await query.cancelQueries();
    query.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/connexion-client", replace: true });
  }
  return (
    <div
      className={`portal-theme portal-${environment} min-h-screen bg-background text-foreground`}
    >
      <aside
        className={`${open ? "flex" : "hidden"} fixed inset-y-0 left-0 z-40 ${collapsed ? "lg:w-16" : "lg:w-64"} w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex`}
      >
        <div className="flex h-24 items-center gap-3 border-b border-sidebar-border px-3">
          <img
            src="/images/forma-logo.jpeg"
            alt={tr("FORMA")}
            className="h-11 w-11 rounded-sm object-cover"
          />
          <div className={collapsed ? "lg:hidden" : ""}>
            <p className="font-bold">{tr("FORMA")}</p>
            <p className="text-xs text-sidebar-foreground/65">{title}</p>
          </div>
          <Button
            className="ml-auto lg:hidden"
            size="icon"
            variant="ghost"
            aria-label={tr("Fermer le menu")}
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
        </div>
        <p
          className={`px-3 pb-3 pt-7 text-[10px] font-semibold uppercase text-sidebar-foreground/50 ${collapsed ? "lg:hidden" : ""}`}
        >
          {t("Votre espace de gestion")}
        </p>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {entries.filter(([key]) => key === "dashboard").map(renderEntry)}
          {menuGroups.map((group) => {
            const items = entries.filter(([key]) => group.keys.includes(key ?? ""));
            if (!items.length) return null;
            const active = group.keys.includes(section);
            const show = collapsed || active || expanded.includes(group.label);
            return <div key={group.label} className="pt-2">
              <Button variant="ghost" className={`h-10 w-full justify-between text-xs text-sidebar-foreground/65 ${collapsed ? "lg:hidden" : ""}`} aria-expanded={show} onClick={() => setExpanded((current) => current.includes(group.label) ? current.filter((label) => label !== group.label) : [...current, group.label])}>{t(group.label)}<ChevronDown className={`h-3 w-3 transition-transform ${show ? "rotate-180" : ""}`} /></Button>
              {show && <div className={collapsed ? "" : "border-l border-sidebar-border pl-2"}>{items.map(renderEntry)}</div>}
            </div>;
          })}
          {entries.filter(([key]) => key === "notification" || key === "profile").map(renderEntry)}
        </nav>
        <div className="space-y-2 border-t border-sidebar-border p-4">
          <Button asChild variant="ghost" className="w-full justify-start text-sidebar-foreground">
            <Link to="/">
              <ArrowUpRight />
              <span className={collapsed ? "lg:hidden" : ""}>{t("Site FORMA")}</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground"
            onClick={() => void signOut()}
          >
            <LogOut />
            <span className={collapsed ? "lg:hidden" : ""}>{t("Se déconnecter")}</span>
          </Button>
        </div>
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <div className={collapsed ? "lg:ml-16" : "lg:ml-64"}>
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-3 border-b border-border bg-card px-5 lg:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={tr("Ouvrir le menu")}
              onClick={() => setOpen(true)}
            >
              <Menu />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              aria-label={tr("Réduire ou agrandir le menu")}
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu />
            </Button>
            <span className="text-sm font-semibold text-primary">{title}</span>
          </div>
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={t(dark ? "Thème clair" : "Thème sombre")}
              title={t(dark ? "Thème clair" : "Thème sombre")}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <LanguageSelect />
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("Notifications")}
              onClick={() => onSection("notification")}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute right-0 top-0 rounded-full bg-accent px-1 text-[10px] text-accent-foreground">
                  {notifications}
                </span>
              )}
            </Button>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <Button variant="ghost" className="min-w-0 gap-3" onClick={() => onSection("profile")}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary font-bold text-primary">
                {name.slice(0, 1).toUpperCase() || "F"}
              </span>
              <span className="hidden max-w-40 truncate text-sm sm:block">
                {name || "Mon compte"}
              </span>
            </Button>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] p-5 md:p-8 lg:p-9">{children}</main>
        <footer className="flex flex-wrap justify-between gap-2 border-t border-border px-6 py-5 text-xs text-muted-foreground">
          <span>{tr("FORMA Event & Security · Kinshasa")}</span>
          <span>{t("Espace privé · Données confidentielles")}</span>
        </footer>
      </div>
    </div>
  );
}
