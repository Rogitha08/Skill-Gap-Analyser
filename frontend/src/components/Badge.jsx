export default function Badge({ children, tone = "teal" }) {
  const map = {
    teal: "bg-[rgba(32,211,194,0.14)] text-teal border-[rgba(32,211,194,0.28)]",
    gray: "bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.75)] border-border",
    red: "bg-[rgba(239,68,68,0.14)] text-[rgba(239,68,68,0.95)] border-[rgba(239,68,68,0.25)]",
    yellow: "bg-[rgba(245,158,11,0.14)] text-[rgba(245,158,11,0.95)] border-[rgba(245,158,11,0.25)]"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs ${map[tone] || map.gray}`}>
      {children}
    </span>
  );
}