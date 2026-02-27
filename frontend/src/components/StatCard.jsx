import Card from "./Card";

export default function StatCard({ label, value, hint }) {
  return (
    <Card className="p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      {hint ? <div className="text-xs text-muted mt-1">{hint}</div> : null}
    </Card>
  );
}