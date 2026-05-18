export interface Collection {
  id: string;
  slug: string;
  name: string;
  season: string;
  description: string;
  coverImage: string;
  campaignImage?: string;
  featured?: boolean;
}
