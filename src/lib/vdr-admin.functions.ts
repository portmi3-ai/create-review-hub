import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

async function requireAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Admin role required");
}

const fileInput = z.object({
  documentId: z.string().uuid(),
  storagePath: z.string().trim().min(1).max(500),
  originalFilename: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().max(120).optional().nullable(),
  sizeBytes: z.number().int().nonnegative().optional().nullable(),
  version: z.string().trim().max(40).optional().nullable(),
  isPrimary: z.boolean().optional().default(false),
});

export const registerDocumentFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => fileInput.parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { error } = await context.supabase.from("document_files").insert({
      document_id: data.documentId,
      storage_path: data.storagePath,
      original_filename: data.originalFilename,
      mime_type: data.mimeType,
      size_bytes: data.sizeBytes,
      version: data.version,
      is_primary: data.isPrimary,
      uploaded_by: context.userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const inviteInput = z.object({
  email: z.string().trim().email(),
  firm: z.string().trim().max(160).optional().nullable(),
  role: z.enum(["investor", "admin"]).optional().default("investor"),
});

export const createInvestorInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => inviteInput.parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { data: row, error } = await context.supabase
      .from("investor_invites")
      .insert({ email: data.email, firm: data.firm, role: data.role, invited_by: context.userId })
      .select("id, email, firm, role, status, expires_at")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, invite: row };
  });
