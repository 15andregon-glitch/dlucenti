import type { Locale } from "@/lib/i18n/locale";

type EmailKind = "customer" | "admin";

interface OrderEmailCopy {
  customerSubject: string;
  adminSubject: (orderNumber: string) => string;
  preheader: string;
  title: string;
  intro: string;
  orderNumberLabel: string;
  itemsLabel: string;
  subtotalLabel: string;
  shippingLabel: string;
  totalLabel: string;
  shippingAddressLabel: string;
  customerLabel: string;
  footer: string;
  adminTitle: string;
  adminIntro: string;
  qty: string;
}

const COPY: Record<Locale, Record<EmailKind, OrderEmailCopy>> = {
  en: {
    customer: {
      customerSubject: "Your order confirmation · D'LUCENTI",
      adminSubject: (n) => `New order ${n} · D'LUCENTI`,
      preheader: "Thank you for your order.",
      title: "Order confirmed",
      intro:
        "Thank you for your purchase. Your order has been received and is being prepared with care.",
      orderNumberLabel: "Order",
      itemsLabel: "Your selection",
      subtotalLabel: "Subtotal",
      shippingLabel: "Shipping",
      totalLabel: "Total",
      shippingAddressLabel: "Delivery address",
      customerLabel: "Contact",
      footer:
        "You will receive a separate message when your order is dispatched, if tracking is available.",
      adminTitle: "New order",
      adminIntro: "A new order has been placed on the storefront.",
      qty: "Qty",
    },
    admin: {
      customerSubject: "Your order confirmation · D'LUCENTI",
      adminSubject: (n) => `New order ${n} · D'LUCENTI`,
      preheader: "New storefront order.",
      title: "New order",
      intro: "A new paid order has been received.",
      orderNumberLabel: "Order",
      itemsLabel: "Items",
      subtotalLabel: "Subtotal",
      shippingLabel: "Shipping",
      totalLabel: "Total",
      shippingAddressLabel: "Delivery address",
      customerLabel: "Customer",
      footer: "Stripe webhook · automated notification",
      adminTitle: "New order",
      adminIntro: "Order details below.",
      qty: "Qty",
    },
  },
  pt: {
    customer: {
      customerSubject: "Confirmação de encomenda · D'LUCENTI",
      adminSubject: (n) => `Nova encomenda ${n} · D'LUCENTI`,
      preheader: "Obrigado pela sua encomenda.",
      title: "Encomenda confirmada",
      intro:
        "Obrigado pela sua compra. A sua encomenda foi recebida e será preparada com o devido cuidado.",
      orderNumberLabel: "Encomenda",
      itemsLabel: "A sua seleção",
      subtotalLabel: "Subtotal",
      shippingLabel: "Envio",
      totalLabel: "Total",
      shippingAddressLabel: "Morada de entrega",
      customerLabel: "Contacto",
      footer:
        "Receberá nova comunicação quando a encomenda for expedida, se o rastreio estiver disponível.",
      adminTitle: "Nova encomenda",
      adminIntro: "Foi registada uma nova encomenda no storefront.",
      qty: "Qtd",
    },
    admin: {
      customerSubject: "Confirmação de encomenda · D'LUCENTI",
      adminSubject: (n) => `Nova encomenda ${n} · D'LUCENTI`,
      preheader: "Nova encomenda no storefront.",
      title: "Nova encomenda",
      intro: "Nova encomenda paga recebida.",
      orderNumberLabel: "Encomenda",
      itemsLabel: "Artigos",
      subtotalLabel: "Subtotal",
      shippingLabel: "Envio",
      totalLabel: "Total",
      shippingAddressLabel: "Morada de entrega",
      customerLabel: "Cliente",
      footer: "Stripe webhook · notificação automática",
      adminTitle: "Nova encomenda",
      adminIntro: "Detalhes da encomenda.",
      qty: "Qtd",
    },
  },
};

export function getOrderEmailCopy(
  locale: Locale,
  kind: EmailKind,
): OrderEmailCopy {
  return COPY[locale][kind];
}
