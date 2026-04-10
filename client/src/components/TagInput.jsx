import { useState } from "react";

export default function TagInput({ label, placeholder, tags, onAdd, onRemove, color = "violet" }) {
  const [draft, setDraft] = useState("");

  const colors = {
    violet: {
      chip: "bg-violet-500/15 border-violet-500/25 text-violet-300",
      remove: "hover:text-violet-100",
    },
    blue: {
      chip: "bg-blue-500/15 border-blue-500/25 text-blue-300",
      remove: "hover:text-blue-100",
    },
  };

  const c = colors[color] || colors.violet;

  const submit = () => {
    const items = draft
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    items.forEach((item) => onAdd(item));
    setDraft("");
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-zinc-400 mb-2">{label}</label>
      )}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 focus-within:border-violet-500/40 focus-within:ring-1 focus-within:ring-violet-500/20 transition-all min-h-[46px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${c.chip}`}
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className={`opacity-60 ${c.remove} transition-opacity hover:opacity-100`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-white placeholder:text-zinc-600 outline-none"
        />
      </div>
      <p className="text-xs text-zinc-600 mt-1.5">Press Enter or comma to add</p>
    </div>
  );
}
