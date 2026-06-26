import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { activity, companyProfile, investors, metrics, roadmap } from "@/data/seed";
import { getInvestorDocumentAsset } from "@/data/investor-documents";
import { calculateInvestorPriority, classifyDocumentRisk } from "@/lib/scoring";

const conciergeContext = `
Company: Discharge Bridge by Mport Media Technologies, Inc.
Positioning: Governance-aware healthcare discharge orchestration infrastructure for hospital-to-SNF transitions.
Core thesis: reduce avoidable inpatient days, manual discharge coordination, SNF placement friction, prior-auth readiness gaps, and medication handoff risk.
Platform: deterministic workflows, advisory AI, FHIR/HL7 alignment, Cloud Run services, Firebase/Firestore, Vertex AI-ready, AgentEcos orchestration, HIPAA-aligned posture, SOC 2 readiness roadmap.
Investor room modules: secure data room, investor CRM, engagement analytics, diligence checklist, AI concierge, product sandbox, GitHub/deployment feed, monthly investor updates.
Current status: pilot-ready enterprise validation, CMS facility registry imports, production smoke validation milestones, patent-pending automated entity placement/resource matching method.
`;

function fallbackAnswer(question: string) {
  return `Based on the current InvestorOS knowledge base:\n\n${conciergeContext.trim()}\n\nInvestor diligence answer for: "${question}"\n\nDischarge Bridge should be presented as a healthcare infrastructure platform, not a lightweight workflow app. The investable wedge is hospital-to-SNF discharge orchestration, where delays create measurable financial and operational loss. The platform combines deterministic routing, facility matching, prior-auth readiness, medication coordination, auditability, and advisory AI. For diligence, emphasize pilot validation, security posture, integration path, patent-pending workflow intelligence, and the ability to expand from discharge coordination into broader healthcare orchestration infrastructure.`;
}

export const getInvestorRoom = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: isAdminData } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    const isAdmin = Boolean(isAdminData);

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, firm")
      .eq("id", userId)
      .maybeSingle();

    const { data: docRows, error: docErr } = await supabase
      .from("documents")
      .select("id, title, type, status, access, views, owner, version, slug")
      .order("created_at", { ascending: true });
    if (docErr) throw new Error(docErr.message);

    const visibleDocs = (docRows ?? []).map((d) => {
      const asset = getInvestorDocumentAsset(d.slug);
      return {
        ...d,
        risk: classifyDocumentRisk(d.status, d.access),
        summary: asset?.summary ?? "Document metadata is configured, but content has not been attached yet.",
        downloadUrl: asset?.downloadUrl ?? null,
        content: asset?.content ?? [],
        checklist: asset?.checklist ?? [],
      };
    });

    const rankedInvestors = isAdmin
      ? investors
          .map((i) => ({ ...i, priority: calculateInvestorPriority(i) }))
          .sort((a, b) => b.priority - a.priority)
      : [];

    return {
      role: (isAdmin ? "admin" : "investor") as "admin" | "investor",
      profile: profile ?? null,
      companyProfile,
      metrics: isAdmin ? metrics : [],
      documents: visibleDocs,
      investors: rankedInvestors,
      analytics: isAdmin ? visibleDocs.map((d) => ({ name: d.type, views: d.views })) : [],
      roadmap,
      activity: isAdmin ? activity : [],
    };
  });

const docInput = z.object({
  title: z.string().trim().min(1).max(200),
  type: z.string().trim().min(1).max(80),
  status: z.string().trim().min(1).max(80),
  access: z.enum(["NDA", "Restricted", "Public"]),
  owner: z.string().trim().max(80).optional().nullable(),
  version: z.string().trim().max(40).optional().nullable(),
});

export const createDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => docInput.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("documents").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ id: z.string().uuid() }).merge(docInput.partial()).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("documents").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("documents").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const trackDocumentView = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: current, error: readError } = await context.supabase
      .from("documents")
      .select("views")
      .eq("id", data.id)
      .maybeSingle();
    if (readError) throw new Error(readError.message);

    const { error } = await context.supabase
      .from("documents")
      .update({ views: (current?.views ?? 0) + 1 })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const askConciergeFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ question: z.string().trim().min(1).max(2000) }).parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { answer: fallbackAnswer(data.question), mode: "fallback" as const };
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Use only this context unless clearly labeling a recommendation.\n\n${conciergeContext}\n\nQuestion: ${data.question}`,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      return {
        answer: fallbackAnswer(data.question),
        mode: "fallback-after-provider-error" as const,
      };
    }

    const json = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const answer: string =
      json?.candidates?.[0]?.content?.parts?.[0]?.text || fallbackAnswer(data.question);
    return { answer, mode: "gemini" as const };
  });
