import { FORMA_EMAIL } from "@/lib/forma-contact";
import { offerTotals, SERVICE_GROUPS, usd, type Offer } from "@/lib/forma-offer";

const RCCM = "CD/KNM/RCCM/25-A-10490";
const ADDRESS = "144, av. Ngandu, Q/Mpasa I, C/Nsele, Ville de Kinshasa, RDC";

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return <section className="offer-page border-t border-border px-6 py-10 sm:px-12">
    <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Section {n}</p>
    <h2 className="mt-2 text-2xl font-bold">{title}</h2>
    <div className="mt-6 text-sm leading-7">{children}</div>
  </section>;
}

export function FormaOfferDocument({ offer }: { offer: Offer }) {
  const lines = offer.lines.filter((l) => l.qty > 0);
  const t = offerTotals(offer);
  const date = new Date(offer.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const services = SERVICE_GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => offer.services.includes(i)) })).filter((g) => g.items.length);
  return <article className="forma-offer bg-card text-card-foreground">
    <header className="offer-page flex min-h-[520px] flex-col justify-between bg-primary px-6 py-10 text-primary-foreground sm:px-12">
      <div className="flex items-center gap-4"><img src="/images/forma-logo.jpeg" alt="Logo FORMA" className="h-16 w-16 object-contain" /><p className="text-sm font-bold uppercase tracking-[0.2em]">FORMA Event Services & Security</p></div>
      <div><p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Offre de services</p><p className="mt-3 text-sm uppercase tracking-widest opacity-80">Sécurité • Gardiennage • Protection • Événementiel</p><p className="mt-10 text-sm opacity-80">Préparée à l’attention de</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">{offer.clientName}</h1><p className="mt-4 text-sm opacity-80">Kinshasa, République Démocratique du Congo — {date}</p></div>
      <p className="border-t border-primary-foreground/20 pt-4 text-xs opacity-80">ETS FORMA EVENT AND SECURITY — RCCM {RCCM} — Kinshasa</p>
    </header>

    <Section n="01" title="Lettre de soumission">
      <p className="font-bold">À l’attention de la Direction Générale de {offer.clientName}</p>
      <p className="mt-3">Monsieur, Madame,</p>
      <p className="mt-3">Nous avons le plaisir de vous soumettre la présente offre de services en matière de sécurité, de gardiennage et de protection.</p>
      <p className="mt-3">FORMA Event Services & Security est une entreprise spécialisée dans la sécurité ainsi que les services événementiels et personnels. Nous savons que la sécurité de vos biens, de vos collaborateurs et de vos activités est une priorité, et nous serions heureux de vous accompagner dans la mise en œuvre d’une solution adaptée à vos besoins réels.</p>
      <p className="mt-3">Vous trouverez ci-après les prestations retenues ainsi que notre devis, que nous ajusterons ensemble selon le périmètre définitif.</p>
      <p className="mt-3">Nous vous prions d’agréer, Monsieur, Madame, nos salutations distinguées.</p>
      <div className="mt-8 border-l-2 border-accent pl-4"><p className="font-bold">{offer.signatory || "—"}</p><p className="text-muted-foreground">{offer.signatoryRole} · FORMA Event Services & Security</p></div>
    </Section>

    <Section n="02" title="Notre compréhension de vos besoins">
      <p>Toute structure doit protéger ses biens, ses équipes et son activité, tout en maîtrisant ses coûts et en gardant la flexibilité d’ajuster le dispositif selon les périodes et les risques.</p>
      <div className="mt-6 grid gap-px bg-border sm:grid-cols-2">{[["Diagnostic", "Analyse rapide du site, de l’événement et des risques identifiés."], ["Dispositif adapté", "Effectif, horaires et équipement dimensionnés à vos besoins réels."], ["Encadrement", "Supervision continue des agents et respect des procédures."], ["Reporting", "Suivi régulier et ajustement du dispositif si nécessaire."]].map(([k, v]) => <div key={k} className="bg-card p-5"><p className="font-bold">{k}</p><p className="mt-1 text-muted-foreground">{v}</p></div>)}</div>
    </Section>

    <Section n="03" title="Prestations retenues">
      <div className="grid gap-6 sm:grid-cols-2">{services.map((g) => <div key={g.title}><p className="font-bold text-accent">{g.title}</p><ul className="mt-2 list-disc pl-5">{g.items.map((i) => <li key={i}>{i}</li>)}</ul></div>)}</div>
    </Section>

    <Section n="05" title="Notre devis">
      <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left"><thead className="bg-primary text-xs uppercase text-primary-foreground"><tr><th className="p-3">Prestation</th><th className="p-3">Unité</th><th className="p-3 text-right">Tarif HT</th><th className="p-3 text-right">Qté</th><th className="p-3 text-right">Montant</th></tr></thead>
        <tbody>{lines.map((l) => <tr key={l.label} className="border-b border-border"><td className="p-3">{l.label}</td><td className="p-3 text-muted-foreground">{l.unit}</td><td className="p-3 text-right">{usd(l.price)}</td><td className="p-3 text-right">{l.qty}</td><td className="p-3 text-right font-semibold">{usd(l.price * l.qty)}</td></tr>)}</tbody>
        <tfoot><tr><td colSpan={4} className="p-3 text-right">Sous-total HT</td><td className="p-3 text-right">{usd(t.subtotal)}</td></tr>{t.discount > 0 && <tr><td colSpan={4} className="p-3 text-right">Remise ({offer.discountPct} %)</td><td className="p-3 text-right">− {usd(t.discount)}</td></tr>}<tr className="bg-secondary font-bold"><td colSpan={4} className="p-3 text-right">Total HT</td><td className="p-3 text-right">{usd(t.total)}</td></tr></tfoot></table></div>
      {offer.notes && <div className="mt-6 border-l-2 border-accent pl-4"><p className="font-bold">Conditions particulières</p><p className="mt-1 whitespace-pre-wrap text-muted-foreground">{offer.notes}</p></div>}
    </Section>

    <Section n="06" title="Nos documents légaux">
      <ol className="list-decimal pl-5"><li>Identification Nationale — Ministère de l’Économie Nationale</li><li>Certificat d’immatriculation à l’INPP</li><li>Certificat d’immatriculation et de déclaration d’embauche — ONEM</li><li>Déclaration de demande d’immatriculation — RCCM</li><li>Extrait du Registre du Commerce et du Crédit Mobilier — RCCM {RCCM}</li></ol>
      <p className="mt-3 text-muted-foreground">Copies disponibles sur simple demande auprès de FORMA.</p>
    </Section>

    <Section n="07" title="Nos coordonnées">
      <dl className="grid gap-2 sm:grid-cols-[160px_1fr]"><dt className="font-bold">Raison sociale</dt><dd>ETS FORMA EVENT AND SECURITY</dd><dt className="font-bold">RCCM</dt><dd>{RCCM} — Kinshasa</dd><dt className="font-bold">Adresse</dt><dd>{ADDRESS}</dd><dt className="font-bold">Téléphone</dt><dd>+243 977 528 234</dd><dt className="font-bold">Email</dt><dd>{FORMA_EMAIL}</dd>{offer.signatory && <><dt className="font-bold">Point focal</dt><dd>{offer.signatory}</dd></>}</dl>
    </Section>
  </article>;
}

export function printOffer() { document.body.classList.add("printing-offer"); window.print(); setTimeout(() => document.body.classList.remove("printing-offer"), 500); }
