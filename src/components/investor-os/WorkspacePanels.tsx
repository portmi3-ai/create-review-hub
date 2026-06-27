import { Activity, Boxes, CalendarClock, CheckCircle2, ClipboardList, FolderKanban, GitPullRequest, PlaySquare, TrendingUp, Users } from "lucide-react";
import { getInvestorRoom } from "@/lib/investor-room.functions";

type RoomData = Awaited<ReturnType<typeof getInvestorRoom>>;

function Panel({ eyebrow, title, icon, children, span = false }: { eyebrow: string; title: string; icon: React.ReactNode; children: React.ReactNode; span?: boolean }) {
  return (
    <section className={`panel ${span ? "span-2" : ""}`}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        {icon}
      </div>
      {children}
    </section>
  );
}

export function FounderKpiPanel({ items }: { items: RoomData["founderKpis"] }) {
  return (
    <Panel eyebrow="Founder dashboard" title="Company operating signals" icon={<TrendingUp size={20} />} span>
      <div className="metrics" style={{ marginTop: 0 }}>
        {items.map((item) => (
          <article className="metric-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.status}</small>
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function DataRoomFoldersPanel({ folders }: { folders: RoomData["folders"] }) {
  return (
    <Panel eyebrow="Data room" title="Diligence folders" icon={<FolderKanban size={20} />}>
      <div className="stack">
        {folders.map((folder) => (
          <article className="investor" key={folder.name}>
            <div>
              <strong>{folder.name}</strong>
              <small>{folder.description}</small>
            </div>
            <span>{folder.count}</span>
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function DiligenceRequestsPanel({ requests }: { requests: RoomData["diligenceRequests"] }) {
  return (
    <Panel eyebrow="Diligence" title="Open data requests" icon={<ClipboardList size={20} />}>
      <div className="roadmap">
        {requests.map((request) => (
          <article key={request.title}>
            <CheckCircle2 size={18} />
            <div>
              <strong>{request.title}</strong>
              <small>{request.priority} · {request.owner} · {request.due}</small>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function InvestorPipelinePanel({ investors }: { investors: RoomData["investors"] }) {
  if (!investors.length) return null;
  return (
    <Panel eyebrow="Investor CRM" title="Pipeline and next actions" icon={<Users size={20} />} span>
      <div className="stack">
        {investors.map((investor) => (
          <article className="investor" key={investor.name}>
            <div>
              <strong>{investor.name}</strong>
              <small>{investor.firm} · {investor.stage} · {investor.nextAction}</small>
            </div>
            <span>{investor.score}</span>
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function InvestorUpdatesPanel({ updates }: { updates: RoomData["investorUpdates"] }) {
  return (
    <Panel eyebrow="Updates" title="Investor update feed" icon={<CalendarClock size={20} />}>
      <div className="stack">
        {updates.map((update) => (
          <article className="activity" key={update.title}>
            <strong>{update.title}</strong>
            <small>{update.summary}</small>
            <em>{update.date}</em>
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function GithubFeedPanel({ feed }: { feed: RoomData["githubFeed"] }) {
  return (
    <Panel eyebrow="Engineering" title="GitHub / release feed" icon={<GitPullRequest size={20} />}>
      <div className="roadmap">
        {feed.map((item) => (
          <article key={item.repo + item.ref}>
            <GitPullRequest size={18} />
            <div>
              <strong>{item.event}</strong>
              <small>{item.repo} · {item.status} · {item.ref}</small>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function ProductSandboxPanel({ items }: { items: RoomData["productSandbox"] }) {
  return (
    <Panel eyebrow="Product sandbox" title="Demo tenant buildout" icon={<PlaySquare size={20} />}>
      <div className="roadmap">
        {items.map((item) => (
          <article key={item.name}>
            <PlaySquare size={18} />
            <div>
              <strong>{item.name}</strong>
              <small>{item.status} · {item.description}</small>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function FundraisingTasksPanel({ tasks }: { tasks: RoomData["fundraisingTasks"] }) {
  return (
    <Panel eyebrow="Founder workspace" title="Fundraising tasks" icon={<Boxes size={20} />}>
      <div className="roadmap">
        {tasks.map((task) => (
          <article key={task.task}>
            <Activity size={18} />
            <div>
              <strong>{task.task}</strong>
              <small>{task.owner} · {task.state}</small>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
