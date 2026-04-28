export function Badge({ children, variant = "default" }) {
  let styles = "bg-gray-700 text-gray-200";

  if (variant === "destructive") styles = "bg-red-600 text-white";
  if (variant === "secondary") styles = "bg-blue-600 text-white";
  if (variant === "default") styles = "bg-green-600 text-white";
  if (variant === "outline") styles = "border border-gray-400 text-gray-300";

  return (
    <span className={`inline-block px-2 py-1 text-xs rounded ${styles}`}>
      {children}
    </span>
  );
}
