import Card from "./Card";
import Badge from "./Badge";

export default function RoadmapView({ roadmap = [] }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="font-medium">Personalized Roadmap</div>
        <Badge tone="gray">{roadmap.length} weeks</Badge>
      </div>
      <div className="text-xs text-muted mt-1">Weekly skill focus, free resources, and a mini project.</div>

      <div className="mt-4 space-y-3">
        {roadmap.length === 0 ? (
          <div className="text-sm text-muted">No roadmap yet. Run an analysis first.</div>
        ) : (
          roadmap.map((w) => (
            <div key={w.week} className="rounded-2xl border border-border bg-[rgba(255,255,255,0.03)] p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Week {w.week}</div>
                <Badge tone="teal">{(w.focus_skills || []).join(", ")}</Badge>
              </div>

              <div className="mt-3 text-sm">
                <div className="text-xs text-muted">Resources</div>
                <ul className="mt-1 list-disc pl-5 text-[rgba(255,255,255,0.85)]">
                  {(w.resources || []).map((r, i) => (
                    <li key={i}>
                      <a className="text-teal hover:underline" href={r.url} target="_blank" rel="noreferrer">
                        {r.title}
                      </a>{" "}
                      <span className="text-xs text-muted">({r.type})</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3">
                <div className="text-xs text-muted">Mini project</div>
                <div className="text-sm mt-1 text-[rgba(255,255,255,0.86)]">{w.mini_project}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}