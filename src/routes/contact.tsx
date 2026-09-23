import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageIntro } from "@/components/page-shell";
import { FORMA_EMAIL, FORMA_WHATSAPP, isValidPhone, mailtoLink, whatsappLink } from "@/lib/forma-contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [{ property: "og:url", content: "https://forma-connect-solutions.lovable.app/contact" }, 
      { title: "Contact — FORMA Event & Security Kinshasa" },
      { name: "description", content: "Contactez FORMA à Kinshasa : téléphone, WhatsApp, email formaeventandsecurity@gmail.com, adresse et formulaire." },
      { property: "og:title", content: "Contacter FORMA" },
      { property: "og:description", content: "Téléphone, WhatsApp, email et adresse officielle de FORMA à Kinshasa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://forma-connect-solutions.lovable.app/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", org: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));
  const body = `MESSAGE DE CONTACT — SITE FORMA\n\nNom : ${form.name}\nTéléphone : ${form.phone}\nOrganisation : ${form.org || "—"}\nEmail : ${form.email || "—"}\n\nMessage :\n${form.message}`;
  const ready = form.name.trim().length >= 2 && isValidPhone(form.phone) && form.message.trim().length >= 10;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) { setError("Merci d’indiquer votre nom, un téléphone valide et votre message."); return; }
    setError(""); setSent(true);
    window.location.href = mailtoLink(`Contact FORMA — ${form.name}`, body);
  };
  return <><PageIntro eyebrow="Contact" title="Parlez directement avec l’équipe FORMA." text="Pour une demande urgente, un devis ou une première évaluation, contactez FORMA à Kinshasa." /><section className="py-20"><div className="section-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><aside className="grid gap-4"><Info icon={Phone} title="Téléphone / WhatsApp" text="+243 977 528 234" href="tel:+243977528234" /><Info icon={Mail} title="Email officiel" text={FORMA_EMAIL} href={`mailto:${FORMA_EMAIL}`} /><Info icon={MapPin} title="Adresse" text="144, av. Ngandu, Q/Mpasa I, C/Nsele, Ville de Kinshasa, RDC" /><Info icon={MessageCircle} title="WhatsApp" text="Écrire directement à FORMA" href={FORMA_WHATSAPP} /></aside><form onSubmit={submit} className="border border-border bg-card p-5 sm:p-6 md:p-8"><div className="grid gap-5 sm:grid-cols-2"><Field label="Nom *"><Input required maxLength={100} value={form.name} onChange={e => set("name", e.target.value)} /></Field><Field label="Téléphone *"><Input required type="tel" inputMode="tel" placeholder="0977528234 ou +243 977 528 234" maxLength={20} value={form.phone} onChange={e => set("phone", e.target.value.replace(/[^+0-9 ().-]/g, ""))} /></Field><Field label="Entreprise / Organisation"><Input maxLength={120} value={form.org} onChange={e => set("org", e.target.value)} /></Field><Field label="Email"><Input type="email" inputMode="email" maxLength={255} value={form.email} onChange={e => set("email", e.target.value)} /></Field></div><Field label="Message *"><Textarea required maxLength={1200} className="mt-6 min-h-40" value={form.message} onChange={e => set("message", e.target.value)} /></Field><div className="mt-6 grid gap-3 sm:grid-cols-2"><Button className="h-12 w-full" type="submit"><Mail /> Envoyer par email</Button><Button asChild variant="outline" className="h-12 w-full"><a href={whatsappLink(body)} target="_blank" rel="noreferrer"><Send /> Envoyer sur WhatsApp</a></Button></div><p className="mt-3 text-xs text-muted-foreground">Votre message est adressé à <a className="font-semibold text-foreground underline" href={`mailto:${FORMA_EMAIL}`}>{FORMA_EMAIL}</a>.</p>{error && <p className="mt-4 border-l-2 border-destructive pl-3 text-sm text-destructive">{error}</p>}{sent && <p className="mt-4 text-sm font-semibold text-accent">Message transmis à {FORMA_EMAIL}. Pour un traitement immédiat, utilisez aussi WhatsApp.</p>}</form></div></section></>;
}
function Info({ icon: Icon, title, text, href }: { icon: typeof Phone; title: string; text: string; href?: string }) { const body = <div className="border border-border bg-card p-6"><Icon className="h-5 w-5 text-accent" /><h2 className="mt-8 text-xl font-bold">{title}</h2><p className="mt-3 break-words text-sm leading-6 text-muted-foreground">{text}</p></div>; return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{body}</a> : body; }
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block text-xs font-bold uppercase text-muted-foreground">{label}<div className="mt-2">{children}</div></label>; }
