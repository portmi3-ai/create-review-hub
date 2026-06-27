export const automationQueue = [
  { name: "Investor follow-up reminder", status: "Next", trigger: "High-value document viewed" },
  { name: "Monthly investor update", status: "Next", trigger: "Calendar month close" },
  { name: "Diligence request reminder", status: "Next", trigger: "Due date approaching" },
  { name: "Investor activity alert", status: "Next", trigger: "Engagement score threshold" },
];

export const integrationBacklog = [
  { provider: "Supabase Storage", status: "Next", purpose: "Private file storage and signed downloads" },
  { provider: "Gemini / Vertex AI", status: "Partial", purpose: "Concierge and document-grounded AI" },
  { provider: "GitHub", status: "Next", purpose: "Live engineering and deployment evidence" },
  { provider: "Google Calendar", status: "Next", purpose: "Investor meeting history and reminders" },
  { provider: "Gmail / Resend", status: "Next", purpose: "Invite and update delivery" },
  { provider: "DocuSign", status: "Optional", purpose: "Formal NDA e-signature" },
];
