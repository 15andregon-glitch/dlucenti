import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { detectLocale, LOCALE_COOKIE } from "@/lib/i18n/locale";
import { localizedPath } from "@/lib/i18n/paths";

/** Root `/` — detect language and redirect to localized storefront */
export default async function RootPage() {
  const cookieStore = await cookies();
  const headersList = await headers();

  const locale = detectLocale({
    cookie: cookieStore.get(LOCALE_COOKIE)?.value,
    acceptLanguage: headersList.get("accept-language"),
  });

  redirect(localizedPath(locale, "/"));
}
