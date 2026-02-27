import { useEffect, useMemo, useState } from "react";
import TopBar from "../components/TopBar";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import Button from "../components/Button";
import { listHistory } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Overview() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;

    (async () => {
      setLoading(true);
      setErr("");
      try {
        const r = await listHistory();
        if (!live) return;

        // Backend returns array directly
        setItems(Array.isArray(r) ? r : []);
      } catch (e) {
        if (!live) return;
        setItems([]);
        setErr(String(e?.message || e || "Failed to load history"));
      } finally {
        if (live) setLoading(false);
      }
    })();

    return () => {
      live = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const total = items.length;
    const roles = new Set(items.map((x) => x?.job_role).filter(Boolean)).size;

    const lastItem = items[0];
    const last = lastItem && Number.isFinite(Number(lastItem.readiness_score))
      ? Number(lastItem.readiness_score)
      : 0;

    return { total, roles, last };
  }, [items]);

  return (
    <div>
      <TopBar
        title="Dashboard Overview"
        subtitle="AI-powered insights into your career potential"
        right={<Button onClick={() => nav("/analyzer")}>New Analysis</Button>}
      />

      {err ? (
        <div className="mb-4 rounded-2xl border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] p-4 text-sm text-red-300">
          {err}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard
          label="Analyses Done"
          value={loading ? "—" : metrics.total}
          hint="Saved to history"
        />
        <StatCard
          label="Job Roles Analyzed"
          value={loading ? "—" : metrics.roles}
          hint="Unique roles"
        />
        <StatCard
          label="Latest Readiness"
          value={loading ? "—" : `${Math.round(metrics.last)}%`}
          hint="Most recent report"
        />
        <StatCard label="AI Confidence" value="—" hint="Optional metric" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <Card className="p-5 lg:col-span-2">
          <div className="font-medium">Quick Start</div>
          <div className="text-xs text-muted mt-1">
            Analyze any job role using resume or manual skills.
          </div>

          <div className="mt-4">
            <Button onClick={() => nav("/analyzer")}>Go to Analyzer</Button>
          </div>

          <div className="mt-6">
            <div className="text-sm font-medium">Recent Analyses</div>

            <div className="mt-3 space-y-2">
              {items.slice(0, 3).map((x) => (
                <button
                  key={x.id}
                  onClick={() => nav(`/report/${x.id}`)}
                  className="w-full text-left rounded-2xl border border-border bg-[rgba(255,255,255,0.03)] p-4 hover:bg-[rgba(255,255,255,0.05)] transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{x.job_role || "Unknown role"}</div>
                    <div className="text-sm text-[rgba(32,211,194,0.95)]">
                      {Number.isFinite(Number(x.readiness_score))
                        ? `${Math.round(Number(x.readiness_score))}%`
                        : "--"}
                    </div>
                  </div>

                  <div className="text-xs text-muted mt-1">
                    {x.created_at ? new Date(x.created_at).toLocaleString() : ""}
                  </div>
                </button>
              ))}

              {!loading && items.length === 0 ? (
                <div className="text-sm text-muted">No analyses yet.</div>
              ) : null}

              {loading ? (
                <div className="text-sm text-muted">Loading...</div>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="font-medium">Tips</div>
          <div className="text-xs text-muted mt-1">
            Run your first analysis in Analyzer. Results are saved automatically.
          </div>
          <div className="mt-4 rounded-2xl border border-border bg-[rgba(255,255,255,0.03)] p-4 text-sm text-[rgba(255,255,255,0.82)]">
            If you see blank screens again, open DevTools Console and paste the first red error.
          </div>
        </Card>
      </div>
    </div>
  );
}