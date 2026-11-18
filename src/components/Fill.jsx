// Shows a fact from src/company.js, or a quiet marked gap where it has not been supplied yet.
// data-todo is what scripts/prerender.mjs looks for to stop a production build with gaps.
export default function Fill({ value, label, children }) {
  if (value !== null && value !== undefined && value !== '') return children ?? value;
  return (
    <span data-todo="" className="inline-block border border-dashed border-gray-400 px-1.5 text-[0.85em] font-normal italic text-gray-500">
      {label}
    </span>
  );
}
