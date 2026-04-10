import { useState } from "react";

const growthColor = (outlook = "") => {
  const o = outlook.toLowerCase();
  if (o.includes("very high")) return { dot: "bg-emerald-400", text: "text-emerald-400", label: "Very High" };
  if (o.includes("high")) return { dot: "bg-green-400", text: "text-green-400", label: "High" };
  if (o.includes("emerging")) return { dot: "bg-amber-400", text: "text-amber-400", label: "Emerging" };
  return { dot: "bg-blue-400", text: "text-blue-400", label: "Stable" };
};

export default function CareerCard({ career, isSaved, onToggleSave, index = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const growth = growthColor(career.growth_outlook || "");

  return (
    <article
      className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/20 hover:shadow-xl hover:shadow-violet-500/5 animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top gradient bar */}
      <div className="h-0.5 bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-white text-lg leading-tight truncate">
              {career.title}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{career.description}</p>
          </div>
          <button
            onClick={() => onToggleSave(career)}
            className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
              isSaved
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-white/5 text-zinc-500 border border-white/10 hover:border-amber-500/30 hover:text-amber-400"
            }`}
            title={isSaved ? "Unsave" : "Save career"}
          >
            <svg viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        {/* Why fit */}
        <div className="rounded-xl bg-violet-500/10 border border-violet-500/15 px-3 py-2.5 mb-4">
          <p className="text-[11px] uppercase tracking-wider text-violet-400 font-semibold mb-1">✨ Why this fits you</p>
          <p className="text-sm text-zinc-300">{career.why_fit}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="glass-light rounded-xl px-3 py-2">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-0.5">💰 Salary</p>
            <p className="text-sm font-semibold text-emerald-400">{career.salary_range || "Varies"}</p>
          </div>
          <div className="glass-light rounded-xl px-3 py-2">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-0.5">📈 Growth</p>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${growth.dot} animate-pulse-slow`} />
              <p className={`text-sm font-semibold ${growth.text}`}>{growth.label}</p>
            </div>
          </div>
        </div>

        {/* Skills required */}
        <div className="mb-4">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-2">🧠 Skills Required</p>
          <div className="flex flex-wrap gap-1.5">
            {(career.skills_required || []).map((skill) => (
              <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing skills */}
        {(career.missing_skills || []).length > 0 && (
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-wider text-rose-400 font-semibold mb-2">⚠️ Skill Gaps</p>
            <div className="flex flex-wrap gap-1.5">
              {career.missing_skills.map((skill) => (
                <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Roadmap — expandable */}
        {(career.roadmap || []).length > 0 && (
          <div>
            <button
              onClick={() => setExpanded((p) => !p)}
              className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-blue-400 font-semibold mb-2 hover:text-blue-300 transition-colors"
            >
              🚀 Roadmap
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {expanded && (
              <ol className="space-y-1.5 animate-fade-up">
                {career.roadmap.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {step.replace(/^Step \d+ ?— ?/i, "")}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* Growth outlook detail */}
        {career.growth_outlook && (
          <p className="mt-4 text-xs text-zinc-500 border-t border-white/5 pt-3">
            {career.growth_outlook}
          </p>
        )}
      </div>
    </article>
  );
}
