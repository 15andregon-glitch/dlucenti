import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { FinanceMetricCard } from "@/components/admin/finance/FinanceMetricCard";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import {
  getBusinessModeSnapshot,
  getPreLaunchOperationalMetrics,
} from "@/services/finance/business-mode";
import {
  listCampaignsAdmin,
  listCollectionsAdmin,
  listProductsAdmin,
} from "@/services/supabase/admin-read";

const LINKS = [
  {
    href: ADMIN_ROUTES.products,
    title: "Products",
    description: "Catalog, unit economics, inventory, and publishing",
  },
  {
    href: ADMIN_ROUTES.orders,
    title: "Orders",
    description: "Stripe orders, fulfillment, and shipping notifications",
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
  {
    href: ADMIN_ROUTES.finance,
    title: "Finance",
    description: "Pre-launch operations and income statement",
  },
  {
    href: ADMIN_ROUTES.footer,
    title: "Footer",
    description: "Contact, social links, and bilingual copy",
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

  const [business, ops] = await Promise.all([
    getBusinessModeSnapshot(),
    getPreLaunchOperationalMetrics(),
  ]);

  const isPreLaunch = business.mode === "pre_launch";

  return (
    <AdminShell
      title="Overview"
      description={
        isPreLaunch
          ? "Pre-launch operations — catalog and inventory metrics only."
          : "Storefront and financial operations."
      }
    >
      {isPreLaunch ? (
        <>
          <AdminPanel className="mb-8" title="Pre-launch mode">
            <p className="font-sans text-[0.8125rem] leading-relaxed text-[var(--maison-gray)]">
              No sales yet. Financial analytics will appear after the first orders. Add products
              with selling price and unit cost to track inventory value and theoretical margin.
            </p>
          </AdminPanel>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FinanceMetricCard label="Products" value={ops.totalProducts} format="number" />
            <FinanceMetricCard
              label="Inventory units"
              value={ops.totalStockUnits}
              format="number"
            />
            <FinanceMetricCard label="Inventory value" value={ops.inventoryValue} />
            <FinanceMetricCard
              label="Avg. margin (theoretical)"
              value={ops.averageMarginPercent}
              format="percent"
            />
          </div>
        </>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Products" value={counts.products} />
          <Stat label="Collections" value={counts.collections} />
          <Stat label="Campaign frames" value={counts.campaigns} />
        </div>
      )}

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {LINKS.map((item) => (
          <Link key={item.href} href={item.href} className="group block">
            <AdminPanel className="transition-colors duration-500 group-hover:border-[var(--maison-gold-muted)]">
              <h2 className="font-sans font-extralight text-[1.125rem] text-[var(--maison-charcoal)]">
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
      <p className="mt-2 font-sans font-extralight text-[2rem] tabular-nums leading-none text-[var(--maison-charcoal)]">
        {value}
      </p>
    </AdminPanel>
  );
}
