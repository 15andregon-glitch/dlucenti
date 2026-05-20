"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { ROUTES } from "@/lib/routes";
import {
  createCollectionAction,
  updateCollectionAction,
} from "@/lib/admin/actions/collections";
import { AdminField } from "@/components/admin/ui/AdminField";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import { AdminTextarea } from "@/components/admin/ui/AdminTextarea";
import { AdminSelect } from "@/components/admin/ui/AdminSelect";
import { AdminCheckbox } from "@/components/admin/ui/AdminCheckbox";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import type { CollectionAdminDetail } from "@/services/supabase/admin-read";

interface CollectionEditorProps {
  collection?: CollectionAdminDetail;
}

export function CollectionEditor({ collection }: CollectionEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isNew = !collection;

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = isNew
        ? await createCollectionAction(formData)
        : await updateCollectionAction(collection!.id, formData);

      if (!result.ok) {
        alert(result.error);
        return;
      }

      if (isNew && "id" in result) {
        router.push(ADMIN_ROUTES.collection(result.id as string));
      } else {
        router.refresh();
      }
    });
  };

  return (
    <form action={handleSubmit} className="grid max-w-3xl gap-10">
      {!isNew && (
        <p className="font-sans text-[0.8125rem] text-[var(--maison-gray)]">
          <a
            href={`${ROUTES.home.replace(/\/$/, "")}/en/collections/${collection.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:underline"
          >
            Preview on storefront →
          </a>
        </p>
      )}

      <AdminPanel title="Basic information">
        <div className="grid gap-8">
          <AdminField label="Collection name" htmlFor="name">
            <AdminInput id="name" name="name" required defaultValue={collection?.name} />
          </AdminField>
          <AdminField label="Slug" htmlFor="slug">
            <AdminInput id="slug" name="slug" required defaultValue={collection?.slug} />
          </AdminField>
          <div className="grid gap-8 sm:grid-cols-2">
            <AdminField label="Short title / season" htmlFor="short_title">
              <AdminInput
                id="short_title"
                name="short_title"
                defaultValue={collection?.short_title}
                placeholder="SS26"
              />
            </AdminField>
            <AdminField label="Launch date" htmlFor="launch_date">
              <AdminInput
                id="launch_date"
                name="launch_date"
                type="date"
                defaultValue={collection?.launch_date ?? ""}
              />
            </AdminField>
          </div>
          <AdminField label="Editorial title" htmlFor="editorial_title">
            <AdminInput
              id="editorial_title"
              name="editorial_title"
              defaultValue={collection?.editorial_title}
            />
          </AdminField>
          <AdminField label="Cinematic statement (subtitle)" htmlFor="subtitle">
            <AdminInput
              id="subtitle"
              name="subtitle"
              defaultValue={collection?.subtitle}
              placeholder="Short editorial line shown on the campaign hero"
            />
          </AdminField>
          <AdminField label="Description" htmlFor="description">
            <AdminTextarea
              id="description"
              name="description"
              defaultValue={collection?.description}
            />
          </AdminField>
          <AdminField label="Status" htmlFor="publication_status">
            <AdminSelect
              id="publication_status"
              name="publication_status"
              defaultValue={collection?.publication_status ?? "draft"}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </AdminSelect>
          </AdminField>
          <div className="flex flex-wrap gap-6">
            <AdminCheckbox
              name="featured"
              label="Featured collection"
              defaultChecked={collection?.featured}
            />
            <AdminCheckbox
              name="hidden_from_frontend"
              label="Hide from storefront"
              defaultChecked={collection?.hidden_from_frontend}
            />
          </div>
        </div>
      </AdminPanel>

      <AdminPanel title="Visual / editorial">
        <div className="grid gap-8">
          <AdminField label="Cover / fallback image URL" htmlFor="cover_image">
            <AdminInput
              id="cover_image"
              name="cover_image"
              defaultValue={collection?.cover_image}
            />
          </AdminField>
          <AdminField
            label="Campaign video URL"
            htmlFor="campaign_video_url"
            hint="Or upload below after saving the collection."
          >
            <AdminInput
              id="campaign_video_url"
              name="campaign_video_url"
              defaultValue={collection?.campaign_video_url ?? ""}
              placeholder="https://… or /videos/campaign.mp4"
            />
          </AdminField>
          <AdminField label="Story body" htmlFor="story_body">
            <AdminTextarea
              id="story_body"
              name="story_body"
              rows={5}
              defaultValue={collection?.story_body}
            />
          </AdminField>
          <AdminField label="Inspiration" htmlFor="inspiration_text">
            <AdminTextarea
              id="inspiration_text"
              name="inspiration_text"
              defaultValue={collection?.inspiration_text}
            />
          </AdminField>
          <AdminField label="Materials" htmlFor="materials_text">
            <AdminTextarea
              id="materials_text"
              name="materials_text"
              defaultValue={collection?.materials_text}
            />
          </AdminField>
          <AdminField label="Campaign mood" htmlFor="campaign_mood">
            <AdminInput
              id="campaign_mood"
              name="campaign_mood"
              defaultValue={collection?.campaign_mood}
            />
          </AdminField>
        </div>
      </AdminPanel>

      <AdminPanel title="Typography / layout">
        <div className="grid gap-8 sm:grid-cols-2">
          <AdminField label="Hero alignment" htmlFor="hero_alignment">
            <AdminSelect
              id="hero_alignment"
              name="hero_alignment"
              defaultValue={collection?.hero_alignment ?? "center"}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </AdminSelect>
          </AdminField>
          <AdminField label="Text color" htmlFor="text_color">
            <AdminSelect
              id="text_color"
              name="text_color"
              defaultValue={collection?.text_color ?? "light"}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </AdminSelect>
          </AdminField>
          <AdminField label="Title position" htmlFor="title_position">
            <AdminSelect
              id="title_position"
              name="title_position"
              defaultValue={collection?.title_position ?? "center"}
            >
              <option value="top">Top</option>
              <option value="center">Center</option>
              <option value="bottom">Bottom</option>
            </AdminSelect>
          </AdminField>
          <AdminField label="Overlay opacity (0–1)" htmlFor="overlay_opacity">
            <AdminInput
              id="overlay_opacity"
              name="overlay_opacity"
              type="number"
              min={0}
              max={1}
              step="0.05"
              defaultValue={collection?.overlay_opacity ?? 0.35}
            />
          </AdminField>
          <AdminCheckbox
            name="enable_fullscreen_hero"
            label="Fullscreen hero"
            defaultChecked={collection?.enable_fullscreen_hero ?? true}
          />
          <AdminCheckbox
            name="enable_dark_mode_section"
            label="Dark story section"
            defaultChecked={collection?.enable_dark_mode_section}
          />
        </div>
      </AdminPanel>

      <AdminPanel title="SEO">
        <div className="grid gap-8">
          <AdminField label="Meta title" htmlFor="meta_title">
            <AdminInput id="meta_title" name="meta_title" defaultValue={collection?.meta_title} />
          </AdminField>
          <AdminField label="Meta description" htmlFor="meta_description">
            <AdminTextarea
              id="meta_description"
              name="meta_description"
              defaultValue={collection?.meta_description}
            />
          </AdminField>
          <AdminField label="OG image URL" htmlFor="og_image">
            <AdminInput id="og_image" name="og_image" defaultValue={collection?.og_image} />
          </AdminField>
        </div>
      </AdminPanel>

      <AdminButton type="submit" variant="solid" disabled={pending} className="w-fit">
        {pending ? "Saving…" : isNew ? "Create collection" : "Save collection"}
      </AdminButton>
    </form>
  );
}
