import { SITE } from "@/lib/constants";
import { sanitizeAdminReturnTo } from "@/lib/admin/auth-urls";
import { AdminLoginForm } from "@/components/admin/auth/AdminLoginForm";

interface AdminLoginPageProps {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { error, next: nextParam } = await searchParams;
  const next = sanitizeAdminReturnTo(nextParam);

  const errorMessage =
    error === "unauthorized"
      ? "This account does not have CMS access."
      : error
        ? decodeURIComponent(error)
        : null;

  return (
    <div className="admin-shell flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[22rem]">
        <header className="mb-10 text-center">
          <p className="font-sans font-extralight text-[1.375rem] tracking-tight text-[var(--maison-charcoal)]">
            {SITE.name}
          </p>
          <p className="mt-2 text-[0.6875rem] tracking-[0.14em] text-[var(--maison-mist)] uppercase">
            Private CMS
          </p>
        </header>

        <AdminLoginForm next={next} initialError={errorMessage} />

        <p className="mt-10 text-center text-[0.75rem] leading-relaxed text-[var(--maison-mist)]">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
