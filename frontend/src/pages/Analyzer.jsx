// frontend/src/pages/Analyzer.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../components/TopBar";
import Card from "../components/Card";
import Button from "../components/Button";
import FileDrop from "../components/FileDrop";
import SkillTable from "../components/SkillTable";
import RoleSelect from "../components/RoleSelect";

import { analyzeJob } from "../lib/api";

export default function Analyzer() {
  const nav = useNavigate();

  const [jobRole, setJobRole] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [manualSkills, setManualSkills] = useState([]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function run() {
    setErr("");

    if (!jobRole.trim()) {
      setErr("Please select or enter a job role.");
      return;
    }

    const cleanedSkills = (manualSkills || [])
      .map((s) => ({
        name: (s?.name || "").trim(),
        level: Number(s?.level || 1)
      }))
      .filter((s) => s.name.length > 0);

    setLoading(true);
    try {
      const res = await analyzeJob({
        jobRole: jobRole.trim(),
        manualSkills: cleanedSkills,
        resumeText,
        resumeFile
      });

      // Navigate to full report page
      nav(`/report/${res.history_id}`);
    } catch (e) {
      // Backend may return JSON error text; show readable message
      let msg = e?.message || String(e);
      try {
        const parsed = JSON.parse(msg);
        msg = parsed?.detail || msg;
      } catch {
        // ignore
      }
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <TopBar
        title="Analyzer"
        subtitle="Choose a job role, add skills or upload a resume, then run analysis."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT: role + resume text + skill table */}
        <div className="lg:col-span-2 space-y-5">
          {/* Role Dropdown */}
          <RoleSelect value={jobRole} onChange={setJobRole} />

          {/* Resume Text Paste */}
          <Card className="p-5">
            <div className="text-sm font-medium">Paste Resume Text (optional)</div>
            <div className="text-xs text-muted mt-1">
              If you upload a file, we also extract text and combine it with this.
            </div>

            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="mt-3 w-full min-h-[140px] rounded-xl border border-border bg-[rgba(255,255,255,0.04)] p-3 text-sm outline-none focus:border-[rgba(32,211,194,0.35)]"
              placeholder="Paste resume text here..."
            />
          </Card>

          {/* Manual skills */}
          <SkillTable
            title="Manual Skill Entry"
            skills={manualSkills}
            setSkills={setManualSkills}
          />
        </div>

        {/* RIGHT: resume upload + run button */}
        <div className="space-y-5">
          {/* Resume Upload */}
          <FileDrop file={resumeFile} setFile={setResumeFile} />

          {/* Run Analysis */}
          <Card className="p-5">
            <div className="font-medium">Run Analysis</div>
            <div className="text-xs text-muted mt-1">
              Generates readiness score, skill gaps, top career matches, roadmap, and explainability.
            </div>

            {err ? (
              <div className="mt-4 rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.08)] p-3 text-sm">
                {err}
              </div>
            ) : null}

            <div className="mt-4">
              <Button className="w-full" onClick={run} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze Now"}
              </Button>
            </div>

            <div className="mt-3 text-xs text-muted">
              Tip: Using the dropdown avoids role name typos.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}