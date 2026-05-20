/** CMS-ready editorial video payload (Supabase storage URL or local path). */
export type EditorialVideoMedia = {
  src: string;
  posterSrc: string;
  posterAlt?: string;
  mimeType?: string;
};
