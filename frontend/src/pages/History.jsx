import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Card from "../components/Card";
import Button from "../components/Button";
import { listHistory } from "../lib/api";

export default function History() {
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

        // Backend returns an array directly
        setItems(Array.isArray(r) ? r : []);
      } catch (e) {
        if (!live) return;
        setErr(String(e?.message || e));
        setItems([]);
      } finally {
        if (live) setLoading(false);
      }
    })();

    return () => {
      live = false;
    };
  }, []);

  return (
    <div>
      <TopBar title="History" subtitle="View and open your full analysis reports." />

      {err ? (
        <div className="mb-4 rounded-2xl border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] p-4 text-sm text-red-300">
          {err}
        </div>
      ) : null}

      <Card className="p-4">
        {loading ? (
          <div className="text-sm text-muted">Loading...</div>
        ) : (
          <div className="space-y-2">
            {items.map((x) => (
              <div
                key={x.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-[rgba(255,255,255,0.03)] p-4"
              >
                <div>
                  <div className="font-medium">{x.job_role}</div>
                  <div className="text-xs text-muted mt-1">
                    {x.created_at ? new Date(x.created_at).toLocaleString() : ""}
                    {x.input_mode ? ` • ${x.input_mode}` : ""}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-[rgba(32,211,194,0.95)] font-semibold">
                    {Number.isFinite(Number(x.readiness_score))
                      ? `${Math.round(Number(x.readiness_score))}%`
                      : "--"}
                  </div>

                  <Button variant="ghost" onClick={() => nav(`/report/${x.id}`)}>
                    Open
                  </Button>
                </div>
              </div>
            ))}

            {items.length === 0 ? (
              <div className="text-sm text-muted">No history yet.</div>
            ) : null}
          </div>
        )}
      </Card>
    </div>
  );
}