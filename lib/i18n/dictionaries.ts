import type { Locale } from "@/lib/i18n/locale";
import type { Messages } from "@/messages/en";
import { en } from "@/messages/en";
import { pt } from "@/messages/pt";

export function getDictionary(locale: Locale): Messages {
  return (locale === "pt" ? pt : en) as Messages;
}
