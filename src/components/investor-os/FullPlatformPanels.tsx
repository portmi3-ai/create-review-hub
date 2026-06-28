import {
  Boxes,
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  Landmark,
  PlugZap,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { platformCapabilities } from "@/data/platform-capabilities";
import { commitmentPipeline, financialCenter } from "@/data/financial-center";
import { complianceCenter, mediaAssets } from "@/data/media-compliance";
import { automationQueue, integrationBacklog } from "@/data/integration-automation";

function statusClass(status: string) {
  if (status === "Live" || status === "Ready") return "admin";
  if (status === "Scaffolded" || status === "Partial") return "investor";
  return "restricted";
}

export function FullPlatformPanels({ isAdmin }: { isAdmin: boolean }) {
  return (
    <>
      <section className="panel span-2">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Platform buildout</p>
            <h2>InvestorOS capability map</h2>
          </div>
          <Boxes size={20} />
        </div>
        <div className="roadmap">
          {platformCapabilities.map((capability) => (
            <article key={capability.id}>
              <CheckCircle2 size={18} />
              <div>
                <strong>{capability.name}</strong>
                <small>
                  {capability.category} ·{" "}
                  <span className={`role-pill ${statusClass(capability.status)}`}>
                    {capability.status}
                  </span>
                </small>
                <small>{capability.benefit}</small>
                {isAdmin && <small>Next: {capability.nextStep}</small>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Financial center</p>
            <h2>Raise tracker</h2>
          </div>
          <Landmark size={20} />
        </div>
        <div className="stack">
          <article className="metric-card">
            <span>Round</span>
            <strong>{financialCenter.activeRound}</strong>
            <small>{financialCenter.runwayTarget}</small>
          </article>
          <article className="metric-card">
            <span>Target</span>
            <strong>{financialCenter.target}</strong>
            <small>Committed: {financialCenter.committed}</small>
          </article>
          {isAdmin &&
            commitmentPipeline.map((item) => (
              <article className="activity" key={item.investor}>
                <strong>{item.investor}</strong>
                <small>
                  {item.amount} · {item.stage} · {item.probability}
                </small>
              </article>
            ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Compliance center</p>
            <h2>Security evidence</h2>
          </div>
          <ShieldCheck size={20} />
        </div>
        <div className="roadmap">
          {complianceCenter.map((item) => (
            <article key={item.item}>
              <FileCheck2 size={18} />
              <div>
                <strong>{item.item}</strong>
                <small>
                  {item.status} · {item.evidence}
                </small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Media center</p>
            <h2>Brand and demo assets</h2>
          </div>
          <BriefcaseBusiness size={20} />
        </div>
        <div className="stack">
          {mediaAssets.map((asset) => (
            <article className="investor" key={asset.name}>
              <div>
                <strong>{asset.name}</strong>
                <small>
                  {asset.type} · {asset.usage}
                </small>
              </div>
              <span>{asset.status}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Automation</p>
            <h2>Workflow queue</h2>
          </div>
          <Radio size={20} />
        </div>
        <div className="roadmap">
          {automationQueue.map((item) => (
            <article key={item.name}>
              <Radio size={18} />
              <div>
                <strong>{item.name}</strong>
                <small>
                  {item.status} · {item.trigger}
                </small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Integrations</p>
            <h2>Provider adapters</h2>
          </div>
          <PlugZap size={20} />
        </div>
        <div className="stack">
          {integrationBacklog.map((item) => (
            <article className="investor" key={item.provider}>
              <div>
                <strong>{item.provider}</strong>
                <small>{item.purpose}</small>
              </div>
              <span>{item.status}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
