import { z } from "zod";

export const SECURITY_ENTRY_TYPES = [
  "Prise de poste",
  "Ronde de patrouille",
  "Incident",
] as const;
export const SECURITY_SHIFT_TYPES = ["Jour", "Nuit"] as const;
export const SECURITY_SEVERITIES = ["Information", "Vigilance", "Critique"] as const;

export const securityOperationSchema = z
  .object({
    site_id: z.string().uuid("Sélectionnez un site."),
    entry_type: z.enum(SECURITY_ENTRY_TYPES),
    shift_type: z.enum(SECURITY_SHIFT_TYPES).nullable(),
    occurred_at: z.string().min(1, "Indiquez la date et l’heure."),
    agent_name: z.string().trim().min(2, "Indiquez le nom de l’agent.").max(120),
    supervisor: z.string().trim().max(120),
    severity: z.enum(SECURITY_SEVERITIES),
    summary: z.string().trim().min(3, "Ajoutez un résumé.").max(180),
    details: z.string().trim().max(3000),
    action_taken: z.string().trim().max(1500),
  })
  .superRefine((value, context) => {
    if (value.entry_type === "Prise de poste" && !value.shift_type) {
      context.addIssue({
        code: "custom",
        path: ["shift_type"],
        message: "Choisissez le service de jour ou de nuit.",
      });
    }
    if (value.entry_type === "Incident" && value.details.length < 5) {
      context.addIssue({
        code: "custom",
        path: ["details"],
        message: "Décrivez précisément l’incident.",
      });
    }
  });

export type SecurityOperationInput = z.infer<typeof securityOperationSchema>;

export const currentLocalDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};
