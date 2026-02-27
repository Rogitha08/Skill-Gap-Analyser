export default function Input({ className = "", ...props }) {
  return (
    <input
      className={
        "w-full rounded-xl border border-border bg-[rgba(255,255,255,0.04)] px-3 py-2 " +
        "text-sm text-text placeholder:text-[rgba(255,255,255,0.4)] outline-none " +
        "focus:border-[rgba(32,211,194,0.35)] " +
        className
      }
      {...props}
    />
  );
}