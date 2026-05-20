import type {
  CollectionHeroAlignment,
  CollectionPublicationStatus,
  CollectionTextColor,
  CollectionTitlePosition,
} from "@/types/database/schema";
import { parseCheckbox, parseNumber, parseOptionalUuid } from "@/lib/admin/utils";

export interface ParsedCollectionForm {
  name: string;
  slug: string;
  description: string;
  cover_image: string;
  featured: boolean;
  short_title: string;
  editorial_title: string;
  subtitle: string;
  launch_date: string | null;
  publication_status: CollectionPublicationStatus;
  campaign_video_url: string | null;
  story_body: string;
  inspiration_text: string;
  materials_text: string;
  campaign_mood: string;
  hero_alignment: CollectionHeroAlignment;
  text_color: CollectionTextColor;
  overlay_opacity: number;
  title_position: CollectionTitlePosition;
  enable_fullscreen_hero: boolean;
  enable_dark_mode_section: boolean;
  meta_title: string;
  meta_description: string;
  og_image: string;
  hidden_from_frontend: boolean;
}

export function parseCollectionForm(formData: FormData): ParsedCollectionForm {
  const publication_status = (
    String(formData.get("publication_status") ?? "draft") === "published"
      ? "published"
      : "draft"
  ) as CollectionPublicationStatus;

  const launchRaw = String(formData.get("launch_date") ?? "").trim();

  return {
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    cover_image: String(formData.get("cover_image") ?? ""),
    featured: parseCheckbox(formData.get("featured")),
    short_title: String(formData.get("short_title") ?? "").trim(),
    editorial_title: String(formData.get("editorial_title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    launch_date: launchRaw || null,
    publication_status,
    campaign_video_url:
      String(formData.get("campaign_video_url") ?? "").trim() || null,
    story_body: String(formData.get("story_body") ?? ""),
    inspiration_text: String(formData.get("inspiration_text") ?? ""),
    materials_text: String(formData.get("materials_text") ?? ""),
    campaign_mood: String(formData.get("campaign_mood") ?? ""),
    hero_alignment: (String(formData.get("hero_alignment") ?? "center") ||
      "center") as CollectionHeroAlignment,
    text_color: (String(formData.get("text_color") ?? "light") ||
      "light") as CollectionTextColor,
    overlay_opacity: Math.min(
      1,
      Math.max(0, parseNumber(formData.get("overlay_opacity"), 0.35)),
    ),
    title_position: (String(formData.get("title_position") ?? "center") ||
      "center") as CollectionTitlePosition,
    enable_fullscreen_hero: parseCheckbox(formData.get("enable_fullscreen_hero")),
    enable_dark_mode_section: parseCheckbox(
      formData.get("enable_dark_mode_section"),
    ),
    meta_title: String(formData.get("meta_title") ?? "").trim(),
    meta_description: String(formData.get("meta_description") ?? "").trim(),
    og_image: String(formData.get("og_image") ?? "").trim(),
    hidden_from_frontend: parseCheckbox(formData.get("hidden_from_frontend")),
  };
}

export function validateCollectionForm(row: ParsedCollectionForm): string | null {
  if (!row.name) return "Collection name is required";
  if (!row.slug) return "Slug is required";
  if (row.publication_status === "published" && !row.cover_image) {
    return "Cover or hero image is required to publish";
  }
  return null;
}
