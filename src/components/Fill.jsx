// Shows a fact from src/company.js, or a marked gap where it has not been supplied yet.
// data-todo is what scripts/prerender.mjs looks for to stop a production build with gaps.
export default function Fill({ value, label, children }) {
  if (value !== null && value !== undefined && value !== '') return children ?? value;
  return (
    <mark data-todo="" className="bg-amber-100 text-amber-900 outline-dashed outline-1 outline-amber-500 px-1 not-italic">
      [{label}]
    </mark>
  );
}
