import { useEffect, useMemo, useState } from "react";
import Card from "./Card";
import Input from "./Input";
import Button from "./Button";
import { fetchRoles } from "../lib/api";

export default function RoleSelect({ value, onChange }) {
  const [roles, setRoles] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("dropdown"); // dropdown | custom

  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true);
      try {
        const r = await fetchRoles();
        if (live) setRoles(r.roles || []);
      } catch {
        if (live) setRoles([]);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return roles;
    return roles.filter((r) => r.toLowerCase().includes(s));
  }, [roles, q]);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium">Target Job Role</div>
          <div className="text-xs text-muted mt-1">
            Choose from dataset roles to avoid typos.
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={mode === "dropdown" ? "primary" : "ghost"}
            className="px-3 py-1.5 text-xs"
            onClick={() => setMode("dropdown")}
            type="button"
          >
            Dropdown
          </Button>
          <Button
            variant={mode === "custom" ? "primary" : "ghost"}
            className="px-3 py-1.5 text-xs"
            onClick={() => setMode("custom")}
            type="button"
          >
            Custom
          </Button>
        </div>
      </div>

      {mode === "custom" ? (
        <div className="mt-4">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter job role (custom)..."
          />
          <div className="text-xs text-muted mt-2">
            Custom roles work only if your backend supports them.
          </div>
        </div>
      ) : (
        <>
          <div className="mt-4">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={loading ? "Loading roles..." : "Search roles..."}
            />
          </div>

          <div className="mt-3 max-h-[220px] overflow-auto rounded-2xl border border-border bg-[rgba(255,255,255,0.03)]">
            {loading ? (
              <div className="p-4 text-sm text-muted">Loading roles…</div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-sm text-muted">No roles found.</div>
            ) : (
              filtered.map((r) => {
                const active = r === value;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => onChange(r)}
                    className={
                      "w-full text-left px-4 py-3 text-sm border-b border-border/60 last:border-b-0 " +
                      "transition " +
                      (active
                        ? "bg-[rgba(32,211,194,0.12)] text-text"
                        : "hover:bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.82)]")
                    }
                  >
                    {r}
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-3 text-xs text-muted">
            Selected: <span className="text-[rgba(32,211,194,0.95)]">{value || "—"}</span>
          </div>
        </>
      )}
    </Card>
  );
}