import { expect, test } from "bun:test";
import { SECURITY_ENTRY_TYPES, SECURITY_SEVERITIES, SECURITY_SHIFT_TYPES, securityOperationSchema } from "../src/lib/security-operations";

const valid = {
  site_id: "d0701d72-7bd9-488d-8d3a-cc3c118af579",
  entry_type: "Prise de poste" as const,
  shift_type: "Jour" as const,
  occurred_at: "2026-10-09T07:00",
  agent_name: "Agent FORMA",
  supervisor: "Superviseur FORMA",
  severity: "Information" as const,
  summary: "Prise de poste effectuée",
  details: "Consignes reçues et matériel vérifié.",
  action_taken: "",
};

test("main courante includes the three requested event types", () => expect(SECURITY_ENTRY_TYPES).toEqual(["Prise de poste", "Ronde de patrouille", "Incident"]));
test("shift starts distinguish day and night", () => expect(SECURITY_SHIFT_TYPES).toEqual(["Jour", "Nuit"]));
test("operation severity uses the three direction levels", () => expect(SECURITY_SEVERITIES).toEqual(["Information", "Vigilance", "Critique"]));
test("shift start requires day or night", () => expect(securityOperationSchema.safeParse({ ...valid, shift_type: null }).success).toBe(false));
test("incident requires a detailed description", () => expect(securityOperationSchema.safeParse({ ...valid, entry_type: "Incident", shift_type: null, details: "Non" }).success).toBe(false));
test("valid patrol report is accepted", () => expect(securityOperationSchema.safeParse({ ...valid, entry_type: "Ronde de patrouille", shift_type: null }).success).toBe(true));
