import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";

const migration = readFileSync(
  "supabase/migrations/20261005091538_1b38d92e-9b1d-472c-bca8-f0559aa13dc5.sql",
  "utf8",
);

test("confirmed direction emails receive administrator rights", () => {
  for (const email of [
    "emmanuelvanko@gmail.com",
    "formaeventandsecurity@gmail.com",
    "formaeventandsecuriy@gmail.com",
  ]) {
    expect(migration).toContain(email);
  }
  expect(migration).toContain("new.email_confirmed_at is not null");
  expect(migration).toContain("after update of email_confirmed_at, email on auth.users");
});

test("unconfirmed direction addresses lose administrator rights", () => {
  expect(migration).toContain("new.email_confirmed_at is null");
  expect(migration).toContain(
    "delete from public.user_roles where user_id = new.id and role = 'admin'",
  );
});
