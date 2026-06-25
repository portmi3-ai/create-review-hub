export const companyProfile = {
  legalName: 'Mport Media Technologies, Inc.',
  productName: 'Discharge Bridge',
  tagline: 'Governance-aware discharge orchestration for hospital-to-SNF transitions.',
  raise: '$1.5M Seed',
  runway: '18 months target',
  stage: 'Pilot-ready / enterprise validation',
  positioning: 'AI-native healthcare interoperability infrastructure with deterministic workflows and advisory AI.'
};

export const metrics = [
  { label: 'Current Raise', value: '$1.5M', delta: 'Target' },
  { label: 'Committed / Soft Circled', value: '$0', delta: 'Update after investor calls' },
  { label: 'Pilot Pipeline', value: '8', delta: 'Hospitals / innovation orgs' },
  { label: 'SNF Registry', value: '17k+', delta: 'CMS import-ready' },
  { label: 'Hospital Registry', value: '9k+', delta: 'CMS import-ready' },
  { label: 'Validated Smoke Tests', value: '13/13', delta: 'Production parity milestone' }
];

export const documents = [
  { id: 'deck', title: 'Investor Pitch Deck', type: 'Deck', status: 'Ready', access: 'NDA', views: 42, owner: 'Founder', version: 'v1.0' },
  { id: 'memo', title: 'Investment Memo', type: 'Memo', status: 'Draft', access: 'NDA', views: 17, owner: 'Founder', version: 'v0.8' },
  { id: 'model', title: 'Financial Model', type: 'Spreadsheet', status: 'Needs update', access: 'Restricted', views: 9, owner: 'Finance', version: 'v0.4' },
  { id: 'patent', title: 'Patent Receipt + Summary', type: 'Legal', status: 'Ready', access: 'Restricted', views: 13, owner: 'Legal', version: 'v1.0' },
  { id: 'security', title: 'HIPAA Alignment + SOC 2 Roadmap', type: 'Security', status: 'Ready', access: 'NDA', views: 22, owner: 'Architecture', version: 'v1.0' },
  { id: 'product', title: 'Product Architecture', type: 'Technical', status: 'Ready', access: 'NDA', views: 29, owner: 'Architecture', version: 'v1.2' }
];

export const investors = [
  { name: 'Healthcare AI Angel', firm: 'Independent', stage: 'Intro', score: 91, lastTouch: '2026-06-20', interest: 'Healthcare SaaS' },
  { name: 'Digital Health Fund', firm: 'Seed Fund', stage: 'Diligence', score: 88, lastTouch: '2026-06-18', interest: 'Care coordination' },
  { name: 'Strategic Hospital Partner', firm: 'Innovation Office', stage: 'Pilot Review', score: 84, lastTouch: '2026-06-14', interest: 'LOS reduction' },
  { name: 'Operator Angel', firm: 'Former payer executive', stage: 'Follow-up', score: 79, lastTouch: '2026-06-11', interest: 'Prior auth automation' }
];

export const roadmap = [
  { item: 'Papermark-style secure VDR', state: 'Implemented MVP', owner: 'InvestorOS' },
  { item: 'DocSend-style engagement analytics', state: 'Implemented MVP', owner: 'InvestorOS' },
  { item: 'Visible-style investor CRM', state: 'Implemented MVP', owner: 'InvestorOS' },
  { item: 'FirmRoom-style diligence checklist', state: 'Implemented MVP', owner: 'InvestorOS' },
  { item: 'AI diligence concierge', state: 'Server function wired', owner: 'AgentEcos' },
  { item: 'Live GitHub/deployment feed', state: 'Adapter placeholder', owner: 'GitHub' },
  { item: 'Firebase/Auth0 investor accounts', state: 'Env-ready', owner: 'Auth' }
];

export const activity = [
  { event: 'Investor viewed Product Architecture', detail: '12m 42s reading time', time: 'Today' },
  { event: 'Question asked', detail: 'How does deterministic SNF matching work?', time: 'Today' },
  { event: 'Document unlocked', detail: 'Patent Receipt + Summary', time: 'Yesterday' },
  { event: 'Follow-up recommended', detail: 'Send security roadmap and pilot validation summary', time: 'Yesterday' }
];
