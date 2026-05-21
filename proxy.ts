import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  detectLocale,
  isValidLocale,
  type Locale,
} from "@/lib/i18n/locale";

/** Admin auth paths — inlined for Edge (no @/lib/admin imports) */
const LOGIN_PATH = "/admin/login";
const HOME_PATH = "/admin";
const CALLBACK_PATH = "/admin/auth/callback";

const LOCALE_PREFIXES = ["/en", "/pt"] as const;

function isAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

function isLocalePrefixed(pathname: string): boolean {
  return LOCALE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function getLocaleFromPath(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return isValidLocale(segment) ? segment : null;
}

function redirectToLocalized(
  request: NextRequest,
  locale: Locale,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  const suffix = pathname === "/" ? "" : pathname;
  url.pathname = `/${locale}${suffix}`;
  return NextResponse.redirect(url);
}

function safeReturnPath(pathname: string): string {
  if (
    pathname.startsWith("/admin") &&
    pathname !== LOGIN_PATH &&
    !pathname.startsWith(CALLBACK_PATH)
  ) {
    return pathname;
  }
  return HOME_PATH;
}

function redirectToLogin(request: NextRequest, returnPath: string) {
  const url = request.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = "";
  url.searchParams.set("next", safeReturnPath(returnPath));
  return NextResponse.redirect(url);
}

function redirectToLoginUnauthorized(request: NextRequest, returnPath: string) {
  const url = request.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = "";
  url.searchParams.set("error", "unauthorized");
  const next = safeReturnPath(returnPath);
  if (next !== HOME_PATH) url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}

function redirectToAdminHome(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = HOME_PATH;
  url.search = "";
  return NextResponse.redirect(url);
}

async function handleAdminAuth(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`);
  const isAuthCallback = pathname.startsWith(CALLBACK_PATH);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createSupabaseMiddlewareClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  async function isAdminUser(userId: string): Promise<boolean> {
    const { data } = await supabase
      .from("admins")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    return Boolean(data);
  }

  if (isAuthCallback) return response;

  if (isLogin) {
    if (user && (await isAdminUser(user.id))) {
      return redirectToAdminHome(request);
    }
    return response;
  }

  if (!user) return redirectToLogin(request, pathname);

  if (!(await isAdminUser(user.id))) {
    await supabase.auth.signOut();
    return redirectToLoginUnauthorized(request, pathname);
  }

  return response;
}

function handleStorefrontLocale(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const preferred = detectLocale({
    cookie: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
  });

  if (isLocalePrefixed(pathname)) {
    const pathLocale = getLocaleFromPath(pathname);
    const response = NextResponse.next();
    if (pathLocale) {
      response.cookies.set(LOCALE_COOKIE, pathLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  return redirectToLocalized(request, preferred, pathname);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (isAdminPath(pathname)) {
    return handleAdminAuth(request);
  }

  if (pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  return handleStorefrontLocale(request);
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
