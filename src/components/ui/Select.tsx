import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  required?: boolean;
  options: readonly string[];
  optionLabels?: Record<string, string>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, required, id, options, optionLabels, placeholder, className = "", ...props },
    ref,
  ) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <select
        ref={ref}
        id={id}
        required={required}
        defaultValue=""
        className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-shadow focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
          error ? "border-red-400" : ""
        } ${className}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder ?? "Seç…"}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels?.[option] ?? option}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  ),
);
Select.displayName = "Select";
