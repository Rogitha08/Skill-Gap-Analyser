export default function Select({ className = "", children, ...props }) {
  return (
    <select
      className={
        "w-full rounded-xl border border-border bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm " +
        "text-text outline-none focus:border-[rgba(32,211,194,0.35)] " +
        className
      }
      {...props}
    >
      {children}
    </select>
  );
}