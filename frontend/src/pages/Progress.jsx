import TopBar from "../components/TopBar";
import StatCard from "../components/StatCard";
import Card from "../components/Card";

export default function Progress() {
  return (
    <div>
      <TopBar title="Progress" subtitle="Track learning achievements (optional module)." />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard label="Skills Learned" value="—" hint="This month" />
        <StatCard label="Hours Studied" value="—" hint="Total time" />
        <StatCard label="Projects Done" value="—" hint="Hands-on work" />
        <StatCard label="Current Streak" value="—" hint="Keep it up" />
      </div>

      <Card className="p-5 mt-5">
        <div className="font-medium">Recent Activity</div>
        <div className="text-sm text-muted mt-2">Hook this to your own activity tracking later.</div>
      </Card>
    </div>
  );
}