import type { Locale } from "@/lib/i18n/locale";

interface ShippingEmailCopy {
  subject: string;
  preheader: string;
  title: string;
  intro: string;
  orderLabel: string;
  trackingLabel: string;
  trackCta: string;
  footer: string;
}

const COPY: Record<Locale, ShippingEmailCopy> = {
  en: {
    subject: "Your order is on its way · D'LUCENTI",
    preheader: "Your order has been dispatched.",
    title: "Dispatched",
    intro:
      "Your order has left our atelier. We hope you enjoy your selection.",
    orderLabel: "Order",
    trackingLabel: "Tracking",
    trackCta: "Track shipment",
    footer: "Thank you for choosing D'LUCENTI.",
  },
  pt: {
    subject: "A sua encomenda foi expedida · D'LUCENTI",
    preheader: "A sua encomenda está a caminho.",
    title: "Expedida",
    intro:
      "A sua encomenda saiu do nosso atelier. Desejamos que aprecie a sua seleção.",
    orderLabel: "Encomenda",
    trackingLabel: "Rastreio",
    trackCta: "Seguir envio",
    footer: "Obrigado por escolher a D'LUCENTI.",
  },
};

export function getShippingEmailCopy(locale: Locale): ShippingEmailCopy {
  return COPY[locale] ?? COPY.en;
}
