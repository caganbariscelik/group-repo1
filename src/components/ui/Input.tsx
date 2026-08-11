import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from "react";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
}

function FieldWrapper({
  label,
  htmlFor,
  error,
  required,
  children,
}: FieldWrapperProps & { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

const fieldClasses =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-shadow focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    Omit<FieldWrapperProps, "htmlFor"> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, id, className = "", ...props }, ref) => (
    <FieldWrapper label={label} htmlFor={id!} error={error} required={required}>
      <input
        ref={ref}
        id={id}
        required={required}
        className={`${fieldClasses} ${error ? "border-red-400" : ""} ${className}`}
        {...props}
      />
    </FieldWrapper>
  ),
);
Input.displayName = "Input";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    Omit<FieldWrapperProps, "htmlFor"> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, id, className = "", ...props }, ref) => (
    <FieldWrapper label={label} htmlFor={id!} error={error} required={required}>
      <textarea
        ref={ref}
        id={id}
        required={required}
        className={`${fieldClasses} ${error ? "border-red-400" : ""} ${className}`}
        {...props}
      />
    </FieldWrapper>
  ),
);
Textarea.displayName = "Textarea";
