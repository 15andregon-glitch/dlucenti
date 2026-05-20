import { NextResponse } from "next/server";
import { buildAdminLoginErrorUrl, sanitizeAdminReturnTo } from "@/lib/admin/auth-urls";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Exchange auth code for session (email links, OAuth) */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeAdminReturnTo(searchParams.get("next"));

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: admin } = await supabase
          .from("admins")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (admin) {
          return NextResponse.redirect(new URL(next, origin));
        }
      }
      await supabase.auth.signOut();
    }
  }

  return NextResponse.redirect(
    new URL(buildAdminLoginErrorUrl("unauthorized", next), origin),
  );
}
