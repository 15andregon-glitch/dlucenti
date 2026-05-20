"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  createFooterSocialLinkAction,
  deleteFooterSocialLinkAction,
  reorderFooterSocialLinksAction,
  toggleFooterSocialLinkActiveAction,
  updateFooterSettingsAction,
  updateFooterSocialLinkAction,
} from "@/lib/admin/actions/footer";
import { DEFAULT_FOOTER_CONTENT } from "@/lib/data/footer-defaults";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { AdminField } from "@/components/admin/ui/AdminField";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminCheckbox } from "@/components/admin/ui/AdminCheckbox";
import { AdminSortableList } from "@/components/admin/ui/AdminSortableList";
import type { FooterSettingsRow, FooterSocialLinkRow } from "@/types/database";

interface FooterEditorProps {
  settings: FooterSettingsRow | null;
  socialLinks: FooterSocialLinkRow[];
}

const defaults = DEFAULT_FOOTER_CONTENT;

export function FooterEditor({ settings, socialLinks }: FooterEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const sortedLinks = [...socialLinks].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-10">
      <AdminPanel title="Footer copy & contact">
        <p className="mb-6 text-[0.8125rem] text-[var(--maison-gray)]">
          Bilingual fields power the storefront footer. English and Portuguese versions switch
          with the language toggle.
        </p>
        <form
          className="grid max-w-3xl gap-8"
          action={(fd) => {
            startTransition(async () => {
              const result = await updateFooterSettingsAction(fd);
              if (!result.ok) alert(result.error);
              else router.refresh();
            });
          }}
        >
          <AdminField label="Contact email" htmlFor="contact_email">
            <AdminInput
              id="contact_email"
              name="contact_email"
              type="email"
              required
              defaultValue={settings?.contact_email ?? defaults.contactEmail}
            />
          </AdminField>

          <p className="admin-label border-t border-[var(--maison-hairline)] pt-6">Slogan</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <AdminField label="English" htmlFor="slogan_en">
              <AdminInput
                id="slogan_en"
                name="slogan_en"
                required
                defaultValue={settings?.slogan_en ?? defaults.slogan.en}
              />
            </AdminField>
            <AdminField label="Português" htmlFor="slogan_pt">
              <AdminInput
                id="slogan_pt"
                name="slogan_pt"
                required
                defaultValue={settings?.slogan_pt ?? defaults.slogan.pt}
              />
            </AdminField>
          </div>

          <p className="admin-label border-t border-[var(--maison-hairline)] pt-6">Location</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <AdminField label="English" htmlFor="location_en">
              <AdminInput
                id="location_en"
                name="location_en"
                required
                defaultValue={settings?.location_en ?? defaults.location.en}
              />
            </AdminField>
            <AdminField label="Português" htmlFor="location_pt">
              <AdminInput
                id="location_pt"
                name="location_pt"
                required
                defaultValue={settings?.location_pt ?? defaults.location.pt}
              />
            </AdminField>
          </div>

          <p className="admin-label border-t border-[var(--maison-hairline)] pt-6">
            Section titles
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <AdminField label="Explore — EN" htmlFor="explore_title_en">
              <AdminInput
                id="explore_title_en"
                name="explore_title_en"
                required
                defaultValue={settings?.explore_title_en ?? defaults.exploreTitle.en}
              />
            </AdminField>
            <AdminField label="Explorar — PT" htmlFor="explore_title_pt">
              <AdminInput
                id="explore_title_pt"
                name="explore_title_pt"
                required
                defaultValue={settings?.explore_title_pt ?? defaults.exploreTitle.pt}
              />
            </AdminField>
            <AdminField label="House — EN" htmlFor="maison_title_en">
              <AdminInput
                id="maison_title_en"
                name="maison_title_en"
                required
                defaultValue={settings?.maison_title_en ?? defaults.maisonTitle.en}
              />
            </AdminField>
            <AdminField label="A Casa — PT" htmlFor="maison_title_pt">
              <AdminInput
                id="maison_title_pt"
                name="maison_title_pt"
                required
                defaultValue={settings?.maison_title_pt ?? defaults.maisonTitle.pt}
              />
            </AdminField>
            <AdminField label="Contacts — EN" htmlFor="contacts_title_en">
              <AdminInput
                id="contacts_title_en"
                name="contacts_title_en"
                required
                defaultValue={settings?.contacts_title_en ?? defaults.contactsTitle.en}
              />
            </AdminField>
            <AdminField label="Contactos — PT" htmlFor="contacts_title_pt">
              <AdminInput
                id="contacts_title_pt"
                name="contacts_title_pt"
                required
                defaultValue={settings?.contacts_title_pt ?? defaults.contactsTitle.pt}
              />
            </AdminField>
            <AdminField label="Socials — EN" htmlFor="socials_title_en">
              <AdminInput
                id="socials_title_en"
                name="socials_title_en"
                required
                defaultValue={settings?.socials_title_en ?? defaults.socialsTitle.en}
              />
            </AdminField>
            <AdminField label="Redes Sociais — PT" htmlFor="socials_title_pt">
              <AdminInput
                id="socials_title_pt"
                name="socials_title_pt"
                required
                defaultValue={settings?.socials_title_pt ?? defaults.socialsTitle.pt}
              />
            </AdminField>
          </div>

          <AdminButton type="submit" variant="solid" disabled={pending}>
            Save footer settings
          </AdminButton>
        </form>
      </AdminPanel>

      <AdminPanel title="Social links">
        <p className="mb-6 text-[0.8125rem] text-[var(--maison-gray)]">
          Drag to reorder. Deactivate to hide a link on the live site.
        </p>

        {sortedLinks.length > 0 && (
          <AdminSortableList
            items={sortedLinks.map((link) => ({
              id: link.id,
              label: link.label,
              meta: link.active ? link.url : "Inactive",
            }))}
            onReorder={async (ids) => {
              const ordered = ids.map((id, position) => ({ id, position }));
              return reorderFooterSocialLinksAction(ordered);
            }}
          />
        )}

        <ul className="mt-8 space-y-6">
          {sortedLinks.map((link) => (
            <li
              key={link.id}
              className="border-t border-[var(--maison-hairline)] pt-6"
            >
              <form
                className="grid max-w-xl gap-4"
                action={(fd) => {
                  startTransition(async () => {
                    const result = await updateFooterSocialLinkAction(link.id, fd);
                    if (!result.ok) alert(result.error);
                    else router.refresh();
                  });
                }}
              >
                <AdminField label="Label" htmlFor={`label-${link.id}`}>
                  <AdminInput
                    id={`label-${link.id}`}
                    name="label"
                    defaultValue={link.label}
                    required
                  />
                </AdminField>
                <AdminField label="URL" htmlFor={`url-${link.id}`}>
                  <AdminInput
                    id={`url-${link.id}`}
                    name="url"
                    type="url"
                    defaultValue={link.url}
                    required
                  />
                </AdminField>
                <AdminCheckbox name="active" label="Active" defaultChecked={link.active} />
                <div className="flex flex-wrap gap-3">
                  <AdminButton type="submit" disabled={pending}>
                    Update link
                  </AdminButton>
                  <AdminButton
                    type="button"
                    onClick={() => {
                      startTransition(async () => {
                        await toggleFooterSocialLinkActiveAction(link.id, !link.active);
                        router.refresh();
                      });
                    }}
                  >
                    {link.active ? "Deactivate" : "Activate"}
                  </AdminButton>
                  <AdminButton
                    type="button"
                    variant="danger"
                    onClick={() => {
                      if (!confirm(`Remove ${link.label}?`)) return;
                      startTransition(async () => {
                        const result = await deleteFooterSocialLinkAction(link.id);
                        if (!result.ok) alert(result.error);
                        else router.refresh();
                      });
                    }}
                  >
                    Delete
                  </AdminButton>
                </div>
              </form>
            </li>
          ))}
        </ul>

        <form
          className="mt-10 grid max-w-xl gap-4 border-t border-[var(--maison-hairline)] pt-8"
          action={(fd) => {
            startTransition(async () => {
              const result = await createFooterSocialLinkAction(fd);
              if (!result.ok) alert(result.error);
              else router.refresh();
            });
          }}
        >
          <p className="admin-label">Add social link</p>
          <AdminField label="Label" htmlFor="new-label">
            <AdminInput id="new-label" name="label" required placeholder="Instagram" />
          </AdminField>
          <AdminField label="URL" htmlFor="new-url">
            <AdminInput
              id="new-url"
              name="url"
              type="url"
              required
              placeholder="https://instagram.com/..."
            />
          </AdminField>
          <AdminCheckbox name="active" label="Active" defaultChecked />
          <AdminButton type="submit" variant="solid" disabled={pending}>
            Add link
          </AdminButton>
        </form>
      </AdminPanel>
    </div>
  );
}
