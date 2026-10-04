import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LockKeyhole, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormaAdminDashboard } from "@/components/forma-admin-dashboard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "FORMA Admin — Centre de pilotage" },
      { name: "description", content: "Accès réservé à la direction de FORMA Event & Security." },
      { property: "og:title", content: "FORMA Admin" },
      { property: "og:description", content: "Centre de pilotage interne FORMA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type State = "checking" | "signed-out" | "forbidden" | "admin";

function AdminPage() {
  const [state, setState] = useState<State>("checking");
  const [email, setEmail] = useState("");

  const evaluate = async (userId: string | undefined, userEmail?: string) => {
    if (!userId) { setState("signed-out"); return; }
    setEmail(userEmail ?? "");
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    setState(data ? "admin" : "forbidden");
  };

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => evaluate(data.session?.user.id, data.session?.user.email));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => { setTimeout(() => void evaluate(session?.user.id, session?.user.email), 0); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); setState("signed-out"); };

  if (state === "checking") return <section className="section-shell py-24 text-center text-sm text-muted-foreground">Vérification de l’accès…</section>;
  if (state === "signed-out") return <AdminLogin />;
  if (state === "forbidden") return <section className="section-shell max-w-lg py-24"><div className="border border-border bg-card p-8 shadow-soft"><LockKeyhole className="h-6 w-6 text-accent" /><h1 className="mt-5 text-2xl font-bold">Accès non autorisé</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Le compte {email} n’a pas les droits d’administration FORMA.</p><Button className="mt-6" variant="outline" onClick={() => void signOut()}><LogOut /> Se déconnecter</Button></div></section>;

  return <section className="py-10 md:py-14"><div className="section-shell">
    <div className="mb-6 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">FORMA Admin</p><h1 className="mt-2 text-3xl font-bold md:text-4xl">Centre de pilotage opérationnel</h1><p className="mt-2 text-sm text-muted-foreground">Connecté : {email}</p></div><Button variant="outline" onClick={() => void signOut()}><LogOut /> Se déconnecter</Button></div>
    <FormaAdminDashboard />
  </div></section>;
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setError("Identifiants incorrects ou compte non confirmé.");
    setBusy(false);
  };
  return <section className="section-shell max-w-md py-20"><form onSubmit={submit} className="border border-border bg-card p-8 shadow-soft">
    <ShieldCheck className="h-7 w-7 text-accent" /><p className="eyebrow mt-6">Accès réservé</p><h1 className="mt-2 text-2xl font-bold">Connexion FORMA Admin</h1>
    <p className="mt-2 text-sm text-muted-foreground">Réservé à la direction et aux superviseurs FORMA.</p>
    <label className="mt-6 block text-xs font-bold uppercase text-muted-foreground">Email<Input className="mt-2" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
    <label className="mt-4 block text-xs font-bold uppercase text-muted-foreground">Mot de passe<Input className="mt-2" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
    {error && <p className="mt-4 border-l-2 border-destructive pl-3 text-sm text-destructive">{error}</p>}
    <Button type="submit" disabled={busy} className="mt-6 h-11 w-full">{busy ? "Connexion…" : "Se connecter"}</Button>
    <p className="mt-4 text-xs text-muted-foreground">Première connexion : créez votre compte avec l’email propriétaire depuis l’Espace Client, puis revenez ici.</p>
  </form></section>;
}
