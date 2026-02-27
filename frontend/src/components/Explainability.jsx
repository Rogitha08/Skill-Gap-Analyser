import Card from "./Card";

export default function Explainability({ explainability, breakdown }) {
  return (
    <Card className="p-4">
      <div className="font-medium">Explainability</div>
      <div className="text-xs text-muted mt-1">Shows exactly how your results were computed.</div>

      <div className="mt-4 space-y-3">
        <div className="rounded-2xl border border-border bg-[rgba(255,255,255,0.03)] p-4">
          <div className="text-sm font-medium">Readiness Formula</div>
          <div className="text-sm text-[rgba(255,255,255,0.82)] mt-2">
            {explainability?.readiness_formula || "—"}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-[rgba(255,255,255,0.03)] p-4">
          <div className="text-sm font-medium">Cosine Similarity</div>
          <div className="text-sm text-[rgba(255,255,255,0.82)] mt-2">
            {explainability?.cosine_similarity || "—"}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-[rgba(255,255,255,0.03)] p-4">
          <div className="text-sm font-medium">Per-skill Calculation</div>
          <div className="text-xs text-muted mt-1">Required, your level, gap, skill score, contribution.</div>

          <div className="mt-3 overflow-x-auto">
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
                {(breakdown || []).map((b, i) => (
                  <tr key={i} className="border-b border-border/60">
                    <td className="py-2">{b.skill}</td>
                    <td className="py-2">{b.required_level}</td>
                    <td className="py-2">{b.user_level}</td>
                    <td className="py-2">{b.gap}</td>
                    <td className="py-2">{b.skill_score}%</td>
                    <td className="py-2">{b.contribution_pct}%</td>
                  </tr>
                ))}
                {(breakdown || []).length === 0 ? (
                  <tr><td className="py-3 text-muted" colSpan={6}>No breakdown available.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}