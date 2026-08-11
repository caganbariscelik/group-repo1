import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-lime-300 text-slate-950 shadow-sm shadow-lime-300/20 hover:bg-lime-200 disabled:bg-lime-100 disabled:text-slate-400",
  secondary:
    "bg-white text-slate-800 border border-slate-200 shadow-sm hover:bg-slate-50 disabled:text-slate-400",
  danger:
    "bg-red-600/90 text-white shadow-sm hover:bg-red-600 disabled:bg-red-300",
  ghost: "text-slate-300 hover:bg-white/10 disabled:text-slate-500",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:shadow-none ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  ),
);
Button.displayName = "Button";
