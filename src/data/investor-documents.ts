export type InvestorDocumentAsset = {
  slug: string;
  title: string;
  summary: string;
  downloadUrl: string;
  content: string[];
  checklist: string[];
};

export const investorDocumentAssets: Record<string, InvestorDocumentAsset> = {
  "investor-pitch-deck": {
    slug: "investor-pitch-deck",
    title: "Investor Pitch Deck",
    summary:
      "Seed-stage investor narrative for Discharge Bridge: problem, market, product, traction, business model, and use of funds.",
    downloadUrl: "/docs/investor-pitch-deck.md",
    content: [
      "Discharge Bridge is governance-aware discharge orchestration infrastructure for hospital-to-SNF transitions.",
      "The wedge is avoidable inpatient days caused by manual post-acute placement, incomplete documentation, prior-auth readiness gaps, and medication handoff risk.",
      "The platform combines deterministic workflows, advisory AI, facility matching, documentation routing, medication coordination, and auditability.",
      "The investor thesis is that discharge orchestration can become a broader healthcare infrastructure layer across hospital, post-acute, payer, and care-transition workflows.",
    ],
    checklist: [
      "Review market pain and buyer urgency",
      "Confirm pilot/customer evidence",
      "Validate pricing assumptions",
      "Prepare founder follow-up questions",
    ],
  },
  "investment-memo": {
    slug: "investment-memo",
    title: "Investment Memo",
    summary:
      "Structured diligence memo covering thesis, customer, market, moat, risk, go-to-market, and near-term milestones.",
    downloadUrl: "/docs/investment-memo.md",
    content: [
      "Discharge Bridge should be evaluated as healthcare workflow infrastructure, not a lightweight case-management tool.",
      "The initial buyer is hospital operations and case management leadership that needs measurable reduction in discharge friction and avoidable length of stay.",
      "The moat comes from workflow data, facility network intelligence, governance-aware routing, integration depth, and patent-pending placement/resource matching logic.",
      "Primary diligence risks are integration timelines, enterprise sales cycles, pilot conversion, and proof of measurable operational ROI.",
    ],
    checklist: [
      "Confirm ICP and buyer path",
      "Map pilot milestones to revenue conversion",
      "Pressure-test competitive differentiation",
      "Review security and interoperability posture",
    ],
  },
  "financial-model": {
    slug: "financial-model",
    title: "Financial Model",
    summary:
      "Seed-stage planning model for per-bed, per-facility, pilot, and add-on revenue assumptions.",
    downloadUrl: "/docs/financial-model.md",
    content: [
      "The base model supports hospital pricing by licensed bed, post-acute facility participation, and enterprise add-ons.",
      "Initial revenue should be modeled around paid pilots, then converted into annualized SaaS contracts after operational validation.",
      "The highest-value expansion modules are prior-auth readiness, medication routing, SNF intelligence, and command-center analytics.",
      "The model should be updated after each pilot with actual implementation cost, sales-cycle duration, and measured discharge-time reduction.",
    ],
    checklist: [
      "Replace placeholder assumptions with actual pilot data",
      "Add customer acquisition cost assumptions",
      "Add gross margin by deployment model",
      "Separate pilot revenue from contracted ARR",
    ],
  },
  "patent-summary": {
    slug: "patent-summary",
    title: "Patent Receipt + Summary",
    summary:
      "Patent-pending summary for automated entity placement and resource matching logic relevant to discharge orchestration.",
    downloadUrl: "/docs/patent-summary.md",
    content: [
      "The provisional filing covers system and method concepts for automated entity placement and resource matching.",
      "For InvestorOS, this document should be positioned as IP support for matching, routing, readiness, and placement orchestration workflows.",
      "The claim posture should not be overstated; use patent-pending language and avoid implying granted protection.",
      "Investor diligence should focus on how the IP maps to product architecture, data advantage, and workflow defensibility.",
    ],
    checklist: [
      "Attach official receipt when available",
      "Add counsel-reviewed summary",
      "Map claims to product modules",
      "Avoid granted-patent language",
    ],
  },
  "security-roadmap": {
    slug: "security-roadmap",
    title: "HIPAA Alignment + SOC 2 Roadmap",
    summary:
      "Security posture summary covering HIPAA-aligned design, tenant separation, auditability, and SOC 2 readiness roadmap.",
    downloadUrl: "/docs/security-roadmap.md",
    content: [
      "Discharge Bridge should use HIPAA-aligned language unless/until formal certifications and agreements are complete.",
      "Current posture centers on role-based access, tenant scoping, audit logging, server-side secret isolation, and deterministic workflow controls.",
      "SOC 2 readiness should be presented as an active roadmap: policies, access reviews, logging, change management, incident response, and vendor inventory.",
      "Investor diligence should confirm that protected health information is not used in demos or investor environments.",
    ],
    checklist: [
      "Confirm no PHI in investor tenant",
      "Document access control model",
      "Prepare SOC 2 readiness checklist",
      "Add incident response and audit policy summaries",
    ],
  },
  "product-architecture": {
    slug: "product-architecture",
    title: "Product Architecture",
    summary:
      "High-level architecture for hospital intake, routing, SNF matching, prior-auth readiness, medication routing, and AI advisory services.",
    downloadUrl: "/docs/product-architecture.md",
    content: [
      "The architecture is modular: hospital intake, FHIR gateway, routing engine, SNF dispatcher, prior-auth engine, pharmacy/medication coordination, and mission-control analytics.",
      "AI should remain advisory, with deterministic workflows handling routing, status transitions, permissions, and audit-critical actions.",
      "Cloud Run, Firebase/Firestore, Vertex AI-ready services, and AgentEcos orchestration support scalable deployment and governance controls.",
      "The investor demo should show an end-to-end referral moving from readiness to matched SNF options and documentation handoff.",
    ],
    checklist: [
      "Add architecture diagram",
      "Map every service to business outcome",
      "Document integration assumptions",
      "Prepare product sandbox walkthrough",
    ],
  },
  "dcb-investor-summary": {
    slug: "dcb-investor-summary",
    title: "DCB Investor Summary",
    summary:
      "Investor-facing synthesis from the Discharge Bridge repo covering opportunity, product, market, business model, differentiation, traction, compliance, and use-of-funds framing.",
    downloadUrl: "/docs/dcb-investor-summary.md",
    content: [
      "Discharge Bridge is governed interoperability infrastructure for hospital-to-post-acute patient transitions.",
      "The current commercial scope is U.S. hospital-to-post-acute coordination, with a Michigan-first GTM sequence and national expansion path.",
      "Modeled pricing includes $30k-$50k pilots and $75k-$175k+ annual production licensing, scaled by bed count, discharge volume, and modules.",
      "Claims discipline remains explicit: SOC 2 readiness in progress, AI advisory only, deterministic systems own authoritative routing and state.",
    ],
    checklist: [
      "Replace TBD placeholders before external circulation",
      "Add founder/team/advisor section",
      "Attach signed LOIs or pilot evidence when available",
      "Align ask to $2M Seed use-of-funds plan",
    ],
  },
  "dcb-one-pager": {
    slug: "dcb-one-pager",
    title: "DCB One-Pager",
    summary:
      "Plain-language one-pager for investors and strategic partners explaining the hospital discharge problem, solution flow, architecture, and commercial model.",
    downloadUrl: "/docs/dcb-one-pager.md",
    content: [
      "Discharge Bridge automates hospital-to-post-acute transitions by connecting hospital EMRs, payer workflows, and SNF networks.",
      "The workflow moves from EMR referral to normalized clinical payload, structured insights, best-fit SNF options, bed verification, and secure portal execution.",
      "The platform is positioned as healthcare logistics infrastructure rather than a point solution.",
      "Commercial model: $30k-$50k pilots, $75k-$175k+ annual licensing, with pricing tied to discharge volume, bed count, and activated modules.",
    ],
    checklist: [
      "Use as first-send overview",
      "Confirm phrasing around minutes/days claims with pilot evidence",
      "Add logo and final PDF export",
      "Pair with investor summary in VDR",
    ],
  },
  "dcb-platform-overview": {
    slug: "dcb-platform-overview",
    title: "DCB Platform Overview",
    summary:
      "Technical and operating overview of the Discharge Bridge platform: Cloud Run services, Firestore multi-tenant data, Vertex AI, HL7/FHIR, portals, and compliance posture.",
    downloadUrl: "/docs/dcb-platform-overview.md",
    content: [
      "The production model connects hospital EMR systems to an interoperability layer, unified orchestrator API, routing/prior-auth/pharmacy/SNF services, Firestore, and role-scoped portals.",
      "The unified orchestrator coordinates inbound referrals, routing, service orchestration, workflow state, tenant isolation, and audit logging.",
      "Clinical intelligence uses Vertex AI for summarization, medication risk, SNF capability matching support, discharge readiness, and payer documentation preparation.",
      "Governance posture includes RBAC, customer data ownership, automated validation, retention controls, TLS, AES-256 at rest, IAM service isolation, and structured audit logging.",
    ],
    checklist: [
      "Use for technical investor diligence",
      "Add architecture diagram image/PDF",
      "Confirm current service list before circulation",
      "Keep AI advisory language consistent",
    ],
  },
  "dcb-pitch-outline": {
    slug: "dcb-pitch-outline",
    title: "DCB Fundable Pitch Outline",
    summary:
      "YC-style 10-12 slide structure for presenting Discharge Bridge clearly and fundably to investors.",
    downloadUrl: "/docs/dcb-pitch-outline.md",
    content: [
      "The deck should open with what the company does: replacing legacy discharge coordination with real-time routing infrastructure.",
      "Core product flow: Referral -> Match -> Rank -> Place.",
      "Positioning rule: avoid pitching as workflow software or an AI tool; frame as deterministic hospital-to-SNF routing infrastructure.",
      "Ask slide should map $2M Seed capital to milestones and what will be true in 18-24 months.",
    ],
    checklist: [
      "Convert to final pitch deck slides",
      "Use simple layman language for demo day",
      "Keep problem and solution up front",
      "Tie ask to measurable pilot milestones",
    ],
  },
  "dcb-gtm-system": {
    slug: "dcb-gtm-system",
    title: "DCB Hospital + SNF GTM System",
    summary:
      "Go-to-market operating model for hospital and SNF rollout using content, demos, pilots, and local network effects.",
    downloadUrl: "/docs/dcb-gtm-system.md",
    content: [
      "GTM loop: content feeds pipeline, pipeline feeds demos, demos feed pilots.",
      "Hospital targets include directors of case management, throughput leaders, discharge operations, and executive sponsors.",
      "SNF message: Discharge Bridge brings real-time hospital referrals, faster fills, and inbound consistency.",
      "Network effect: one hospital plus five SNFs creates local routing density that can expand from local to regional to national.",
    ],
    checklist: [
      "Add CRM fields for hospital/SNF prospect tracking",
      "Connect GTM tasks to investor updates",
      "Track demo-to-pilot conversion",
      "Create Michigan-first rollout dashboard",
    ],
  },
  "dcb-global-blueprint": {
    slug: "dcb-global-blueprint",
    title: "DCB Global Infrastructure Blueprint",
    summary:
      "Long-range infrastructure thesis for expanding Discharge Bridge from a regional discharge platform into a multi-region healthcare transition network.",
    downloadUrl: "/docs/dcb-global-blueprint.md",
    content: [
      "Global scale expands through interoperability, clinical intelligence, healthcare logistics, and global network infrastructure layers.",
      "The platform can evolve into a routing layer across hospitals, SNFs, behavioral health, military healthcare, corrections, home health, and hospice.",
      "Long-term architecture includes regional orchestrator clusters, facility network graph intelligence, analytics, forecasting, and healthcare transition network effects.",
      "The long-term vision positions Discharge Bridge as an operating system for healthcare transitions across hospitals, post-acute providers, payers, and care networks.",
    ],
    checklist: [
      "Label as roadmap / target-state",
      "Separate current capabilities from future architecture",
      "Use for strategic investor discussions",
      "Avoid implying global deployment is current state",
    ],
  },
  "dcb-pricing-offers": {
    slug: "dcb-pricing-offers",
    title: "DCB Pricing + Offer Stack",
    summary:
      "Pricing and packaging source document covering pilot offer, production licensing, expansion paths, and proof requirements.",
    downloadUrl: "/docs/dcb-pricing-offers.md",
    content: [
      "Entry offer: $30k-$50k per hospital pilot over 60-120 days to prove throughput, placement speed, and operational fit.",
      "Core production license: $75k-$175k+ annually, scaled by hospital bed count, annual discharge volume, and activated modules.",
      "Expansion paths include multi-facility rollout, analytics, benchmarking, behavioral health, home health, and payer integrations.",
      "Proof requirements include baseline metrics, midpoint pilot readout, final outcomes, and expansion recommendation.",
    ],
    checklist: [
      "Keep list pricing and negotiated pricing separate",
      "Tie pricing to measurable outcomes",
      "Add pilot scorecard template",
      "Update financial model assumptions",
    ],
  },
};

export function getInvestorDocumentAsset(slug?: string | null) {
  if (!slug) return undefined;
  return investorDocumentAssets[slug];
}
