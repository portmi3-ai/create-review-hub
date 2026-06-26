import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  Activity,
  Bot,
  Building2,
  CheckCircle2,
  FileText,
  Gauge,
  GitPullRequest,
  Lock,
  LogOut,
  Shield,
  Users,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { askConcierge } from "@/lib/ai";
import { getInvestorRoom } from "@/lib/investor-room.functions";

const investorRoomQuery = {
  queryKey: ["investor-room"] as const,
  queryFn: () => getInvestorRoom(),
};

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "InvestorOS — Discharge Bridge Investor Room" },
      {
        name: "description",
        content: "Authenticated investor room: VDR, CRM, analytics, and AI diligence concierge.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(investorRoomQuery),
  component: InvestorRoomPage,
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

function InvestorRoomPage() {
  const { data } = useSuspenseQuery(investorRoomQuery);
  const router = useRouter();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isAdmin = data.role === "admin";

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main>
      <section className="topbar">
        <div>
          <p className="eyebrow">Signed in as {data.profile?.display_name ?? "Investor"}</p>
          <small>
            {data.profile?.firm ?? "—"} ·{" "}
            <span className={`role-pill ${data.role}`}>{data.role}</span>
          </small>
        </div>
        <div className="topbar-actions">
          {isAdmin && (
            <>
              <Link to="/documents" className="ghost-btn">
                <FileText size={16} /> Documents
              </Link>
              <Link to="/admin" className="ghost-btn">
                <Shield size={16} /> Admin
              </Link>
            </>
          )}
          <button className="ghost-btn" onClick={handleSignOut}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </section>

      <section className="hero">
        <div>
          <p className="eyebrow">InvestorOS</p>
          <h1>{data.companyProfile.productName} Investor Room</h1>
          <p>{data.companyProfile.positioning}</p>
          <div className="badges">
            <span>{data.companyProfile.legalName}</span>
            <span>{data.companyProfile.raise}</span>
            <span>{data.companyProfile.stage}</span>
          </div>
        </div>
        <div className="hero-card">
          <Building2 size={30} />
          <strong>{data.companyProfile.tagline}</strong>
          <small>
            {isAdmin
              ? "Admin view · full VDR · CRM · analytics · audit"
              : "Investor view · NDA-tier documents · roadmap · AI concierge"}
          </small>
        </div>
      </section>

      {isAdmin && data.metrics.length > 0 && (
        <section className="metrics">
          {data.metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>
      )}

      <section className="grid">
        <DataRoom docs={data.documents} isAdmin={isAdmin} />
        {isAdmin && <InvestorCRM investors={data.investors} />}
        {isAdmin && data.analytics.length > 0 && <AnalyticsPanel analytics={data.analytics} />}
        <Concierge />
        <RoadmapPanel roadmap={data.roadmap} />
        {isAdmin && data.activity.length > 0 && <ActivityFeed activity={data.activity} />}
      </section>

      <footer>
        <FileText size={16} /> InvestorOS — role-gated VDR, CRM, analytics and AI diligence
        concierge.
      </footer>
    </main>
  );
}

type RoomData = Awaited<ReturnType<typeof getInvestorRoom>>;

function DataRoom({ docs, isAdmin }: { docs: RoomData["documents"]; isAdmin: boolean }) {
  return (
    <section className="panel span-2">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Virtual Data Room</p>
          <h2>{isAdmin ? "Controlled diligence library" : "NDA-tier documents"}</h2>
        </div>
        <Lock size={20} />
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Document</th>
              <th>Type</th>
              <th>Access</th>
              <th>Status</th>
              {isAdmin && <th>Views</th>}
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <strong>{doc.title}</strong>
                  <br />
                  <small>
                    {doc.owner} · {doc.version}
                  </small>
                </td>
                <td>{doc.type}</td>
                <td>{doc.access}</td>
                <td>{doc.status}</td>
                {isAdmin && <td>{doc.views}</td>}
                <td>
                  <span className={`risk ${doc.risk}`}>{doc.risk}</span>
                </td>
              </tr>
            ))}
            {docs.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 6 : 5}>
                  <small>No documents available to your role.</small>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InvestorCRM({ investors }: { investors: RoomData["investors"] }) {
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
        {investors.map((investor) => (
          <article className="investor" key={investor.name}>
            <div>
              <strong>{investor.name}</strong>
              <small>
                {investor.firm} · {investor.interest}
              </small>
            </div>
            <span>{investor.priority}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function AnalyticsPanel({ analytics }: { analytics: RoomData["analytics"] }) {
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
          <BarChart data={analytics}>
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
  const [question, setQuestion] = useState(
    "Explain Discharge Bridge in investor diligence language.",
  );
  const [answer, setAnswer] = useState(
    "Ask a diligence question. Answers are generated server-side and fall back to a grounded summary when no AI key is configured.",
  );
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      setAnswer(await askConcierge(question));
    } catch (error) {
      setAnswer(error instanceof Error ? error.message : "Unable to reach concierge.");
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
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} />
        <button onClick={submit} disabled={loading}>
          {loading ? "Analyzing…" : "Ask Concierge"}
        </button>
      </div>
      <div className="answer">{answer}</div>
    </section>
  );
}

function RoadmapPanel({ roadmap }: { roadmap: RoomData["roadmap"] }) {
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
            <div>
              <strong>{row.item}</strong>
              <small>
                {row.state} · {row.owner}
              </small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ActivityFeed({ activity }: { activity: RoomData["activity"] }) {
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

// Avoid unused import warnings if memoization comes back.
void useMemo;
