import { cn } from "@/lib/cn";

interface CheckoutFieldProps {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
  as?: "input" | "select";
  children?: React.ReactNode;
}

export function CheckoutField({
  id,
  label,
  type = "text",
  autoComplete,
  required,
  className,
  as = "input",
  children,
}: CheckoutFieldProps) {
  const fieldClass =
    "checkout-field w-full border-0 border-b border-[var(--maison-hairline)] bg-transparent py-3.5 font-sans text-[var(--maison-chrome-size)] text-[var(--maison-charcoal)] outline-none transition-[border-color] duration-500 ease-[var(--ease-maison)] placeholder:text-[var(--maison-mist)] focus:border-[var(--maison-charcoal)]";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-maison-label text-[var(--maison-mist)]">
        {label}
      </label>
      {as === "select" ? (
        <select
          id={id}
          name={id}
          required={required}
          autoComplete={autoComplete}
          className={cn(fieldClass, "cursor-pointer appearance-none")}
        >
          {children}
        </select>
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          autoComplete={autoComplete}
          className={fieldClass}
        />
      )}
    </div>
  );
}
