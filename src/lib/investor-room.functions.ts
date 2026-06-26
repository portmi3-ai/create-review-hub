import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  activity,
  companyProfile,
  investors,
  metrics,
  roadmap,
} from "@/data/seed";
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

    // Investors: NDA-access documents only, no analytics, no CRM, no audit.
    const visibleDocs = (isAdmin
      ? documents
      : documents.filter((d) => d.access === "NDA")
    ).map((d) => ({
      ...d,
      risk: classifyDocumentRisk(d.status, d.access),
    }));

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

export const askConciergeFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({ question: z.string().trim().min(1).max(2000) })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { answer: fallbackAnswer(data.question), mode: "fallback" as const };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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

    const json: any = await response.json();
    const answer: string =
      json?.candidates?.[0]?.content?.parts?.[0]?.text || fallbackAnswer(data.question);
    return { answer, mode: "gemini" as const };
  });
