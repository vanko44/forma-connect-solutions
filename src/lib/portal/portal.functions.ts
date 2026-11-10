import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { recordSchema, portalAllowed } from "./model";
export const getPortal = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) =>
    z
      .object({ environment: z.enum(["client", "provider", "admin", "staff"]).optional() })
      .parse(v ?? {}),
  )
  .handler(async ({ context, data: input }) => {
    const s = context.supabase;
    const [profile, roles, admin] = await Promise.all([
      s.from("profiles").select("*").eq("id", context.userId).single(),
      s.from("portal_roles").select("role").eq("user_id", context.userId),
      s.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
    ]);
    if (profile.error || roles.error || admin.error)
      throw new Error("Impossible de vérifier votre compte.");
    const roleNames = roles.data?.map((r) => r.role) ?? [];
    if (input.environment && !portalAllowed(input.environment, Boolean(admin.data), roleNames))
      throw new Error("Accès non autorisé à cet espace.");
    const staff =
      Boolean(admin.data) ||
      roleNames.some((r) => ["operations", "finance", "customer"].includes(r));
    const [records, people, documents, audit] = await Promise.all([
      s.from("portal_records").select("*").order("created_at", { ascending: false }),
      staff
        ? s.from("profiles").select("*").order("display_name")
        : s.from("profiles").select("*").eq("id", context.userId),
      s.from("portal_documents").select("*"),
      admin.data
        ? s.from("portal_audit").select("*").order("created_at", { ascending: false }).limit(100)
        : Promise.resolve({ data: [], error: null }),
    ]);
    if (
      profile.error ||
      roles.error ||
      admin.error ||
      records.error ||
      people.error ||
      documents.error ||
      audit.error
    )
      throw new Error("Impossible de charger votre espace. Réessayez.");
    return {
      userId: context.userId,
      profile: profile.data,
      roles: roles.data?.map((r) => r.role) ?? [],
      admin: Boolean(admin.data),
      records: records.data ?? [],
      people: people.data ?? [],
      documents: documents.data ?? [],
      audit: audit.data ?? [],
    };
  });
export const saveRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => recordSchema.parse(v))
  .handler(async ({ data, context }) => {
    const { data: staff, error: permissionError } = await context.supabase.rpc(
      "portal_record_staff",
      { k: data.kind },
    );
    if (permissionError) throw new Error("Vérification des autorisations impossible.");
    if (!staff) {
      if (data.id) throw new Error("Modification non autorisée.");
      if (data.kind === "complaint") {
        data.owner_id = context.userId;
        data.provider_id = null;
        data.status = "nouvelle";
        data.amount = 0;
        data.parent_id = null;
        data.attributes = {
          description: data.attributes["description"] ?? "",
          category: data.attributes["category"] ?? "",
        };
      } else if (data.kind === "report") {
        if (!data.parent_id) throw new Error("Mission requise.");
        const { data: m } = await context.supabase
          .from("portal_records")
          .select("*")
          .eq("id", data.parent_id)
          .single();
        if (
          !m ||
          m.kind !== "mission" ||
          m.provider_id !== context.userId ||
          !["acceptée", "en cours", "en attente de validation"].includes(m.status)
        )
          throw new Error("Mission non autorisée.");
        data.owner_id = m.owner_id;
        data.provider_id = context.userId;
        data.status = "soumis";
        data.amount = 0;
        data.attributes = {
          description: data.attributes["description"] ?? "",
          incident: data.attributes["incident"] ?? "",
          difficulties: data.attributes["difficulties"] ?? "",
        };
      } else throw new Error("Action non autorisée.");
    }
    const { id, ...payload } = data;
    const result = id
      ? await context.supabase.from("portal_records").update(payload).eq("id", id).select().single()
      : await context.supabase
          .from("portal_records")
          .insert({ ...payload, created_by: context.userId })
          .select()
          .single();
    if (result.error)
      throw new Error(
        "Enregistrement refusé : vérifiez les dates, les affectations et les montants.",
      );
    return result.data;
  });
export const actOnMission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) =>
    z
      .object({ id: z.string().uuid(), action: z.enum(["accept", "refuse", "start", "finish"]) })
      .parse(v),
  )
  .handler(async ({ data, context }) => {
    const r = await context.supabase.rpc("provider_mission_action", {
      mission_id: data.id,
      action: data.action,
    });
    if (r.error) throw new Error("Cette action n’est pas autorisée pour cette mission.");
    return { ok: true };
  });
export const saveProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) =>
    z
      .object({
        display_name: z.string().trim().min(2).max(100),
        company: z.string().max(150),
        phone: z.string().max(40),
        avatar_url: z.string().max(500),
      })
      .parse(v),
  )
  .handler(async ({ data, context }) => {
    const r = await context.supabase.from("profiles").update(data).eq("id", context.userId);
    if (r.error) throw new Error("Profil non enregistré.");
    return { ok: true };
  });
export const documentUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ data, context }) => {
    const { data: doc } = await context.supabase
      .from("portal_documents")
      .select("*")
      .eq("id", data.id)
      .single();
    if (!doc) throw new Error("Document non accessible.");
    const r = await context.supabase.storage
      .from("portal-documents")
      .createSignedUrl(doc.storage_path, 60, { download: doc.name });
    if (r.error) throw new Error("Téléchargement indisponible.");
    return { url: r.data.signedUrl };
  });
export const manageAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        email: z.string().email().optional(),
        display_name: z.string().min(2).max(100),
        company: z.string().max(150),
        phone: z.string().max(40),
        role: z.enum(["client", "provider", "operations", "finance", "customer"]),
      })
      .parse(v),
  )
  .handler(async ({ data, context }) => {
    const { data: admin, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error || !admin) throw new Error("Seule la direction peut gérer les comptes.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let id = data.id;
    if (!id) {
      if (!data.email) throw new Error("Email requis.");
      const { data: invite, error: invError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        data.email,
        {
          data: { full_name: data.display_name },
          redirectTo: new URL(
            "/connexion-client",
            (await import("@tanstack/react-start/server")).getRequest().url,
          ).href,
        },
      );
      if (invError || !invite.user)
        throw new Error(
          "Invitation impossible. Vérifiez l’adresse ou modifiez un compte existant.",
        );
      id = invite.user.id;
    }
    const p = await supabaseAdmin
      .from("profiles")
      .update({ display_name: data.display_name, company: data.company, phone: data.phone })
      .eq("id", id);
    if (p.error) throw new Error("Profil non enregistré.");
    const old = await supabaseAdmin.from("portal_roles").delete().eq("user_id", id);
    if (old.error) throw new Error("Permissions non modifiées.");
    const r = await supabaseAdmin.from("portal_roles").insert({ user_id: id, role: data.role });
    if (r.error) throw new Error("Permission non enregistrée.");
    await supabaseAdmin
      .from("portal_audit")
      .insert({ actor_id: context.userId, record_id: id, action: `account:${data.role}` });
    return { ok: true };
  });
