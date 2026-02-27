import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import Gauge from "../components/Gauge";
import GapBarChart from "../components/GapBarChart";
import Card from "../components/Card";
import Badge from "../components/Badge";
import RoadmapView from "../components/RoadmapView";
import Explainability from "../components/Explainability";
import { getHistoryItem } from "../lib/api";

export default function Report() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const r = await getHistoryItem(id);
        if (live) setData(r);
      } catch (e) {
        if (live) setErr(String(e.message || e));
      }
    })();
    return () => { live = false; };
  }, [id]);

  if (err) return <div className="text-sm">{err}</div>;
  if (!data) return <div className="text-sm text-muted">Loading report...</div>;

  return (
    <div>
      <TopBar
        title="Analysis Report"
        subtitle={`Role: ${data.job_role} • Mode: ${data.input_mode}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="space-y-5">
          <Gauge score={data.readiness_score} />
          <GapBarChart gaps={data.gaps} />

          <Card className="p-4">
            <div className="font-medium">Top 2 Career Recommendations</div>
            <div className="text-xs text-muted mt-1">Based on cosine similarity of skill vectors.</div>

            <div className="mt-4 space-y-3">
              {(data.recommendations || []).map((r, i) => (
                <div key={i} className="rounded-2xl border border-border bg-[rgba(255,255,255,0.03)] p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.role}</div>
                    <Badge tone="teal">{r.similarity_pct}%</Badge>
                  </div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-[rgba(255,255,255,0.82)]">
                    {(r.why || []).map((w, j) => <li key={j}>{w}</li>)}
                  </ul>
                </div>
              ))}
              {(data.recommendations || []).length === 0 ? (
                <div className="text-sm text-muted">No recommendations available.</div>
              ) : null}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <Card className="p-4">
            <div className="font-medium">Skill-by-skill Breakdown</div>
            <div className="text-xs text-muted mt-1">Required level, your level, gap, score, contribution.</div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted">
                  <tr className="border-b border-border">
                    <th className="text-left py-2">Skill</th>
                    <th className="text-left py-2">Required</th>
                    <th className="text-left py-2">Yours</th>
                    <th className="text-left py-2">Gap</th>
                    <th className="text-left py-2">Score</th>
                    <th className="text-left py-2">Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.breakdown || []).map((b, i) => (
                    <tr key={i} className="border-b border-border/60">
                      <td className="py-2">{b.skill}</td>
                      <td className="py-2">{b.required_level}</td>
                      <td className="py-2">{b.user_level}</td>
                      <td className="py-2">{b.gap}</td>
                      <td className="py-2">{b.skill_score}%</td>
                      <td className="py-2">{b.contribution_pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <RoadmapView roadmap={data.roadmap} />
          <Explainability explainability={data.explainability} breakdown={data.breakdown} />
        </div>
      </div>
    </div>
  );
}