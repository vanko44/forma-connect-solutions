import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Building2, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/connexion-client")({
  head: () => ({
    meta: [
      { title: "Connexion Espace Client — FORMA" },
      { name: "description", content: "Connectez-vous ou créez gratuitement votre compte client FORMA pour suivre vos devis, sites, interventions et rapports." },
      { property: "og:title", content: "Espace Client FORMA" },
      { property: "og:description", content: "Un accès client gratuit pour suivre les prestations confiées à FORMA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/connexion-client" }],
  }),
  component: ClientConnection,
});

function ClientConnection() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/espace-client", replace: true });
    });
  }, [navigate]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (signInError) { setError("Email ou mot de passe incorrect."); return; }
      await navigate({ to: "/espace-client" });
      return;
    }
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/connexion-client` },
    });
    setLoading(false);
    if (signUpError) { setError(signUpError.message); return; }
    if (data.session) { await navigate({ to: "/espace-client" }); return; }
    setMessage("Compte créé. Consultez votre email pour confirmer votre adresse, puis connectez-vous.");
    setMode("login");
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError("");
    window.sessionStorage.setItem("forma-auth-next", "/espace-client");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { setError("La connexion Google n’a pas abouti. Réessayez."); setLoading(false); return; }
    if (!result.redirected) await navigate({ to: "/espace-client" });
  };

  return <section className="bg-card py-14 md:py-20">
    <div className="section-shell grid items-start gap-12 lg:grid-cols-[.85fr_1.15fr]">
      <div className="pt-4 lg:pt-10">
        <p className="eyebrow">Clients FORMA</p>
        <h1 className="mt-4 max-w-xl text-4xl font-extrabold leading-tight md:text-5xl">Votre suivi opérationnel, au même endroit.</h1>
        <p className="mt-5 max-w-lg leading-7 text-muted-foreground">Cet accès gratuit est réservé aux particuliers, entreprises et organisations qui commandent des prestations FORMA.</p>
        <div className="mt-8 grid gap-3 text-sm font-semibold">
          {["Suivi des devis et demandes", "Vue de vos sites et interventions", "Accès aux rapports opérationnels"].map((item) => <p key={item} className="flex items-center gap-3"><ArrowRight className="h-4 w-4 text-accent" />{item}</p>)}
        </div>
        <div className="mt-9 border-l-2 border-accent bg-background p-5 text-sm leading-6 text-muted-foreground">
          <p className="font-bold text-foreground">Vous êtes artisan ou technicien ?</p>
          <p className="mt-1">L’accès prestataire est distinct de l’Espace Client.</p>
          <Link to="/rejoindre" className="mt-3 inline-flex font-bold text-foreground underline">Rejoindre le réseau FORMA</Link>
        </div>
      </div>
      <div className="border border-border bg-background p-5 shadow-soft sm:p-8 md:p-10">
        <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center bg-primary text-primary-foreground"><Building2 className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase text-muted-foreground">Espace Client</p><h2 className="text-xl font-bold">{mode === "login" ? "Se connecter" : "Créer un compte gratuit"}</h2></div></div>
        <div className="mt-7 grid grid-cols-2 border border-border p-1">
          <Button type="button" variant={mode === "login" ? "default" : "ghost"} onClick={() => setMode("login")}>Connexion</Button>
          <Button type="button" variant={mode === "signup" ? "default" : "ghost"} onClick={() => setMode("signup")}>Créer un compte</Button>
        </div>
        <form className="mt-7 grid gap-5" onSubmit={submit}>
          <div><Label htmlFor="client-email">Email</Label><div className="relative mt-2"><Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="client-email" className="h-11 pl-10" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div></div>
          <div><Label htmlFor="client-password">Mot de passe</Label><div className="relative mt-2"><LockKeyhole className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="client-password" className="h-11 px-10" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-9 w-9" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>{showPassword ? <EyeOff /> : <Eye />}</Button></div></div>
          <Button className="h-12 w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>{loading ? "Connexion…" : mode === "login" ? "Accéder à mon espace" : "Créer mon compte client gratuit"}</Button>
        </form>
        <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase text-muted-foreground"><span className="h-px flex-1 bg-border" />ou<span className="h-px flex-1 bg-border" /></div>
        <Button type="button" variant="outline" className="h-11 w-full" onClick={signInWithGoogle} disabled={loading}>Continuer avec Google</Button>
        {error && <p role="alert" className="mt-5 border-l-2 border-destructive pl-3 text-sm text-destructive">{error}</p>}
        {message && <p role="status" className="mt-5 border-l-2 border-accent pl-3 text-sm font-semibold">{message}</p>}
      </div>
    </div>
  </section>;
}