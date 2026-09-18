import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Megaphone, PlayCircle } from "lucide-react";
import { PageIntro, CtaBand } from "@/components/page-shell";

export const Route = createFileRoute("/media-publicite")({
  head: () => ({ meta: [{ title: "Media, couverture et publicité — FORMA" }, { name: "description", content: "Photographie, vidéo, streaming live, couverture médiatique, personal branding et campagnes digitales en RDC." }, { property: "og:title", content: "FORMA Media & Advertising" }, { property: "og:description", content: "Production média, visibilité et communication corporate avec une exécution maîtrisée." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "/media-publicite" }] }),
  component: MediaPublicite,
});

const filters = ["Corporate", "Événement", "Institutionnel", "Culture"];
const works = [
  { type: "Corporate", title: "Portraits exécutifs", text: "Image professionnelle de dirigeants, équipes et organisations." },
  { type: "Événement", title: "Couverture complète", text: "Photo, vidéo, captation des temps forts et livraison organisée." },
  { type: "Institutionnel", title: "Discours et conférences", text: "Captation sobre pour ONG, institutions, entreprises et partenaires." },
  { type: "Culture", title: "Événements culturels", text: "Mise en valeur des scènes, artistes, publics et coulisses." },
];

function MediaPublicite() {
  const [filter, setFilter] = useState(filters[0]);
  const visible = works.filter((item) => item.type === filter);
  return <><PageIntro eyebrow="FORMA Media & Advertising" title="Image, couverture et campagnes avec rigueur corporate." text="FORMA accompagne la visibilité des entreprises, dirigeants, personnalités et événements avec une production cohérente et maîtrisée." /><section className="py-20"><div className="section-shell grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow">Prestations</p><div className="mt-8 grid gap-4"><Block icon={Camera} title="Media & Coverage" text="Photographie, vidéo, streaming live, couverture médiatique et création de contenu." /><Block icon={Megaphone} title="Advertising" text="Personal branding, publicité produit, publicité entreprise, création visuelle et campagnes digitales." /></div></div><div><div className="flex flex-wrap gap-2">{filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`border px-4 py-2 text-xs font-bold uppercase transition-colors ${filter === item ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card hover:border-accent"}`}>{item}</button>)}</div><div className="mt-6 grid gap-px bg-border sm:grid-cols-2">{visible.map((item) => <article key={item.title} className="bg-card p-7"><PlayCircle className="h-6 w-6 text-accent" /><p className="mt-8 text-xs font-bold uppercase text-muted-foreground">{item.type}</p><h2 className="mt-2 text-xl font-bold">{item.title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p></article>)}</div></div></div></section><CtaBand /></>;
}
function Block({ icon: Icon, title, text }: { icon: typeof Camera; title: string; text: string }) { return <article className="border border-border bg-card p-6"><Icon className="h-5 w-5 text-accent" /><h2 className="mt-8 text-xl font-bold">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></article>; }