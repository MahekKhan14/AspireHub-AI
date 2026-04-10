import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🤖",
    title: "AI Career Mentor",
    desc: "Talk to an empathetic AI that listens, understands, and guides you through career decisions like a real mentor would.",
  },
  {
    icon: "📊",
    title: "Deep Career Analysis",
    desc: "Enter your skills and interests — get 6 deeply researched, personalized career paths with skill gaps and roadmaps.",
  },
  {
    icon: "🎯",
    title: "Skill Gap Intelligence",
    desc: "See exactly which skills you're missing for each role and what to learn next — no guesswork involved.",
  },
  {
    icon: "🚀",
    title: "Actionable Roadmaps",
    desc: "Every career suggestion comes with a concrete, step-by-step action plan tailored to where you are right now.",
  },
  {
    icon: "🌍",
    title: "All Career Domains",
    desc: "Tech, design, business, sports, arts, government, creator economy — every career path is on the table.",
  },
  {
    icon: "💾",
    title: "Save & Track",
    desc: "Bookmark your favourite career paths, revisit them anytime, and track your progress across sessions.",
  },
];

const TESTIMONIALS = [
  {
    name: "Aarav Singh",
    role: "CS Student → Data Scientist",
    quote: "AspireHub showed me paths I'd never even considered. The AI analysis was shockingly accurate for my profile.",
    avatar: "A",
  },
  {
    name: "Neha Reddy",
    role: "Marketing → Product Manager",
    quote: "The mentor chat felt like talking to someone who actually understood my situation. It helped me make the switch.",
    avatar: "N",
  },
  {
    name: "Rohan Kapoor",
    role: "Fresher → UX Designer",
    quote: "The skill gap analysis told me exactly what to learn. I had a job offer 4 months after using this.",
    avatar: "R",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    desc: "Get started with AI guidance",
    features: ["5 career analyses/month", "AI Mentor chat", "Basic roadmaps"],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/mo",
    desc: "For serious career builders",
    features: ["Unlimited career analyses", "Deep roadmaps", "Save unlimited careers", "Priority AI responses"],
    cta: "Go Pro",
    featured: true,
  },
  {
    name: "Team",
    price: "₹1,499",
    period: "/mo",
    desc: "For universities & cohorts",
    features: ["Everything in Pro", "Team analytics", "Dedicated onboarding", "API access"],
    cta: "Contact Us",
    featured: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white mesh-bg">
      {/* Glow orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-72 h-72 bg-pink-600/8 rounded-full blur-3xl pointer-events-none" />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] glass">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="font-display font-bold text-white text-lg">AspireHub AI</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost text-sm px-4 py-2 rounded-xl">
              Login
            </Link>
            <Link
              to="/register"
              className="btn-primary text-sm px-4 py-2"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-6 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Powered by Gemini 1.5 Flash AI
        </div>

        <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-tight tracking-tight mb-6 animate-fade-up delay-100">
          Your AI-powered{" "}
          <span className="gradient-text">career compass</span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-up delay-200">
          Discover careers that actually fit you. Talk to an AI mentor. Get actionable roadmaps.
          Built for students, switchers, and professionals ready to level up.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-up delay-300">
          <Link
            to="/register"
            className="btn-primary px-7 py-3 text-base rounded-xl"
          >
            Start for Free →
          </Link>
          <Link
            to="/login"
            className="btn-ghost px-7 py-3 text-base rounded-xl"
          >
            I have an account
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-6 text-xs text-zinc-600 animate-fade-up delay-400">
          No credit card required · Takes 30 seconds to start
        </p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">
            Everything you need to{" "}
            <span className="gradient-text-blue">navigate your career</span>
          </h2>
          <p className="text-zinc-500 text-base max-w-xl mx-auto">
            From confused to clear — AspireHub gives you AI intelligence, human warmth, and real direction.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <article
              key={f.title}
              className="glass rounded-2xl p-5 hover:-translate-y-1 hover:border-violet-500/20 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-display font-bold text-white text-base mb-2">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <h2 className="font-display font-bold text-3xl text-center mb-10">
          Real stories, real results
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.name}
              className="glass rounded-2xl p-5 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <p className="text-zinc-300 text-sm leading-relaxed mb-4">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-5 pb-24">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl mb-2">Simple, honest pricing</h2>
          <p className="text-zinc-500">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {PLANS.map((plan, i) => (
            <article
              key={plan.name}
              className={`rounded-2xl p-5 border transition-all duration-300 animate-fade-up ${
                plan.featured
                  ? "border-violet-500/40 bg-gradient-to-b from-violet-500/10 to-pink-500/5 shadow-lg shadow-violet-500/10 scale-[1.02]"
                  : "glass"
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {plan.featured && (
                <div className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3">
                  ✦ Most Popular
                </div>
              )}
              <p className="text-zinc-400 text-sm mb-1">{plan.name}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display font-extrabold text-3xl text-white">{plan.price}</span>
                {plan.period && <span className="text-zinc-500 text-sm">{plan.period}</span>}
              </div>
              <p className="text-xs text-zinc-500 mb-4">{plan.desc}</p>
              <ul className="space-y-2 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-zinc-300 flex items-center gap-2">
                    <span className="text-emerald-400 text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`block text-center rounded-xl py-2.5 text-sm font-semibold transition-all ${
                  plan.featured
                    ? "btn-primary"
                    : "bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10"
                }`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-5 pb-20 text-center">
        <div className="glass rounded-3xl p-10 border border-violet-500/20">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl mb-3">
            Ready to find your path?
          </h2>
          <p className="text-zinc-400 mb-6">
            Join thousands who've used AspireHub to discover careers they love.
          </p>
          <Link to="/register" className="btn-primary px-8 py-3 text-base rounded-xl">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} AspireHub AI · Built with intelligence, designed with care.
      </footer>
    </div>
  );
}
