import { expect, test } from "bun:test";
import { canRetryModuleLoad, isModuleLoadError } from "../src/lib/module-load-recovery";

test("recognizes the reported module import failure", () => {
  expect(isModuleLoadError(new TypeError("Importing a module script failed."))).toBe(true);
});
test("recognizes stale deployment chunk errors", () => {
  expect(isModuleLoadError(new TypeError("Failed to fetch dynamically imported module: /assets/index-old.js"))).toBe(true);
});
test("does not reload unrelated application errors", () => {
  expect(isModuleLoadError(new Error("Access denied"))).toBe(false);
});
test("allows first recovery and blocks repeated reload loops", () => {
  expect(canRetryModuleLoad(NaN, 100000)).toBe(true);
  expect(canRetryModuleLoad(100000, 100001)).toBe(false);
  expect(canRetryModuleLoad(100000, 160001)).toBe(true);
});