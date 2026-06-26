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
};

export function getInvestorDocumentAsset(slug?: string | null) {
  if (!slug) return undefined;
  return investorDocumentAssets[slug];
}
