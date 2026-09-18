import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageIntro } from "@/components/page-shell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — FORMA Event & Security Kinshasa" },
      { name: "description", content: "Contactez FORMA à Kinshasa : téléphone, WhatsApp, adresse et formulaire de prise de contact." },
      { property: "og:title", content: "Contacter FORMA" },
      { property: "og:description", content: "Téléphone, WhatsApp et adresse officielle de FORMA à Kinshasa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return <><PageIntro eyebrow="Contact" title="Parlez directement avec l’équipe FORMA." text="Pour une demande urgente, un devis ou une première évaluation, contactez FORMA à Kinshasa." /><section className="py-20"><div className="section-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><aside className="grid gap-4"><Info icon={Phone} title="Téléphone / WhatsApp" text="+243 977 528 234" href="tel:+243977528234" /><Info icon={MapPin} title="Adresse" text="144, av. Ngandu, Q/Mpasa I, C/Nsele, Ville de Kinshasa, RDC" /><Info icon={MessageCircle} title="WhatsApp" text="Écrire directement à FORMA" href="https://wa.me/243977528234" /></aside><form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="border border-border bg-card p-6 md:p-8"><div className="grid gap-5 sm:grid-cols-2"><Field label="Nom"><Input required maxLength={100} /></Field><Field label="Téléphone"><Input required type="tel" maxLength={18} /></Field><Field label="Entreprise / Organisation"><Input maxLength={120} /></Field><Field label="Email"><Input type="email" maxLength={255} /></Field></div><Field label="Message"><Textarea required maxLength={1200} className="mt-6 min-h-40" /></Field><Button className="mt-6 h-11 w-full" type="submit"><Send /> Envoyer la demande</Button>{sent && <p className="mt-4 text-sm font-semibold text-accent">Votre message est prêt. Pour un traitement immédiat, utilisez aussi le bouton WhatsApp.</p>}</form></div></section></>;
}
function Info({ icon: Icon, title, text, href }: { icon: typeof Phone; title: string; text: string; href?: string }) { const body = <div className="border border-border bg-card p-6"><Icon className="h-5 w-5 text-accent" /><h2 className="mt-8 text-xl font-bold">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></div>; return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{body}</a> : body; }
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block text-xs font-bold uppercase text-muted-foreground">{label}<div className="mt-2">{children}</div></label>; }