import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  History as HistoryIcon,
  TrendingUp,
  Settings as SettingsIcon,
  LogOut,
  User
} from "lucide-react";

const items = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/analyzer", label: "Analyzer", icon: Search },
  { to: "/history", label: "History", icon: HistoryIcon },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/profile", label: "Profile", icon: User }
];

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("skillgap_token");
    localStorage.removeItem("skillgap_user");
    navigate("/login");
  }

  return (
    <aside className="h-full w-[260px] shrink-0 p-4">
      <div className="rounded-2xl border border-border bg-panel shadow-soft backdrop-blur-md h-full flex flex-col">
        {/* Header */}
        <div className="px-4 py-4">
          <div className="text-lg font-semibold leading-tight">ClariPath AI</div>
          <div className="text-xs text-muted mt-1">Career Intelligence Platform</div>
        </div>

        {/* Navigation */}
        <nav className="px-2 flex-1">
          {items.map((x) => {
            const Icon = x.icon;
            return (
              <NavLink
                key={x.to}
                to={x.to}
                end={x.to === "/"}
                className={({ isActive }) =>
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm my-1 transition " +
                  (isActive
                    ? "bg-[rgba(32,211,194,0.12)] border border-[rgba(32,211,194,0.25)] text-text"
                    : "text-[rgba(255,255,255,0.72)] hover:bg-[rgba(255,255,255,0.06)]")
                }
              >
                <Icon size={18} className="opacity-90" />
                <span>{x.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 space-y-3">
          {/* AI Engine Status */}
          <div className="rounded-2xl border border-border bg-[rgba(32,211,194,0.08)] px-3 py-3">
            <div className="text-xs text-muted">AI Engine Active</div>
            <div className="text-sm mt-1">Models ready for analysis</div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-[rgba(239,68,68,0.25)]
                       bg-[rgba(239,68,68,0.08)] px-3 py-2 text-sm
                       text-red-400 transition hover:bg-[rgba(239,68,68,0.16)]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}