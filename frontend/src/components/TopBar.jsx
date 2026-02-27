import Button from "./Button";

export default function TopBar({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <div className="text-2xl font-semibold">{title}</div>
        {subtitle ? <div className="text-sm text-muted mt-1">{subtitle}</div> : null}
      </div>
      <div className="flex items-center gap-2">
        {right || (
          <>
            <Button variant="ghost">Refresh Analysis</Button>
            <Button>New Analysis</Button>
          </>
        )}
      </div>
    </div>
  );
}