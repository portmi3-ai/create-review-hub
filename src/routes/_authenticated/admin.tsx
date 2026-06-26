import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { listAdminUsers, setUserRole } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — InvestorOS" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => listAdminUsers(),
    retry: false,
  });

  async function toggle(targetUserId: string, role: "admin" | "investor", enabled: boolean) {
    setError(null);
    try {
      await setUserRole({ data: { targetUserId, role, enabled } });
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      await queryClient.invalidateQueries({ queryKey: ["investor-room"] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update role");
    }
  }

  if (usersQuery.isError) {
    return (
      <main>
        <section className="panel">
          <h2>Admin only</h2>
          <p>{(usersQuery.error as Error).message}</p>
          <button onClick={() => navigate({ to: "/" })}>Back to room</button>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="topbar">
        <div>
          <p className="eyebrow">Administration</p>
          <h1 style={{ fontSize: 36 }}>User access</h1>
        </div>
        <div className="topbar-actions">
          <button className="ghost-btn" onClick={() => navigate({ to: "/" })}>
            Back to room
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Roles</p>
            <h2>All users</h2>
          </div>
          <ShieldCheck size={20} />
        </div>
        {error && (
          <div className="answer" style={{ borderColor: "#ef4444" }}>
            {error}
          </div>
        )}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Firm</th>
                <th>Investor</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {(usersQuery.data ?? []).map((u) => {
                const isInvestor = u.roles.includes("investor");
                const isAdmin = u.roles.includes("admin");
                return (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.display_name ?? "—"}</strong>
                    </td>
                    <td>
                      <small>{u.email}</small>
                    </td>
                    <td>
                      <small>{u.firm ?? "—"}</small>
                    </td>
                    <td>
                      <label className="role-toggle">
                        <input
                          type="checkbox"
                          checked={isInvestor}
                          onChange={(e) => toggle(u.id, "investor", e.target.checked)}
                        />
                      </label>
                    </td>
                    <td>
                      <label className="role-toggle">
                        <input
                          type="checkbox"
                          checked={isAdmin}
                          onChange={(e) => toggle(u.id, "admin", e.target.checked)}
                        />
                      </label>
                    </td>
                  </tr>
                );
              })}
              {usersQuery.isLoading && (
                <tr>
                  <td colSpan={5}>
                    <small>Loading…</small>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
