export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium " +
    "transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-teal text-[#00110E] hover:brightness-110 shadow-soft",
    ghost:
      "bg-[rgba(255,255,255,0.06)] border border-border text-[rgba(255,255,255,0.86)] hover:bg-[rgba(255,255,255,0.09)]",
    subtle:
      "text-[rgba(255,255,255,0.82)] hover:bg-[rgba(255,255,255,0.06)]"
  };
  return (
    <button className={`${base} ${variants[variant] || variants.ghost} ${className}`} {...props}>
      {children}
    </button>
  );
}