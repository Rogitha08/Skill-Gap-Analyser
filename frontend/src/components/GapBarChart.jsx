import Card from "./Card";

export default function GapBarChart({ gaps }) {
  const crit = gaps?.critical?.length || 0;
  const mod = gaps?.moderate?.length || 0;
  const ready = gaps?.ready?.length || 0;
  const total = crit + mod + ready || 1;

  const row = [
    { label: "Critical", val: crit },
    { label: "Moderate", val: mod },
    { label: "Ready", val: ready }
  ];

  return (
    <Card className="p-4">
      <div className="font-medium">Skill Gaps</div>
      <div className="text-xs text-muted mt-1">Critical ≥ 2, Moderate = 1, Ready = 0</div>

      <div className="mt-4 space-y-3">
        {row.map((x) => (
          <div key={x.label}>
            <div className="flex items-center justify-between text-xs text-muted">
              <span>{x.label}</span>
              <span>{x.val}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-[rgba(255,255,255,0.06)] border border-border overflow-hidden">
              <div className="h-full bg-teal" style={{ width: `${(x.val / total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}