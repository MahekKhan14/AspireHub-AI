import { NavLink } from "react-router-dom";

const NAV = [
  {
    path: "/app/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    path: "/app/mentor",
    label: "AI Mentor",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    badge: "AI",
  },
  {
    path: "/app/career",
    label: "Career Analysis",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    badge: "NEW",
  },
  {
    path: "/app/profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Sidebar({ authUser, onLogout }) {
  const initial = authUser?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col glass border-r border-white/[0.06] p-5">
      {/* Brand */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/30">
            A
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-base leading-none">AspireHub</h1>
            <p className="text-[10px] text-zinc-500 mt-0.5">AI Career Platform</p>
          </div>
        </div>
      </div>

      {/* User pill */}
      <div className="flex items-center gap-3 glass-light rounded-xl p-3 mb-8">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{authUser?.name || "User"}</p>
          <p className="text-xs text-zinc-500 truncate">{authUser?.email || ""}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? "text-violet-400" : "group-hover:text-zinc-300 transition-colors"}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 mt-4 w-full text-left"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sign out
      </button>
    </aside>
  );
}
