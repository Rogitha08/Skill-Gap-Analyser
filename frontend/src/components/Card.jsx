export default function Card({ className = "", children }) {
  return (
    <div
      className={
        "rounded-2xl border border-border bg-panel shadow-soft backdrop-blur-md " +
        "transition hover:border-[rgba(255,255,255,0.14)] " +
        className
      }
    >
      {children}
    </div>
  );
}