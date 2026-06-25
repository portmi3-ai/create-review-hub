import { useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Activity, Bot, Building2, CheckCircle2, FileText, Gauge, GitPullRequest, Lock, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { activity, companyProfile, documents, investors, metrics, roadmap } from '@/data/seed';
import { askConcierge } from '@/lib/ai';
import { calculateInvestorPriority, classifyDocumentRisk } from '@/lib/scoring';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'InvestorOS — Discharge Bridge Investor Room' },
      { name: 'description', content: 'Secure investor room for Discharge Bridge by Mport Media Technologies — VDR, investor CRM, engagement analytics, and AI diligence concierge.' },
      { property: 'og:title', content: 'InvestorOS — Discharge Bridge Investor Room' },
      { property: 'og:description', content: 'VDR, investor CRM, analytics, and AI diligence concierge for Discharge Bridge.' },
    ],
  }),
  component: InvestorOS,
});

function MetricCard({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{delta}</small>
    </article>
  );
}

function DataRoom() {
  return (
    <section className="panel span-2">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Virtual Data Room</p>
          <h2>Controlled diligence library</h2>
        </div>
        <Lock size={20} />
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Document</th><th>Type</th><th>Access</th><th>Status</th><th>Views</th><th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td><strong>{doc.title}</strong><br /><small>{doc.owner} · {doc.version}</small></td>
                <td>{doc.type}</td>
                <td>{doc.access}</td>
                <td>{doc.status}</td>
                <td>{doc.views}</td>
                <td><span className={`risk ${classifyDocumentRisk(doc.status, doc.access)}`}>{classifyDocumentRisk(doc.status, doc.access)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InvestorCRM() {
  const ranked = useMemo(() => investors.map((investor) => ({
    ...investor,
    priority: calculateInvestorPriority(investor),
  })).sort((a, b) => b.priority - a.priority), []);

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Investor CRM</p>
          <h2>Pipeline priority</h2>
        </div>
        <Users size={20} />
      </div>
      <div className="stack">
        {ranked.map((investor) => (
          <article className="investor" key={investor.name}>
            <div>
              <strong>{investor.name}</strong>
              <small>{investor.firm} · {investor.interest}</small>
            </div>
            <span>{investor.priority}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function Analytics() {
  const chartData = documents.map((doc) => ({ name: doc.type, views: doc.views }));
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Engagement</p>
          <h2>Document intelligence</h2>
        </div>
        <Gauge size={20} />
      </div>
      <div className="chart">
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="views" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function Concierge() {
  const [question, setQuestion] = useState('Explain Discharge Bridge in investor diligence language.');
  const [answer, setAnswer] = useState('Ask a diligence question. The server function returns a grounded fallback answer locally and can use Gemini when GEMINI_API_KEY is set.');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      setAnswer(await askConcierge(question));
    } catch (error) {
      setAnswer(error instanceof Error ? error.message : 'Unable to reach concierge.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel span-2">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">AI Due Diligence</p>
          <h2>Investor concierge</h2>
        </div>
        <Bot size={20} />
      </div>
      <div className="concierge">
        <textarea value={question} onChange={(event) => setQuestion(event.target.value)} />
        <button onClick={submit} disabled={loading}>{loading ? 'Analyzing…' : 'Ask Concierge'}</button>
      </div>
      <div className="answer">{answer}</div>
    </section>
  );
}

function RoadmapPanel() {
  return (
    <section className="panel span-2">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Build Plan</p>
          <h2>Combined feature roadmap</h2>
        </div>
        <GitPullRequest size={20} />
      </div>
      <div className="roadmap">
        {roadmap.map((row) => (
          <article key={row.item}>
            <CheckCircle2 size={18} />
            <div><strong>{row.item}</strong><small>{row.state} · {row.owner}</small></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ActivityFeed() {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Audit Trail</p>
          <h2>Recent investor activity</h2>
        </div>
        <Activity size={20} />
      </div>
      <div className="stack">
        {activity.map((item) => (
          <article className="activity" key={item.event + item.time}>
            <strong>{item.event}</strong>
            <small>{item.detail}</small>
            <em>{item.time}</em>
          </article>
        ))}
      </div>
    </section>
  );
}

function InvestorOS() {
  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">InvestorOS</p>
          <h1>{companyProfile.productName} Investor Room</h1>
          <p>{companyProfile.positioning}</p>
          <div className="badges">
            <span>{companyProfile.legalName}</span>
            <span>{companyProfile.raise}</span>
            <span>{companyProfile.stage}</span>
          </div>
        </div>
        <div className="hero-card">
          <Building2 size={30} />
          <strong>{companyProfile.tagline}</strong>
          <small>Server-ready · VDR · CRM · analytics · AI concierge</small>
        </div>
      </section>

      <section className="metrics">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </section>

      <section className="grid">
        <DataRoom />
        <InvestorCRM />
        <Analytics />
        <Concierge />
        <RoadmapPanel />
        <ActivityFeed />
      </section>

      <footer>
        <FileText size={16} /> InvestorOS combines DocSend-style analytics, Papermark-style VDR, Visible-style investor CRM, FirmRoom diligence structure, and AgentEcos AI workflows.
      </footer>
    </main>
  );
}
