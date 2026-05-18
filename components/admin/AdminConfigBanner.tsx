import { hasSupabaseServiceRole } from "@/lib/supabase/env";

export function AdminConfigBanner() {
  if (hasSupabaseServiceRole()) return null;

  return (
    <div
      className="border-b border-[var(--maison-hairline)] bg-[var(--maison-champagne)] px-6 py-3 text-center font-sans text-[0.8125rem] text-[var(--maison-charcoal)]"
      role="status"
    >
      Add <code className="text-[0.75rem]">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
      <code className="text-[0.75rem]">.env.local</code> to enable CMS saves and
      uploads. Reads still work via the anon key.
    </div>
  );
}
