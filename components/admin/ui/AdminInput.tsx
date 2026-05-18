import { cn } from "@/lib/cn";

type AdminInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function AdminInput({ className, ...props }: AdminInputProps) {
  return <input className={cn("admin-input", className)} {...props} />;
}
