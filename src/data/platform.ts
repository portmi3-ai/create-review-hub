export const founderKpis = [
  { label: "Current raise", value: "$1.5M", status: "Seed target" },
  { label: "Runway target", value: "18 mo", status: "Post-close plan" },
  { label: "Pilot pipeline", value: "8", status: "Hospital / innovation orgs" },
  { label: "Validated checks", value: "13/13", status: "Production parity milestone" },
  { label: "SNF registry", value: "17k+", status: "CMS import-ready" },
  { label: "Hospital registry", value: "9k+", status: "CMS import-ready" },
];

export const dataRoomFolders = [
  { name: "Executive", count: 2, status: "Ready", description: "Deck, one-pager, investment memo" },
  { name: "Product", count: 2, status: "Ready", description: "Architecture and demo narrative" },
  { name: "Security", count: 1, status: "Ready", description: "HIPAA-aligned posture and SOC 2 roadmap" },
  { name: "Financial", count: 1, status: "Needs update", description: "Seed model placeholder awaiting final spreadsheet" },
  { name: "Legal / IP", count: 1, status: "Ready", description: "Patent-pending summary and receipt slot" },
];

export const diligenceRequests = [
  {
    title: "Upload final pitch deck PDF",
    owner: "Founder",
    priority: "High",
    state: "Open",
    due: "Before next investor send",
  },
  {
    title: "Replace financial model placeholder with spreadsheet export",
    owner: "Finance",
    priority: "High",
    state: "Open",
    due: "Before diligence",
  },
  {
    title: "Attach patent receipt and counsel-reviewed IP summary",
    owner: "Legal",
    priority: "Medium",
    state: "Open",
    due: "Before partner meeting",
  },
  {
    title: "Add demo video and product sandbox link",
    owner: "Product",
    priority: "High",
    state: "Open",
    due: "Demo day follow-up",
  },
];

export const investorPipeline = [
  { name: "Healthcare AI Angel", firm: "Independent", stage: "Intro", nextAction: "Send deck + memo", score: 91 },
  { name: "Digital Health Fund", firm: "Seed Fund", stage: "Diligence", nextAction: "Send security roadmap", score: 88 },
  { name: "Strategic Hospital Partner", firm: "Innovation Office", stage: "Pilot Review", nextAction: "Book product walkthrough", score: 84 },
  { name: "Operator Angel", firm: "Former payer executive", stage: "Follow-up", nextAction: "Send prior-auth narrative", score: 79 },
];

export const investorUpdates = [
  {
    title: "InvestorOS VDR wired",
    date: "2026-06-26",
    summary: "Interactive document viewing, downloads, checklists, and role-gated access are implemented.",
  },
  {
    title: "Deploy readiness passed",
    date: "2026-06-26",
    summary: "Typecheck, lint, tests, and build passed locally with CI workflow configured.",
  },
  {
    title: "Discharge Bridge production parity milestone",
    date: "2026-06-26",
    summary: "Smoke validation milestone remains part of investor diligence evidence.",
  },
];

export const githubFeed = [
  { repo: "create-review-hub", event: "InvestorOS document room wired", status: "Merged", ref: "PR #3" },
  { repo: "create-review-hub", event: "Deploy readiness finalized", status: "Merged", ref: "PR #2" },
  { repo: "discharge-bridge-media", event: "Production smoke tests", status: "Evidence", ref: "13/13" },
];

export const productSandbox = [
  { name: "Hospital portal walkthrough", status: "Planned", description: "Investor-safe demo tenant with synthetic referrals." },
  { name: "SNF matching workflow", status: "Planned", description: "Show matched facilities, readiness, and routing explanation." },
  { name: "Prior-auth readiness", status: "Planned", description: "Display documentation completeness and next steps." },
  { name: "Mission Control", status: "Planned", description: "Show operational command center and audit trail." },
];

export const fundraisingTasks = [
  { task: "Invite first investor users", owner: "Founder", state: "Next" },
  { task: "Promote founder account to admin", owner: "Supabase", state: "Required" },
  { task: "Upload final PDF and model exports", owner: "Founder", state: "Next" },
  { task: "Configure Netlify environment variables", owner: "Deployment", state: "Required" },
  { task: "Connect production Supabase project", owner: "Deployment", state: "Required" },
];
