import {
  ADMIN_AUTH_CALLBACK_PATH,
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
} from "@/lib/admin/auth-urls";

export const ADMIN_ROUTES = {
  login: ADMIN_LOGIN_PATH,
  home: ADMIN_HOME_PATH,
  authCallback: ADMIN_AUTH_CALLBACK_PATH,
  products: "/admin/products",
  product: (id: string) => `/admin/products/${id}`,
  productNew: "/admin/products/new",
  collections: "/admin/collections",
  collection: (id: string) => `/admin/collections/${id}`,
  collectionNew: "/admin/collections/new",
  homepage: "/admin/homepage",
  campaigns: "/admin/campaigns",
  footer: "/admin/footer",
  finance: "/admin/finance",
  financeDr: "/admin/finance/dr",
  financeCosts: "/admin/finance/costs",
  financeRevenue: "/admin/finance/revenue",
  financeAnalytics: "/admin/finance/analytics",
} as const;

export type AdminRoutePath =
  | (typeof ADMIN_ROUTES)[Exclude<keyof typeof ADMIN_ROUTES, "product" | "collection">]
  | ReturnType<(typeof ADMIN_ROUTES)["product"]>
  | ReturnType<(typeof ADMIN_ROUTES)["collection"]>;

export const FINANCE_NAV = [
  { label: "Overview", href: ADMIN_ROUTES.finance },
  { label: "Income statement", href: ADMIN_ROUTES.financeDr },
  { label: "Revenue", href: ADMIN_ROUTES.financeRevenue },
  { label: "Costs", href: ADMIN_ROUTES.financeCosts },
  { label: "Analytics", href: ADMIN_ROUTES.financeAnalytics },
] as const;

export const ADMIN_NAV = [
  { label: "Overview", href: ADMIN_ROUTES.home },
  { label: "Products", href: ADMIN_ROUTES.products },
  { label: "Collections", href: ADMIN_ROUTES.collections },
  { label: "Homepage", href: ADMIN_ROUTES.homepage },
  { label: "Campaigns", href: ADMIN_ROUTES.campaigns },
  { label: "Footer", href: ADMIN_ROUTES.footer },
  { label: "Finance", href: ADMIN_ROUTES.finance },
] as const;
