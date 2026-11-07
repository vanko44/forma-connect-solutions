import { expect, test } from "bun:test";
import { SCROLL_ANIMATION_DEFAULTS } from "../src/hooks/use-scroll-animation";

test("scroll reveal triggers at twenty percent visibility", () => {
  expect(SCROLL_ANIMATION_DEFAULTS.threshold).toBe(0.2);
});
test("scroll reveal uses the requested viewport margin", () => {
  expect(SCROLL_ANIMATION_DEFAULTS.rootMargin).toBe("0px 0px -10% 0px");
});
test("scroll reveal does not repeat by default", () => {
  expect(SCROLL_ANIMATION_DEFAULTS.once).toBe(true);
});