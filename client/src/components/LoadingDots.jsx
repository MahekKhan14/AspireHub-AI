export default function LoadingDots({ size = "md" }) {
  const sizes = { sm: "w-1.5 h-1.5", md: "w-2 h-2", lg: "w-2.5 h-2.5" };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-1.5">
      <span className={`typing-dot ${s}`} />
      <span className={`typing-dot ${s}`} />
      <span className={`typing-dot ${s}`} />
    </div>
  );
}
