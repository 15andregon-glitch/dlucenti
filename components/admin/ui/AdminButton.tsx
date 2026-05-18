import { cn } from "@/lib/cn";

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "solid" | "danger";
}

export function AdminButton({
  className,
  variant = "default",
  children,
  ...props
}: AdminButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "admin-btn",
        variant === "solid" && "admin-btn--solid",
        variant === "danger" && "admin-btn--danger",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
