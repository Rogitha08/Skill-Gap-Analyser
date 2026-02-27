import Card from "./Card";
import Badge from "./Badge";

export default function Gauge({ score = 0 }) {
  const pct = Math.max(0, Math.min(100, score));
  const tone = pct >= 75 ? "teal" : pct >= 50 ? "yellow" : "red";
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="font-medium">Readiness</div>
        <Badge tone={tone}>{pct.toFixed(0)}%</Badge>
      </div>
      <div className="mt-3 h-3 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden border border-border">
        <div className="h-full bg-teal" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-muted mt-2">
        0–100 score based on required skills coverage.
      </div>
    </Card>
  );
}