export function Label({ children, htmlFor }) {
  return <label className="text-sm font-medium text-slate-700" htmlFor={htmlFor}>{children}</label>;
}
