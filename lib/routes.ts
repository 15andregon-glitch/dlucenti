export const ROUTES = {
  home: "/",
  shop: "/shop",
  collections: "/collections",
  collection: (slug: string) => `/collections/${slug}`,
  product: (slug: string) => `/shop/${slug}`,
  about: "/about",
  journal: "/journal",
  journalPost: (slug: string) => `/journal/${slug}`,
  contact: "/contact",
  checkout: "/checkout",
  dashboard: "/dashboard",
  dashboardProducts: "/dashboard/products",
  dashboardOrders: "/dashboard/orders",
  dashboardCampaigns: "/dashboard/campaigns",
} as const;

export const NAV_LINKS = [
  { label: "Shop", href: ROUTES.shop },
  { label: "Collections", href: ROUTES.collections },
  { label: "About", href: ROUTES.about },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];
