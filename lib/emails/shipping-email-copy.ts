import type { Locale } from "@/lib/i18n/locale";

interface ShippingEmailCopy {
  subject: (orderNumber: string) => string;
  preheader: (orderNumber: string) => string;
  title: string;
  intro: string;
  orderLabel: string;
  trackingLabel: string;
  trackCta: string;
  footer: string;
}

const COPY: Record<Locale, ShippingEmailCopy> = {
  en: {
    subject: (n) => `Your order has shipped #${n}`,
    preheader: (n) => `Order #${n} has been dispatched.`,
    title: "Shipment update",
    intro:
      "Your order has been dispatched. Tracking details are below when available.",
    orderLabel: "Order number",
    trackingLabel: "Tracking",
    trackCta: "Track parcel",
    footer:
      "You received this email because you placed an order at dlucenti.com.",
  },
  pt: {
    subject: (n) => `Encomenda expedida #${n}`,
    preheader: (n) => `A encomenda #${n} foi expedida.`,
    title: "Atualização de envio",
    intro:
      "A sua encomenda foi expedida. Os dados de rastreio encontram-se abaixo, quando disponíveis.",
    orderLabel: "Número de encomenda",
    trackingLabel: "Rastreio",
    trackCta: "Seguir envio",
    footer:
      "Recebeu este email porque realizou uma encomenda em dlucenti.com.",
  },
};

export function getShippingEmailCopy(locale: Locale): ShippingEmailCopy {
  return COPY[locale] ?? COPY.en;
}
