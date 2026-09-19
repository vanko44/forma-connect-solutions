import { useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FORMA_EMAIL, isValidPhone, mailtoLink, whatsappLink } from "@/lib/forma-contact";

const poles = ["Sécurité", "Événement", "Photo / Vidéo", "Publicité", "Formation", "Facility Management", "Solution multiservices"];
type Data = { pole: string; name: string; org: string; phone: string; email: string; needs: string; place: string; dates: string };
const initial: Data = { pole: "", name: "", org: "", phone: "", email: "", needs: "", place: "", dates: "" };

export function QuoteWizard() {
  const [step, setStep] = useState(1); const [data, setData] = useState(initial); const [error, setError] = useState(""); const [sent, setSent] = useState("");
  const set = (key: keyof Data, value: string) => setData(v => ({ ...v, [key]: value }));
  const valid = useMemo(() => step === 1 ? !!data.pole : step === 2 ? data.name.trim().length >= 2 && isValidPhone(data.phone) && (!data.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) : step === 3 ? data.needs.trim().length >= 15 : step === 4 ? data.place.trim().length >= 2 && !!data.dates : true, [data, step]);
  const next = () => { if (!valid) { setError("Veuillez compléter correctement les informations demandées."); return; } setError(""); setStep(s => Math.min(5, s + 1)); };
  const body = `DEMANDE DE DEVIS FORMA\n\nPôle : ${data.pole}\nNom : ${data.name}\nOrganisation : ${data.org || "—"}\nTéléphone : ${data.phone}\nEmail : ${data.email || "—"}\n\nDétails du besoin :\n${data.needs}\n\nCommune / Lieu : ${data.place}\nDate souhaitée : ${data.dates}`;
  return <div className="mx-auto max-w-3xl border border-border bg-card p-4 sm:p-6 md:p-10">
    <div className="mb-8 grid grid-cols-5 gap-2 md:mb-10" aria-label={`Étape ${step} sur 5`}>{[1,2,3,4,5].map(n => <div key={n}><div className={`h-1 ${n <= step ? "bg-accent" : "bg-muted"}`} /><p className="mt-2 text-center text-[10px] font-bold text-muted-foreground">0{n}</p></div>)}</div>
    {step === 1 && <div><p className="eyebrow">Étape 1</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Quel pôle vous concerne ?</h2><div className="mt-7 grid gap-3 sm:grid-cols-2">{poles.map(p => <button type="button" key={p} onClick={() => set("pole", p)} className={`flex min-h-14 items-center justify-between border p-4 text-left text-sm font-bold transition-colors ${data.pole === p ? "border-accent bg-accent/10" : "border-border hover:border-accent"}`}>{p}{data.pole === p && <Check className="h-4 w-4 text-accent" />}</button>)}</div></div>}
    {step === 2 && <div><p className="eyebrow">Étape 2</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Vos coordonnées</h2><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Nom *"><Input maxLength={100} value={data.name} onChange={e => set("name", e.target.value)} /></Field><Field label="Entreprise / Organisation"><Input maxLength={120} value={data.org} onChange={e => set("org", e.target.value)} /></Field><Field label="Téléphone *"><Input type="tel" inputMode="tel" placeholder="0977528234 ou +243 977 528 234" maxLength={20} value={data.phone} onChange={e => set("phone", e.target.value.replace(/[^+0-9 ().-]/g, ""))} /></Field><Field label="Email"><Input type="email" inputMode="email" maxLength={255} value={data.email} onChange={e => set("email", e.target.value)} /></Field></div></div>}
    {step === 3 && <div><p className="eyebrow">Étape 3</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Décrivez votre besoin</h2><Field label="Spécifications et besoins précis *"><Textarea className="mt-7 min-h-44" maxLength={1500} placeholder="Contexte, volume, horaires, objectifs, contraintes…" value={data.needs} onChange={e => set("needs", e.target.value)} /></Field></div>}
    {step === 4 && <div><p className="eyebrow">Étape 4</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Lieu et période souhaitée</h2><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Commune de Kinshasa / Province *"><Input maxLength={120} value={data.place} onChange={e => set("place", e.target.value)} /></Field><Field label="Date ou période souhaitée *"><Input type="date" className="w-full min-h-12 appearance-none" value={data.dates} onChange={e => set("dates", e.target.value)} /></Field></div></div>}
    {step === 5 && <div><p className="eyebrow">Étape 5</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Vérifiez et transmettez votre demande</h2><dl className="mt-7 divide-y divide-border border-y border-border text-sm">{[["Pôle",data.pole],["Contact",`${data.name} — ${data.phone}`],["Organisation",data.org || "Non précisée"],["Email",data.email || "Non précisé"],["Besoin",data.needs],["Lieu et date",`${data.place} — ${data.dates}`]].map(([k,v]) => <div key={k} className="grid gap-2 py-4 sm:grid-cols-[140px_1fr]"><dt className="font-bold text-muted-foreground">{k}</dt><dd className="whitespace-pre-wrap break-words">{v}</dd></div>)}</dl>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <Button asChild className="h-12 w-full bg-accent text-accent-foreground hover:bg-accent/90"><a href={mailtoLink(`Demande de devis FORMA — ${data.pole} — ${data.name}`, body)} onClick={() => setSent("email")}><Mail /> Envoyer par Email</a></Button>
        <Button asChild variant="outline" className="h-12 w-full"><a href={whatsappLink(body)} target="_blank" rel="noreferrer" onClick={() => setSent("whatsapp")}><Send /> Transmettre sur WhatsApp</a></Button>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">Votre demande est transmise à <a className="font-semibold text-foreground underline" href={`mailto:${FORMA_EMAIL}`}>{FORMA_EMAIL}</a> ou au +243 977 528 234.</p>
      {sent && <p className="mt-4 border-l-2 border-accent pl-3 text-sm font-semibold text-accent">Demande transmise {sent === "email" ? `par email à ${FORMA_EMAIL}` : "sur WhatsApp au +243 977 528 234"}. FORMA vous recontacte rapidement.</p>}
    </div>}
    {error && <p className="mt-5 border-l-2 border-destructive pl-3 text-sm text-destructive">{error}</p>}
    <div className="mt-8 flex justify-between gap-3">{step > 1 ? <Button variant="outline" onClick={() => { setError(""); setStep(s => s - 1); }}><ArrowLeft /> Retour</Button> : <span />}{step < 5 && <Button onClick={next}>Continuer <ArrowRight /></Button>}</div>
  </div>;
}
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block text-xs font-bold uppercase text-muted-foreground">{label}<div className="mt-2">{children}</div></label>; }
