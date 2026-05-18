import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import {
  listCampaignsAdmin,
  listCollectionsAdmin,
  listProductsAdmin,
} from "@/services/supabase/admin-read";

const LINKS = [
  {
    href: ADMIN_ROUTES.products,
    title: "Products",
    description: "Catalog, imagery, and merchandising flags",
  },
  {
    href: ADMIN_ROUTES.collections,
    title: "Collections",
    description: "Seasonal edits and cover art",
  },
  {
    href: ADMIN_ROUTES.homepage,
    title: "Homepage",
    description: "Hero video, featured collection, New In",
  },
  {
    href: ADMIN_ROUTES.campaigns,
    title: "Campaigns",
    description: "Editorial gallery frames",
  },
] as const;

export default async function AdminHomePage() {
  let counts = { products: 0, collections: 0, campaigns: 0 };

  try {
    const [products, collections, campaigns] = await Promise.all([
      listProductsAdmin(),
      listCollectionsAdmin(),
      listCampaignsAdmin(),
    ]);
    counts = {
      products: products.length,
      collections: collections.length,
      campaigns: campaigns.length,
    };
  } catch {
    // Overview still renders if Supabase is unreachable
  }

  return (
    <AdminShell
      title="Overview"
      description="Manage storefront content without touching code."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Products" value={counts.products} />
        <Stat label="Collections" value={counts.collections} />
        <Stat label="Campaign frames" value={counts.campaigns} />
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {LINKS.map((item) => (
          <Link key={item.href} href={item.href} className="group block">
            <AdminPanel className="transition-colors duration-500 group-hover:border-[var(--maison-gold-muted)]">
              <h2 className="font-serif text-[1.125rem] text-[var(--maison-charcoal)]">
                {item.title}
              </h2>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-[var(--maison-gray)]">
                {item.description}
              </p>
            </AdminPanel>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <AdminPanel>
      <p className="admin-label">{label}</p>
      <p className="mt-2 font-serif text-[2rem] tabular-nums leading-none text-[var(--maison-charcoal)]">
        {value}
      </p>
    </AdminPanel>
  );
}
