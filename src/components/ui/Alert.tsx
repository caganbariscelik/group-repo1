type AlertVariant = "error" | "success" | "info";

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  error: "bg-red-50 text-red-800 border-red-100",
  success: "bg-emerald-50 text-emerald-800 border-emerald-100",
  info: "bg-slate-50 text-slate-700 border-slate-200",
};

export function Alert({
  variant = "info",
  children,
}: {
  variant?: AlertVariant;
  children: React.ReactNode;
}) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`rounded-lg border px-4 py-3 text-sm ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </div>
  );
}
