import type { JournalPost } from "@/lib/types";

export const journalPosts: JournalPost[] = [
  {
    id: "1",
    slug: "light-in-motion",
    title: "Light in Motion",
    excerpt:
      "Behind the lens of our SS26 campaign — gold, shadow, and the architecture of desire.",
    coverImage: "/campaigns/journal-light.jpg",
    publishedAt: "2026-03-01",
    category: "campaign",
  },
  {
    id: "2",
    slug: "the-atelier",
    title: "The Atelier",
    excerpt:
      "Inside the Paris workshop where each piece is composed by hand.",
    coverImage: "/campaigns/journal-atelier.jpg",
    publishedAt: "2026-02-14",
    category: "craft",
  },
  {
    id: "3",
    slug: "noir-editorial",
    title: "Noir Editorial",
    excerpt: "A study in restraint — black silk, platinum, negative space.",
    coverImage: "/campaigns/journal-noir.jpg",
    publishedAt: "2026-01-20",
    category: "editorial",
  },
];
