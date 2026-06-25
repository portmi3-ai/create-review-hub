import { createFileRoute } from '@tanstack/react-router';

const context = `
Company: Discharge Bridge by Mport Media Technologies, Inc.
Positioning: Governance-aware healthcare discharge orchestration infrastructure for hospital-to-SNF transitions.
Core thesis: reduce avoidable inpatient days, manual discharge coordination, SNF placement friction, prior-auth readiness gaps, and medication handoff risk.
Platform: deterministic workflows, advisory AI, FHIR/HL7 alignment, Cloud Run services, Firebase/Firestore, Vertex AI-ready, AgentEcos orchestration, HIPAA-aligned posture, SOC 2 readiness roadmap.
Investor room modules: secure data room, investor CRM, engagement analytics, diligence checklist, AI concierge, product sandbox, GitHub/deployment feed, monthly investor updates.
Current status: pilot-ready enterprise validation, CMS facility registry imports, production smoke validation milestones, patent-pending automated entity placement/resource matching method.
`;

function fallbackAnswer(question: string) {
  return `Based on the current InvestorOS knowledge base:\n\n${context.trim()}\n\nInvestor diligence answer for: "${question}"\n\nDischarge Bridge should be presented as a healthcare infrastructure platform, not a lightweight workflow app. The investable wedge is hospital-to-SNF discharge orchestration, where delays create measurable financial and operational loss. The platform combines deterministic routing, facility matching, prior-auth readiness, medication coordination, auditability, and advisory AI. For diligence, emphasize pilot validation, security posture, integration path, patent-pending workflow intelligence, and the ability to expand from discharge coordination into broader healthcare orchestration infrastructure.`;
}

export const Route = createFileRoute('/api/concierge')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const question = (body as { question?: string })?.question;
          if (!question || typeof question !== 'string') {
            return new Response(JSON.stringify({ error: 'Question is required' }), {
              status: 400,
              headers: { 'content-type': 'application/json' },
            });
          }

          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey) {
            return Response.json({ answer: fallbackAnswer(question), mode: 'fallback' });
          }

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [
                      {
                        text: `Use only this context unless clearly labeling a recommendation.\n\n${context}\n\nQuestion: ${question}`,
                      },
                    ],
                  },
                ],
              }),
            }
          );

          if (!response.ok) {
            return Response.json({ answer: fallbackAnswer(question), mode: 'fallback-after-provider-error' });
          }

          const data: any = await response.json();
          const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || fallbackAnswer(question);
          return Response.json({ answer, mode: 'gemini' });
        } catch (error) {
          return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
            { status: 500, headers: { 'content-type': 'application/json' } }
          );
        }
      },
    },
  },
});
