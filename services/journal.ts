import { journalPosts } from "@/lib/data/journal";
import type { JournalPost } from "@/lib/types";

export async function getJournalPosts(): Promise<JournalPost[]> {
  return journalPosts;
}

export async function getJournalPostBySlug(
  slug: string,
): Promise<JournalPost | null> {
  return journalPosts.find((p) => p.slug === slug) ?? null;
}
