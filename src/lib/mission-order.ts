import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
export type MissionOrder = Database["public"]["Tables"]["mission_orders"]["Row"];
export const MISSION_POLES = ["Facility Management", "Événementiel", "Support technique"] as const;
export const MISSION_STATUSES = ["Brouillon", "Émis / Transmis", "En cours d'exécution", "Livrable contrôlé", "Clôturé"] as const;
export const missionSchema = z.object({
  partner_id: z.string().uuid().nullable(), partner_name: z.string().trim().min(2).max(200),
  partner_phone: z.string().max(30), partner_email: z.union([z.literal(""), z.string().email().max(255)]),
  title: z.string().trim().min(2).max(200), pole: z.enum(MISSION_POLES),
  client_site: z.string().trim().min(2).max(200), location: z.string().trim().min(2).max(200),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  instructions: z.string().max(12000), supervisor: z.string().trim().min(2).max(200),
  amount: z.number().finite().nonnegative().max(9999999999), paid_amount: z.number().finite().nonnegative(),
  due_date: z.string().nullable(), status: z.enum(MISSION_STATUSES),
}).refine(v => v.end_date >= v.start_date, { message: "La date de fin doit suivre la date de début." })
  .refine(v => v.paid_amount <= v.amount, { message: "Le montant versé ne peut pas dépasser le montant convenu." });
export function missionFinance(amount: number, paid: number) {
  const balance = Math.round((amount - paid) * 100) / 100;
  return { balance, status: balance === 0 && amount > 0 ? "Soldé" : paid > 0 ? "Acompte réglé" : "Non payé" };
}
export const usd = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USD";
export function missionMessage(m: MissionOrder) {
  return `ORDRE DE MISSION FORMA — ${m.order_number}\nÀ l’attention de ${m.partner_name}\nMission : ${m.title}\nPôle : ${m.pole}\nClient / site : ${m.client_site}\nLieu : ${m.location}\nPériode : ${m.start_date} au ${m.end_date}\nSuperviseur FORMA : ${m.supervisor}\n\nCahier des charges / consignes :\n${m.instructions}\n\nMontant convenu : ${usd(m.amount)}\nVersé : ${usd(m.paid_amount)}\nSolde : ${usd(missionFinance(m.amount, m.paid_amount).balance)}\nÉchéance : ${m.due_date || "À convenir"}\nStatut : ${m.status}\n\nMerci de confirmer votre accord. Le prestataire s’engage à respecter les consignes, la confidentialité des informations et le contrôle des livrables par FORMA.\nETS FORMA EVENT AND SECURITY\n+243 977 528 234 — formaeventandsecurity@gmail.com`;
}