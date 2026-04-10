import { useState } from "react";
import { careerAnalyzeRequest } from "../utils/api";
import CareerCard from "../components/CareerCard";
import TagInput from "../components/TagInput";
import LoadingDots from "../components/LoadingDots";

const INTEREST_SUGGESTIONS = [
  "Technology", "Design", "Business", "Finance", "Marketing",
  "Data Science", "Healthcare", "Law", "Education", "Content Creation",
  "Gaming", "Music", "Sports", "Art", "Writing", "Photography",
  "Travel", "Entrepreneurship", "Environment", "Social Impact",
  "Fashion", "Architecture", "Research", "Culinary", "Public Speaking",
];

const SKELETON = Array(6).fill(null);

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden animate-pulse">
      <div className="h-0.5 bg-gradient-to-r from-zinc-700 to-zinc-600" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-white/5 rounded-lg w-2/3 shimmer" />
        <div className="h-3 bg-white/5 rounded w-full shimmer" />
        <div className="h-3 bg-white/5 rounded w-4/5 shimmer" />
        <div className="h-14 bg-violet-500/5 rounded-xl shimmer" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-12 bg-white/5 rounded-xl shimmer" />
          <div className="h-12 bg-white/5 rounded-xl shimmer" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => <div key={n} className="h-6 w-16 bg-white/5 rounded-full shimmer" />)}
        </div>
      </div>
    </div>
  );
}

export default function CareerAnalysisPage({ savedCareers, onToggleSave }) {
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [goals, setGoals] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasRun, setHasRun] = useState(false);

  const addSkill = (s) => {
    const v = s.trim();
    if (v && !skills.includes(v)) setSkills((p) => [...p, v]);
  };
  const removeSkill = (s) => setSkills((p) => p.filter((x) => x !== s));

  const toggleInterest = (i) => {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const handleAnalyze = async () => {
    if (skills.length === 0 && interests.length === 0) {
      setError("Add at least one skill or interest to get started.");
      return;
    }
    setError("");
    setLoading(true);
    setHasRun(true);
    setResults([]);

    try {
      const { data } = await careerAnalyzeRequest({
        skills: skills.join(", "),
        interests: interests.join(", "),
        goals: goals.trim(),
      });

      if (!Array.isArray(data.careers) || data.careers.length === 0) {
        setError("No results returned. Try adjusting your inputs.");
      } else {
        setResults(data.careers);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
          AI-Powered · Dynamic · No static data
        </div>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white">
          Career Analysis
        </h1>
        <p className="text-zinc-500 mt-2 text-base max-w-2xl">
          Tell us about yourself and our AI will generate 6 deeply researched career paths — personalized just for you, across every domain.
        </p>
      </div>

      {/* Input Panel */}
      <div className="glass rounded-2xl p-6 mb-8 animate-fade-up border border-white/[0.06]">
        <div className="h-0.5 bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 rounded-full mb-6 -mt-6 -mx-6 rounded-t-2xl" />

        <div className="space-y-6">
          {/* Skills */}
          <TagInput
            label="⚡ Your Skills"
            placeholder="e.g. Python, Figma, Excel, Writing..."
            tags={skills}
            onAdd={addSkill}
            onRemove={removeSkill}
            color="violet"
          />

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-3">🌍 Your Interests</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {INTEREST_SUGGESTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                    interests.includes(item)
                      ? "bg-violet-500/20 border-violet-500/40 text-violet-300 scale-105"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:border-violet-500/30 hover:text-zinc-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            {interests.length > 0 && (
              <p className="text-xs text-zinc-600">
                Selected: {interests.join(", ")}
              </p>
            )}
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              🎯 Your Goals <span className="text-zinc-600 font-normal">(optional)</span>
            </label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="e.g. I want to work remotely, earn well, and make a social impact..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl text-base flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingDots size="sm" />
                <span>AI is thinking deeply...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Analyze My Career</span>
              </>
            )}
          </button>

          {loading && (
            <p className="text-xs text-center text-zinc-600 animate-pulse">
              Gemini is analyzing your profile across 12+ career domains... this takes ~10 seconds
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div>
          <h2 className="font-display font-bold text-lg text-white mb-4">
            Generating your personalized career paths...
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {SKELETON.map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="animate-fade-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-xl text-white">
              🎯 Your Career Matches ({results.length})
            </h2>
            <button
              onClick={handleAnalyze}
              className="btn-ghost text-sm px-4 py-2 rounded-xl"
            >
              Regenerate ↻
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {results.map((career, i) => (
              <CareerCard
                key={i}
                career={career}
                isSaved={savedCareers.some((c) => c.title === career.title)}
                onToggleSave={onToggleSave}
                index={i}
              />
            ))}
          </div>

          <div className="mt-8 glass rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5">
            <p className="text-sm text-zinc-300">
              💡 <strong className="text-emerald-400">Pro tip:</strong> Save the careers that resonate with you using the bookmark icon. You can revisit them anytime from your Dashboard.
            </p>
          </div>
        </div>
      )}

      {!loading && hasRun && results.length === 0 && !error && (
        <div className="glass rounded-2xl p-10 text-center animate-fade-up">
          <div className="text-4xl mb-3">🤔</div>
          <h3 className="font-display font-semibold text-white text-lg mb-2">No results yet</h3>
          <p className="text-zinc-500 text-sm">Try adding more skills or selecting different interests.</p>
        </div>
      )}

      {!hasRun && (
        <div className="glass rounded-2xl p-10 text-center border border-dashed border-white/10 animate-fade-up">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="font-display font-bold text-white text-xl mb-2">
            Your career analysis awaits
          </h3>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Add your skills and interests above, then hit Analyze. Our AI will generate 6 deeply researched career paths — across tech, business, arts, and everything in between.
          </p>
        </div>
      )}
    </div>
  );
}
