import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Trash2 } from "lucide-react";
import {
  createDocument,
  deleteDocument,
  getInvestorRoom,
  updateDocument,
} from "@/lib/investor-room.functions";

export const Route = createFileRoute("/_authenticated/documents")({
  head: () => ({ meta: [{ title: "Documents — InvestorOS Admin" }] }),
  component: AdminDocsPage,
});

type AccessLevel = "NDA" | "Restricted" | "Public";

const empty = {
  title: "",
  type: "Deck",
  status: "Draft",
  access: "NDA" as AccessLevel,
  owner: "",
  version: "v0.1",
};

function AdminDocsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const roomQuery = useQuery({
    queryKey: ["investor-room"],
    queryFn: () => getInvestorRoom(),
    retry: false,
  });

  const isAdmin = roomQuery.data?.role === "admin";

  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey: ["investor-room"] });
  }

  async function submitNew(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createDocument({ data: form });
      setForm(empty);
      await invalidate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create");
    }
  }

  async function patchAccess(id: string, access: AccessLevel) {
    setError(null);
    try {
      await updateDocument({ data: { id, access } });
      await invalidate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    }
  }

  async function patchStatus(id: string, status: string) {
    setError(null);
    try {
      await updateDocument({ data: { id, status } });
      await invalidate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this document?")) return;
    setError(null);
    try {
      await deleteDocument({ data: { id } });
      await invalidate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  if (roomQuery.data && !isAdmin) {
    return (
      <main>
        <section className="panel">
          <h2>Admin only</h2>
          <p>You don't have permission to manage documents.</p>
          <button onClick={() => navigate({ to: "/" })}>Back to room</button>
        </section>
      </main>
    );
  }

  const docs = roomQuery.data?.documents ?? [];

  return (
    <main>
      <section className="topbar">
        <div>
          <p className="eyebrow">Administration</p>
          <h1 style={{ fontSize: 36 }}>Documents</h1>
        </div>
        <div className="topbar-actions">
          <button className="ghost-btn" onClick={() => navigate({ to: "/admin" })}>
            User access
          </button>
          <button className="ghost-btn" onClick={() => navigate({ to: "/" })}>
            Back to room
          </button>
        </div>
      </section>

      {error && <div className="answer" style={{ borderColor: "#ef4444" }}>{error}</div>}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">New entry</p>
            <h2>Add document</h2>
          </div>
          <FileText size={20} />
        </div>
        <form className="concierge" onSubmit={submitNew} style={{ display: "grid", gap: 8 }}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            <input
              placeholder="Type (Deck, Memo, …)"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              required
            />
            <input
              placeholder="Status (Draft, Ready, …)"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              required
            />
            <select
              value={form.access}
              onChange={(e) => setForm({ ...form, access: e.target.value as AccessLevel })}
            >
              <option value="NDA">NDA (investors can see)</option>
              <option value="Restricted">Restricted (admin only)</option>
              <option value="Public">Public</option>
            </select>
            <input
              placeholder="Owner"
              value={form.owner}
              onChange={(e) => setForm({ ...form, owner: e.target.value })}
            />
            <input
              placeholder="Version"
              value={form.version}
              onChange={(e) => setForm({ ...form, version: e.target.value })}
            />
          </div>
          <button type="submit">Add document</button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Library</p>
            <h2>All documents ({docs.length})</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Access</th>
                <th>Status</th>
                <th>Views</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.title}</strong>
                    <br />
                    <small>{d.owner ?? "—"} · {d.version ?? "—"}</small>
                  </td>
                  <td>{d.type}</td>
                  <td>
                    <select
                      value={d.access}
                      onChange={(e) => patchAccess(d.id, e.target.value as AccessLevel)}
                    >
                      <option value="NDA">NDA</option>
                      <option value="Restricted">Restricted</option>
                      <option value="Public">Public</option>
                    </select>
                  </td>
                  <td>
                    <input
                      defaultValue={d.status}
                      onBlur={(e) => {
                        if (e.target.value !== d.status) patchStatus(d.id, e.target.value);
                      }}
                    />
                  </td>
                  <td>{d.views}</td>
                  <td>
                    <button className="ghost-btn" onClick={() => remove(d.id)} aria-label="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {roomQuery.isLoading && (
                <tr><td colSpan={6}><small>Loading…</small></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
