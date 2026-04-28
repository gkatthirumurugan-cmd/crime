export function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`border border-gray-600 rounded px-3 py-2 bg-[#0f172a] text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    />
  );
}
