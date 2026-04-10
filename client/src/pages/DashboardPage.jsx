import { Link } from "react-router-dom";
import CareerCard from "../components/CareerCard";

const QUICK_ACTIONS = [
  {
    to: "/app/mentor",
    icon: "🤖",
    title: "Talk to AI Mentor",
    desc: "Get guidance, clarity, and motivation from your personal career AI.",
    gradient: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20 hover:border-violet-500/40",
  },
  {
    to: "/app/career",
    icon: "📊",
    title: "Analyze My Career",
    desc: "Enter your skills and interests. Get 6 deep, personalized career paths.",
    gradient: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-500/20 hover:border-pink-500/40",
  },
  {
    to: "/app/profile",
    icon: "👤",
    title: "View Profile",
    desc: "See your saved careers and manage your account preferences.",
    gradient: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/20 hover:border-blue-500/40",
  },
];

export default function DashboardPage({ authUser, savedCareers, onToggleSave }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name = authUser?.name?.split(" ")[0] || "there";

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AI systems online
        </div>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white">
          {greeting}, {name} 👋
        </h1>
        <p className="text-zinc-500 mt-2 text-base">
          Ready to take your next career step? Let's figure it out together.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { label: "Saved Careers", value: savedCareers.length, icon: "⭐" },
          { label: "AI Model", value: "Flash 1.5", icon: "🧠" },
          { label: "Career Domains", value: "12+", icon: "🌍" },
          { label: "Analysis Ready", value: "Yes", icon: "✅" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="glass rounded-2xl p-4 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="text-xl mb-2">{stat.icon}</div>
            <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="font-display font-bold text-lg text-white mb-4">What would you like to do?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action, i) => (
            <Link
              key={action.to}
              to={action.to}
              className={`glass rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br ${action.gradient} ${action.border} animate-fade-up block`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-2xl mb-3">{action.icon}</div>
              <h3 className="font-display font-bold text-white text-base mb-1.5">{action.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{action.desc}</p>
              <div className="mt-4 text-xs font-semibold text-violet-400 flex items-center gap-1">
                Open → 
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Saved Careers */}
      {savedCareers.length > 0 && (
        <div className="animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-white">
              ⭐ Saved Careers ({savedCareers.length})
            </h2>
            <Link to="/app/career" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              Find more →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {savedCareers.slice(0, 4).map((career, i) => (
              <CareerCard
                key={career.title}
                career={career}
                isSaved={true}
                onToggleSave={onToggleSave}
                index={i}
              />
            ))}
          </div>
          {savedCareers.length > 4 && (
            <p className="text-center text-sm text-zinc-600 mt-4">
              +{savedCareers.length - 4} more saved careers in your{" "}
              <Link to="/app/profile" className="text-violet-400 hover:underline">profile</Link>
            </p>
          )}
        </div>
      )}

      {savedCareers.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center border border-dashed border-white/10 animate-fade-up">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="font-display font-semibold text-white text-lg mb-2">No saved careers yet</h3>
          <p className="text-zinc-500 text-sm mb-5">
            Run a career analysis and save paths that resonate with you.
          </p>
          <Link to="/app/career" className="btn-primary px-6 py-2.5 rounded-xl inline-block text-sm">
            Start Career Analysis →
          </Link>
        </div>
      )}
    </div>
  );
}
