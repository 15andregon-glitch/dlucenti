import { ROUTES } from "@/lib/routes";

export const DASHBOARD_NAV = [
  { label: "Overview", href: ROUTES.dashboard },
  { label: "Products", href: ROUTES.dashboardProducts },
  { label: "Orders", href: ROUTES.dashboardOrders },
  { label: "Campaigns", href: ROUTES.dashboardCampaigns },
] as const;
