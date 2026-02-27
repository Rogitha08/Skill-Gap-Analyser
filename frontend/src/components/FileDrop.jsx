import Card from "./Card";
import Button from "./Button";

export default function FileDrop({ file, setFile }) {
  return (
    <Card className="p-5">
      <div className="text-sm font-medium">Resume</div>
      <div className="text-xs text-muted mt-1">Upload PDF/DOCX or paste text. Extracted skills default to Beginner.</div>

      <div className="mt-4 rounded-2xl border border-border bg-[rgba(255,255,255,0.03)] p-6 text-center">
        <div className="text-sm">Upload your resume</div>
        <div className="text-xs text-muted mt-1">Supports PDF, DOCX, or TXT</div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-xs text-muted"
          />
          {file ? <Button variant="ghost" onClick={() => setFile(null)}>Remove</Button> : null}
        </div>

        {file ? <div className="text-xs mt-3 text-[rgba(32,211,194,0.9)]">{file.name}</div> : null}
      </div>
    </Card>
  );
}