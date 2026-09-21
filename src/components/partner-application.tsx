import { useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FORMA_EMAIL, isValidPhone, mailtoLink, whatsappLink } from "@/lib/forma-contact";

const serviceGroups = [
  { title: "Maintenance & technique", services: ["Électricité", "Plomberie", "Climatisation / HVAC", "Maintenance générale", "Équipements techniques", "Informatique & réseaux"] },
  { title: "Services opérationnels", services: ["Nettoyage & hygiène", "Entretien", "Gestion des déchets", "Parking & assistance opérationnelle", "Logistique"] },
  { title: "Événementiel — expertises complémentaires", services: ["Décoration & aménagement", "Traiteur", "Sonorisation", "Éclairage scénique", "Audiovisuel spécialisé", "Location de matériel", "Transport événementiel"] },
  { title: "Communication & créativité", services: ["Design graphique", "Impression & enseignes", "Production audiovisuelle spécialisée", "Communication digitale"] },
] as const;

const structureTypes = ["Artisan / indépendant", "PME", "Société spécialisée", "Agence / prestataire professionnel", "Autre"];
const availabilityOptions = ["Temps plein", "Sur appel", "Week-ends", "Urgences"];

type FormState = {
  structureType: string; businessName: string; managerName: string; phone: string; email: string;
  address: string; website: string; mainDomain: string; description: string; experience: string;
  teamSize: string; areas: string; references: string; documents: string; portfolio: string; otherService: string;
};

const initialForm: FormState = {
  structureType: "", businessName: "", managerName: "", phone: "", email: "", address: "", website: "",
  mainDomain: "", description: "", experience: "", teamSize: "", areas: "", references: "", documents: "", portfolio: "", otherService: "",
};

export function PartnerApplication() {
  const [form, setForm] = useState(initialForm);
  const [services, setServices] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const set = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const toggle = (value: string, values: string[], setter: (next: string[]) => void) => setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  const ready = form.structureType && form.businessName.trim().length >= 2 && form.managerName.trim().length >= 2 && isValidPhone(form.phone) && /^\S+@\S+\.\S+$/.test(form.email.trim()) && form.address.trim().length >= 3 && form.mainDomain && services.length > 0 && form.description.trim().length >= 20 && form.experience && form.teamSize.trim() && form.areas.trim().length >= 2 && availability.length > 0 && form.references.trim().length >= 10;
  const body = useMemo(() => `CANDIDATURE — RÉSEAU DE PARTENAIRES PROFESSIONNELS FORMA

IDENTITÉ
Type de structure : ${form.structureType}
Raison sociale / Nom commercial : ${form.businessName}
Responsable : ${form.managerName}
Téléphone & WhatsApp : ${form.phone}
Email professionnel : ${form.email}
Adresse / Commune : ${form.address}
Site ou page professionnelle : ${form.website || "Non renseigné"}

ACTIVITÉ & CAPACITÉS
Domaine principal : ${form.mainDomain}
Services proposés : ${services.join(", ") || "Non renseignés"}
Autre service spécialisé : ${form.otherService || "Non renseigné"}
Description : ${form.description}
Années d’expérience : ${form.experience}
Taille / effectif : ${form.teamSize}
Zones d’intervention : ${form.areas}
Disponibilités : ${availability.join(", ") || "Non renseignées"}

QUALIFICATION & CONFORMITÉ
Références : ${form.references}
Documents / agréments disponibles : ${form.documents || "Non renseignés"}
Portfolio / documents : ${form.portfolio || "Non renseigné"}`, [availability, form, services]);

  const validate = () => {
    if (ready) { setError(""); return true; }
    setError("Merci de compléter les champs obligatoires, de sélectionner au moins un service et une disponibilité, puis de vérifier le téléphone et l’email.");
    return false;
  };
  const sendEmail = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSent(true);
    window.location.href = mailtoLink(`Candidature partenaire FORMA — ${form.businessName}`, body);
  };
  const sendWhatsApp = () => {
    if (!validate()) return;
    setSent(true);
    window.open(whatsappLink(body), "_blank", "noopener,noreferrer");
  };

  return <form id="candidature" onSubmit={sendEmail} className="scroll-mt-28 border border-border bg-card p-5 shadow-soft sm:p-7 lg:p-10">
    <div className="flex flex-col gap-3 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Candidature professionnelle</p><h2 className="mt-3 text-2xl font-bold md:text-3xl">Présentez votre structure et vos capacités.</h2></div><p className="text-xs text-muted-foreground">* Champs obligatoires</p></div>

    <FormSection number="01" title="Identité">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Type de structure *"><Select value={form.structureType} onValueChange={(value) => set("structureType", value)}><SelectTrigger className="h-11"><SelectValue placeholder="Sélectionner" /></SelectTrigger><SelectContent>{structureTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select></Field>
        <Field label="Raison sociale / Nom commercial *"><Input required maxLength={120} value={form.businessName} onChange={(event) => set("businessName", event.target.value)} /></Field>
        <Field label="Nom et prénom du responsable *"><Input required maxLength={120} value={form.managerName} onChange={(event) => set("managerName", event.target.value)} /></Field>
        <Field label="Téléphone & WhatsApp *"><Input required type="tel" inputMode="tel" maxLength={24} placeholder="0977528234 ou +243 977 528 234" value={form.phone} onChange={(event) => set("phone", event.target.value.replace(/[^+0-9 ().-]/g, ""))} /></Field>
        <Field label="Email professionnel *"><Input required type="email" maxLength={180} value={form.email} onChange={(event) => set("email", event.target.value)} /></Field>
        <Field label="Adresse / Commune d’implantation *"><Input required maxLength={180} placeholder="Kinshasa ou province" value={form.address} onChange={(event) => set("address", event.target.value)} /></Field>
        <Field label="Site web ou page professionnelle (facultatif)"><Input type="url" maxLength={300} placeholder="https://" value={form.website} onChange={(event) => set("website", event.target.value)} /></Field>
      </div>
    </FormSection>

    <FormSection number="02" title="Activité & capacités">
      <Field label="Domaine principal *"><Select value={form.mainDomain} onValueChange={(value) => set("mainDomain", value)}><SelectTrigger className="h-11"><SelectValue placeholder="Sélectionner le domaine principal" /></SelectTrigger><SelectContent>{serviceGroups.map((group) => <SelectItem key={group.title} value={group.title}>{group.title}</SelectItem>)}</SelectContent></Select></Field>
      <fieldset className="mt-6"><legend className="text-xs font-bold uppercase text-muted-foreground">Services proposés * — plusieurs choix possibles</legend><div className="mt-3 grid gap-4 lg:grid-cols-2">{serviceGroups.map((group) => <div key={group.title} className="border border-border p-4"><h3 className="text-sm font-bold">{group.title}</h3><div className="mt-3 grid gap-3">{group.services.map((service) => <CheckOption key={service} label={service} checked={services.includes(service)} onChange={() => toggle(service, services, setServices)} />)}</div></div>)}</div></fieldset>
      <Field label="Autres services spécialisés"><Input maxLength={180} placeholder="Précisez une expertise complémentaire" value={form.otherService} onChange={(event) => set("otherService", event.target.value)} /></Field>
      <div className="mt-6 grid gap-5 md:grid-cols-2"><Field label="Description de l’activité *"><Textarea required maxLength={1500} className="min-h-32" value={form.description} onChange={(event) => set("description", event.target.value)} /></Field><div className="grid gap-5"><Field label="Années d’expérience *"><Select value={form.experience} onValueChange={(value) => set("experience", value)}><SelectTrigger className="h-11"><SelectValue placeholder="Sélectionner" /></SelectTrigger><SelectContent>{["Moins d’un an", "1 à 3 ans", "4 à 7 ans", "8 à 12 ans", "Plus de 12 ans"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></Field><Field label="Taille de la structure / effectif *"><Input required maxLength={80} placeholder="Ex. Indépendant, équipe de 8 personnes" value={form.teamSize} onChange={(event) => set("teamSize", event.target.value)} /></Field></div></div>
      <Field label="Zones habituelles d’intervention *"><Input required maxLength={240} placeholder="Communes, Kinshasa, provinces…" value={form.areas} onChange={(event) => set("areas", event.target.value)} /></Field>
      <fieldset className="mt-6"><legend className="text-xs font-bold uppercase text-muted-foreground">Disponibilités *</legend><div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">{availabilityOptions.map((item) => <CheckOption key={item} label={item} checked={availability.includes(item)} onChange={() => toggle(item, availability, setAvailability)} />)}</div></fieldset>
    </FormSection>

    <FormSection number="03" title="Qualification & conformité">
      <Field label="Références de réalisations / clients précédents *"><Textarea required maxLength={1800} className="min-h-32" value={form.references} onChange={(event) => set("references", event.target.value)} /></Field>
      <div className="mt-5 grid gap-5 md:grid-cols-2"><Field label="Documents professionnels / agréments disponibles"><Textarea maxLength={800} className="min-h-28" placeholder="RCCM, Identification Nationale, attestations, assurances, certifications métier…" value={form.documents} onChange={(event) => set("documents", event.target.value)} /><span className="mt-2 block text-xs font-normal normal-case leading-5 text-muted-foreground">Facultatifs selon la forme juridique et la nature de l’activité.</span></Field><Field label="Liens vers portfolio ou documents"><Textarea maxLength={800} className="min-h-28" placeholder="Un lien par ligne" value={form.portfolio} onChange={(event) => set("portfolio", event.target.value)} /></Field></div>
    </FormSection>

    <div className="mt-8 border-l-2 border-accent bg-muted p-4 text-sm leading-6 text-muted-foreground">En transmettant ce dossier, vous confirmez l’exactitude des informations fournies. Une candidature n’entraîne ni validation automatique ni promesse de mission.</div>
    <div className="mt-6 grid gap-3 sm:grid-cols-2"><Button type="submit" className="h-12"><Mail /> Envoyer par email</Button><Button type="button" variant="outline" className="h-12" onClick={sendWhatsApp}><MessageCircle /> Confirmer sur WhatsApp</Button></div>
    {error && <p role="alert" className="mt-4 border-l-2 border-destructive pl-3 text-sm text-destructive">{error}</p>}
    {sent && <div role="status" className="mt-5 flex gap-3 border border-accent/40 bg-accent/10 p-4 text-sm"><CheckCircle2 className="h-5 w-5 shrink-0 text-accent" /><div><p className="font-bold">Candidature reçue — En attente d’analyse</p><p className="mt-1 text-muted-foreground">Votre dossier est prêt à être transmis à {FORMA_EMAIL}. FORMA vous contactera si des compléments sont nécessaires.</p></div></div>}
  </form>;
}

function FormSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <section className="border-b border-border py-8 last:border-b-0"><div className="mb-6 flex items-center gap-3"><span className="text-xs font-bold text-accent">{number}</span><h3 className="text-xl font-bold">{title}</h3></div>{children}</section>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="mt-5 block text-xs font-bold uppercase text-muted-foreground first:mt-0">{label}<div className="mt-2">{children}</div></label>;
}

function CheckOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return <label className="flex cursor-pointer items-start gap-3 text-sm leading-5"><Checkbox checked={checked} onCheckedChange={onChange} className="mt-0.5" /><span>{label}</span></label>;
}