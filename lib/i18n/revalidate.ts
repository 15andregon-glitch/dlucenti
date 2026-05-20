import { revalidatePath } from "next/cache";
import { LOCALES } from "@/lib/i18n/locale";
import { localizedPath } from "@/lib/i18n/paths";

/** Revalidate storefront paths for every locale (and `/` redirect). */
export function revalidateStorefront(...paths: string[]) {
  revalidatePath("/");
  for (const locale of LOCALES) {
    for (const path of paths) {
      revalidatePath(localizedPath(locale, path));
    }
  }
}

/** Revalidate site chrome (footer on every page). */
export function revalidateSiteChrome() {
  revalidatePath("/", "layout");
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`, "layout");
  }
}
