import { test, expect } from "bun:test";
import { TARIFFS, offerTotals } from "../src/lib/forma-offer";

test("official FORMA tariffs", () => {
  const p = (s: string) => TARIFFS.find((t) => t.label.includes(s))!.price;
  expect(p("12h (jour)")).toBe(18);
  expect(p("12h (nuit)")).toBe(20);
  expect(p("poste fixe")).toBe(480);
  expect(p("Superviseur")).toBe(650);
  expect(p("Ronde mobile")).toBe(35);
});

test("discount applies to subtotal", () => {
  const t = offerTotals({ lines: [{ label: "a", unit: "u", price: 480, qty: 2 }, { label: "b", unit: "u", price: 650, qty: 1 }], discountPct: 10 });
  expect(t.subtotal).toBe(1610);
  expect(t.discount).toBe(161);
  expect(t.total).toBe(1449);
});
