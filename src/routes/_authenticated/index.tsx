import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  Activity,
  Bot,
  Building2,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  GitPullRequest,
  Lock,
  LogOut,
  Shield,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PlatformWorkspace } from "@/components/investor-os/PlatformWorkspace";
import { supabase } from "@/integrations/supabase/client";
import { askConcierge } from "@/lib/ai";
import { getInvestorRoom, trackDocumentView } from "@/lib/investor-room.functions";

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
            {data.profile?.firm ?? "—"} · <span className={`role-pill ${data.role}`}>{data.role}</span>
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
              : "Investor view · NDA-tier documents · roadmap · updates · AI concierge"}
          </small>
        </div>
      </section>

      {!isAdmin && (
        <section className="panel" style={{ marginBottom: 16 }}>
          <p className="eyebrow">Investor access</p>
          <h2>You are signed in as an investor</h2>
          <p>
            Investor accounts see Public/NDA documents, updates, roadmap, product sandbox milestones, engineering feed,
            and AI diligence. Admin-only CRM, full metrics, restricted documents, and data requests appear after your
            user is assigned the admin role in Supabase.
          </p>
        </section>
      )}

      {isAdmin && data.metrics.length > 0 && (
        <section className="metrics">
          {data.metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>
      )}

      <section className="grid">
        <DataRoom docs={data.documents} isAdmin={isAdmin} />
        <PlatformWorkspace data={data} isAdmin={isAdmin} />
        {isAdmin && data.analytics.length > 0 && <AnalyticsPanel analytics={data.analytics} />}
        <Concierge />
        <RoadmapPanel roadmap={data.roadmap} />
        {isAdmin && data.activity.length > 0 && <ActivityFeed activity={data.activity} />}
      </section>

      <footer>
        <FileText size={16} /> InvestorOS — role-gated VDR, CRM, analytics, updates, sandbox and AI diligence concierge.
      </footer>
    </main>
  );
}

type RoomData = Awaited<ReturnType<typeof getInvestorRoom>>;
type RoomDocument = RoomData["documents"][number];

function DataRoom({ docs, isAdmin }: { docs: RoomData["documents"]; isAdmin: boolean }) {
  const [selected, setSelected] = useState<RoomDocument | null>(docs[0] ?? null);
  const queryClient = useQueryClient();

  async function openDoc(doc: RoomDocument) {
    setSelected(doc);
    try {
      await trackDocumentView({ data: { id: doc.id } });
      await queryClient.invalidateQueries({ queryKey: ["investor-room"] });
    } catch {
      // Keep the document usable even if analytics tracking fails.
    }
  }

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
              <th>Action</th>
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
                  <button className="ghost-btn" onClick={() => openDoc(doc)}>
                    <ExternalLink size={15} /> View
                  </button>
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

      {selected && (
        <article className="answer" style={{ marginTop: 16 }}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Selected document</p>
              <h2>{selected.title}</h2>
            </div>
            {selected.downloadUrl && (
              <a className="ghost-btn" href={selected.downloadUrl} target="_blank" rel="noreferrer">
                <Download size={15} /> Download
              </a>
            )}
          </div>
          <p>{selected.summary}</p>
          {selected.content.length > 0 && (
            <div className="stack">
              {selected.content.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          )}
          {selected.checklist.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <strong>Diligence checklist</strong>
              <div className="roadmap" style={{ marginTop: 8 }}>
                {selected.checklist.map((item) => (
                  <article key={item}>
                    <CheckCircle2 size={18} />
                    <div>
                      <strong>{item}</strong>
                      <small>Ready for investor review</small>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </article>
      )}
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
  const [question, setQuestion] = useState("Explain Discharge Bridge in investor diligence language.");
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
