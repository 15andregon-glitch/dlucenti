export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  category: "campaign" | "craft" | "editorial" | "event";
}
