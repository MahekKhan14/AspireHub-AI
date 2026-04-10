import { Link } from "react-router-dom";
import CareerCard from "../components/CareerCard";

export default function ProfilePage({ authUser, savedCareers, onToggleSave }) {
  const initial = authUser?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <h1 className="font-display font-extrabold text-3xl text-white">Profile</h1>
        <p className="text-zinc-500 mt-1">Your account and saved career paths.</p>
      </div>

      {/* User card */}
      <div className="glass rounded-2xl p-6 mb-8 border border-white/[0.06] animate-fade-up">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-display font-extrabold text-2xl shadow-lg shadow-violet-500/30">
            {initial}
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-white">{authUser?.name || "User"}</h2>
            <p className="text-zinc-500 text-sm">{authUser?.email || ""}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] uppercase tracking-wider text-violet-400 font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                AspireHub Member
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-up delay-100">
        {[
          { label: "Saved Careers", value: savedCareers.length, icon: "⭐" },
          { label: "Analyses Run", value: "—", icon: "📊" },
          { label: "Member Since", value: "2025", icon: "📅" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="font-display font-bold text-xl text-white">{stat.value}</div>
            <div className="text-xs text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Saved careers */}
      <div className="animate-fade-up delay-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-white">
            ⭐ Saved Career Paths
          </h2>
          <Link to="/app/career" className="btn-ghost text-sm px-4 py-2 rounded-xl">
            Find More +
          </Link>
        </div>

        {savedCareers.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {savedCareers.map((career, i) => (
              <CareerCard
                key={career.title}
                career={career}
                isSaved={true}
                onToggleSave={onToggleSave}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-10 text-center border border-dashed border-white/10">
            <div className="text-4xl mb-3">🔖</div>
            <h3 className="font-display font-semibold text-white text-lg mb-2">
              No saved careers yet
            </h3>
            <p className="text-zinc-500 text-sm mb-5">
              Run a career analysis and bookmark the paths you want to explore.
            </p>
            <Link to="/app/career" className="btn-primary px-6 py-2.5 rounded-xl inline-block text-sm">
              Start Career Analysis →
            </Link>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="mt-10 glass rounded-2xl p-5 border border-white/[0.06] animate-fade-up delay-300">
        <h3 className="font-semibold text-white text-sm mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Link to="/app/mentor" className="btn-ghost text-xs px-4 py-2 rounded-lg">
            🤖 Open AI Mentor
          </Link>
          <Link to="/app/career" className="btn-ghost text-xs px-4 py-2 rounded-lg">
            📊 New Career Analysis
          </Link>
          <Link to="/app/dashboard" className="btn-ghost text-xs px-4 py-2 rounded-lg">
            🏠 Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
