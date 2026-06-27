export type PlatformCapability = {
  id: string;
  category: string;
  name: string;
  status: "Live" | "Scaffolded" | "Next" | "Provider required";
  benefit: string;
  nextStep: string;
};

export const platformCapabilities: PlatformCapability[] = [
  {
    id: "vdr-storage",
    category: "Virtual Data Room",
    name: "Private file storage and metadata",
    status: "Scaffolded",
    benefit: "Moves InvestorOS from markdown placeholders toward real investor files.",
    nextStep:
      "Apply upload schema, create the private storage bucket, and enable signed download URLs.",
  },
  {
    id: "signed-downloads",
    category: "Virtual Data Room",
    name: "Signed downloads and expiring access",
    status: "Next",
    benefit: "Prevents uncontrolled sharing and supports investor-specific access windows.",
    nextStep: "Add server function that generates signed URLs from document_files rows.",
  },
  {
    id: "document-preview",
    category: "Virtual Data Room",
    name: "Document preview and version history",
    status: "Next",
    benefit: "Investors can inspect materials without downloading every file.",
    nextStep: "Add preview route and version list for document files.",
  },
  {
    id: "nda-gate",
    category: "Legal / Compliance",
    name: "NDA gate and acceptance ledger",
    status: "Scaffolded",
    benefit: "Locks sensitive diligence materials behind a recorded investor acceptance event.",
    nextStep: "Create NDA acceptance table and gate restricted routes until accepted.",
  },
  {
    id: "investor-invites",
    category: "Investor Portal",
    name: "Investor invitations",
    status: "Scaffolded",
    benefit: "Admin can create investor invite records and prepare role-based onboarding.",
    nextStep: "Add invite token route, email delivery, and accepted timestamp updates.",
  },
  {
    id: "crm-persistent",
    category: "Investor CRM",
    name: "Persistent CRM records",
    status: "Scaffolded",
    benefit:
      "Replaces static pipeline data with investors, firms, stages, notes, and next actions.",
    nextStep: "Wire investor contact tables into CRM CRUD screens.",
  },
  {
    id: "analytics-events",
    category: "Analytics",
    name: "Document event stream",
    status: "Scaffolded",
    benefit: "Creates the data foundation for engagement scoring and investor interest signals.",
    nextStep: "Record download, open, preview, and question events by investor.",
  },
  {
    id: "rag-docs",
    category: "AI Diligence",
    name: "Document-grounded RAG concierge",
    status: "Next",
    benefit:
      "Answers investor questions from uploaded files with citations and role-aware filtering.",
    nextStep: "Add document chunks, embeddings, ingestion jobs, and cited responses.",
  },
  {
    id: "financial-center",
    category: "Financial Center",
    name: "Raise tracker and commitment center",
    status: "Scaffolded",
    benefit: "Tracks target raise, soft-circled capital, commitments, and investor instruments.",
    nextStep: "Add fundraising round, commitment, and instrument tables plus UI.",
  },
  {
    id: "media-center",
    category: "Media Center",
    name: "Brand, press, and demo assets",
    status: "Scaffolded",
    benefit:
      "Makes logos, screenshots, demo videos, and press materials available in the investor room.",
    nextStep: "Create media asset records and upload workflow.",
  },
  {
    id: "github-live",
    category: "Engineering Intelligence",
    name: "Live GitHub activity feed",
    status: "Provider required",
    benefit: "Shows real commits, PRs, releases, CI, and deployment evidence.",
    nextStep: "Add GitHub API token and server-side adapter.",
  },
  {
    id: "product-sandbox-live",
    category: "Product Sandbox",
    name: "Live Discharge Bridge demo tenant",
    status: "Provider required",
    benefit:
      "Lets investors inspect the product workflow using synthetic referrals and safe demo data.",
    nextStep: "Embed or link a protected DCB demo tenant.",
  },
];
