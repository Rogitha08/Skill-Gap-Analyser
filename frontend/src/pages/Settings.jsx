import TopBar from "../components/TopBar";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";

export default function Settings() {
  const [name, setName] = useState(localStorage.getItem("skillgap_name") || "SwathiKrishna");
  const [hours, setHours] = useState(localStorage.getItem("skillgap_hours") || "6");

  function save() {
    localStorage.setItem("skillgap_name", name);
    localStorage.setItem("skillgap_hours", hours);
  }

  return (
    <div>
      <TopBar title="Settings" subtitle="Manage your profile and learning preferences" />
      <Card className="p-5 max-w-2xl">
        <div className="text-sm font-medium">Profile</div>

        <div className="mt-4">
          <div className="text-xs text-muted">Full name</div>
          <div className="mt-2"><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-muted">Hours per week</div>
          <div className="mt-2"><Input value={hours} onChange={(e) => setHours(e.target.value)} /></div>
        </div>

        <div className="mt-5">
          <Button onClick={save}>Save</Button>
        </div>
      </Card>
    </div>
  );
}