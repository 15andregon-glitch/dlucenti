import { cn } from "@/lib/cn";

type AdminTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function AdminTextarea({ className, ...props }: AdminTextareaProps) {
  return <textarea className={cn("admin-textarea", className)} {...props} />;
}
