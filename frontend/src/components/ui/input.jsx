export function Input({ className = '', ...props }) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200 ${className}`}
      {...props}
    />
  );
}
