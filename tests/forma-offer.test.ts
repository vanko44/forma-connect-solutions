import { test, expect } from "bun:test";
import { TARIFFS, defaultOffer, offerTeamRows, offerTotals } from "../src/lib/forma-offer";

test("official FORMA tariffs", () => {
  const p = (s: string) => TARIFFS.find((t) => t.label.includes(s))?.price;
  expect(p("12h (jour)")).toBe(18);
  expect(p("12h (nuit)")).toBe(20);
  expect(p("poste fixe")).toBe(480);
  expect(p("Superviseur")).toBe(650);
  expect(p("Ronde mobile")).toBe(35);
});

test("discount applies to subtotal", () => {
  const t = offerTotals({
    lines: [
      { label: "a", unit: "u", price: 480, qty: 2 },
      { label: "b", unit: "u", price: 650, qty: 1 },
    ],
    discountPct: 10,
  });
  expect(t.subtotal).toBe(1610);
  expect(t.discount).toBe(161);
  expect(t.total).toBe(1449);
});

test("official organigram retains all six functions in reference order", () => {
  expect(offerTeamRows({}).map((r) => r.label)).toEqual([
    "Direction Générale / Fondateur",
    "Responsable Opérations & Sécurité",
    "Responsable Commercial & Administratif",
    "Chefs d'équipe / Superviseurs de site",
    "Coordinateur Événementiel",
    "Agents de terrain (gardiennage, rondes, protection, événementiel)",
  ]);
});

test("older offers without a team keep six blank names", () => {
  expect(offerTeamRows({}).map((r) => r.name)).toEqual(["", "", "", "", "", ""]);
});

test("manually completed names survive offer serialization with blank roles allowed", () => {
  const offer = defaultOffer({ name: "Client", organization: null });
  offer.team = { direction: "Responsable test", operations: "Opérations test", events: "   " };
  const rows = offerTeamRows(JSON.parse(JSON.stringify(offer)));
  expect(rows[0].name).toBe("Responsable test");
  expect(rows[1].name).toBe("Opérations test");
  expect(rows[4].name).toBe("");
});
