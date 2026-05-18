export const ADMIN_ROUTES = {
  home: "/admin",
  products: "/admin/products",
  product: (id: string) => `/admin/products/${id}`,
  productNew: "/admin/products/new",
  collections: "/admin/collections",
  collection: (id: string) => `/admin/collections/${id}`,
  collectionNew: "/admin/collections/new",
  homepage: "/admin/homepage",
  campaigns: "/admin/campaigns",
} as const;

export const ADMIN_NAV = [
  { label: "Overview", href: ADMIN_ROUTES.home },
  { label: "Products", href: ADMIN_ROUTES.products },
  { label: "Collections", href: ADMIN_ROUTES.collections },
  { label: "Homepage", href: ADMIN_ROUTES.homepage },
  { label: "Campaigns", href: ADMIN_ROUTES.campaigns },
] as const;
