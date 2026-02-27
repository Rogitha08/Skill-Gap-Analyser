import Card from "./Card";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";

const levelLabel = { 1: "Beginner", 2: "Intermediate", 3: "Advanced" };

export default function SkillTable({ skills, setSkills, title = "Skills" }) {
  function update(i, patch) {
    setSkills(skills.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function remove(i) {
    setSkills(skills.filter((_, idx) => idx !== i));
  }
  function add() {
    setSkills([...skills, { name: "", level: 1 }]);
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-muted mt-1">Add, edit, and set levels before analysis.</div>
        </div>
        <Button variant="ghost" onClick={add}>+ Add Skill</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted">
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-2">Skill</th>
              <th className="text-left py-2 pr-2 w-[220px]">Level</th>
              <th className="text-right py-2 w-[120px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {skills.length === 0 ? (
              <tr>
                <td className="py-4 text-muted" colSpan={3}>No skills added yet.</td>
              </tr>
            ) : (
              skills.map((s, i) => (
                <tr key={i} className="border-b border-border/60">
                  <td className="py-2 pr-2">
                    <Input
                      value={s.name}
                      onChange={(e) => update(i, { name: e.target.value })}
                      placeholder="e.g., Python"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Select
                      value={s.level}
                      onChange={(e) => update(i, { level: Number(e.target.value) })}
                    >
                      <option value={1}>Beginner (1)</option>
                      <option value={2}>Intermediate (2)</option>
                      <option value={3}>Advanced (3)</option>
                    </Select>
                    <div className="text-xs text-muted mt-1">{levelLabel[s.level]}</div>
                  </td>
                  <td className="py-2 text-right">
                    <Button variant="ghost" onClick={() => remove(i)}>Delete</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}