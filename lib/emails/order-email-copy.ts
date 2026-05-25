import type { Locale } from "@/lib/i18n/locale";

type EmailKind = "customer" | "admin";

interface OrderEmailCopy {
  customerSubject: (orderNumber: string) => string;
  adminSubject: (orderNumber: string) => string;
  preheader: (orderNumber: string) => string;
  title: string;
  intro: string;
  orderNumberLabel: string;
  itemsLabel: string;
  subtotalLabel: string;
  shippingLabel: string;
  totalLabel: string;
  shippingAddressLabel: string;
  customerLabel: string;
  inboxNotice: string;
  footer: string;
  adminTitle: string;
  adminIntro: string;
  qty: string;
  complimentaryShipping: string;
}

const COPY: Record<Locale, Record<EmailKind, OrderEmailCopy>> = {
  en: {
    customer: {
      customerSubject: (n) => `Order confirmation #${n}`,
      adminSubject: (n) => `New order #${n}`,
      preheader: (n) => `Your order #${n} has been received.`,
      title: "Order confirmation",
      intro:
        "We have received your order. A summary of your purchase is below.",
      orderNumberLabel: "Order number",
      itemsLabel: "Items",
      subtotalLabel: "Subtotal",
      shippingLabel: "Shipping",
      totalLabel: "Total",
      shippingAddressLabel: "Delivery address",
      customerLabel: "Contact",
      inboxNotice:
        "If you cannot find your confirmation email, please check your spam or promotions folder.",
      footer:
        "You received this email because you placed an order at dlucenti.com. If you have questions, reply to this message.",
      adminTitle: "New order",
      adminIntro: "A paid order was placed on the storefront.",
      qty: "Qty",
      complimentaryShipping: "Included",
    },
    admin: {
      customerSubject: (n) => `Order confirmation #${n}`,
      adminSubject: (n) => `New order #${n}`,
      preheader: (n) => `Paid order #${n}.`,
      title: "New order",
      intro: "Order details for fulfillment.",
      orderNumberLabel: "Order number",
      itemsLabel: "Items",
      subtotalLabel: "Subtotal",
      shippingLabel: "Shipping",
      totalLabel: "Total",
      shippingAddressLabel: "Delivery address",
      customerLabel: "Customer",
      inboxNotice: "",
      footer: "Internal notification from dlucenti.com",
      adminTitle: "New order",
      adminIntro: "Order details for fulfillment.",
      qty: "Qty",
      complimentaryShipping: "Included",
    },
  },
  pt: {
    customer: {
      customerSubject: (n) => `Confirmação da encomenda #${n}`,
      adminSubject: (n) => `Nova encomenda #${n}`,
      preheader: (n) => `A sua encomenda #${n} foi recebida.`,
      title: "Confirmação de encomenda",
      intro:
        "Recebemos a sua encomenda. Encontra abaixo o resumo da compra.",
      orderNumberLabel: "Número de encomenda",
      itemsLabel: "Artigos",
      subtotalLabel: "Subtotal",
      shippingLabel: "Envio",
      totalLabel: "Total",
      shippingAddressLabel: "Morada de entrega",
      customerLabel: "Contacto",
      inboxNotice:
        "Caso não encontre o email de confirmação, verifique a pasta de spam ou promoções.",
      footer:
        "Recebeu este email porque realizou uma encomenda em dlucenti.com. Para questões, responda a este email.",
      adminTitle: "Nova encomenda",
      adminIntro: "Foi registada uma encomenda paga no site.",
      qty: "Qtd",
      complimentaryShipping: "Incluído",
    },
    admin: {
      customerSubject: (n) => `Confirmação da encomenda #${n}`,
      adminSubject: (n) => `Nova encomenda #${n}`,
      preheader: (n) => `Encomenda paga #${n}.`,
      title: "Nova encomenda",
      intro: "Detalhes da encomenda para expedição.",
      orderNumberLabel: "Número de encomenda",
      itemsLabel: "Artigos",
      subtotalLabel: "Subtotal",
      shippingLabel: "Envio",
      totalLabel: "Total",
      shippingAddressLabel: "Morada de entrega",
      customerLabel: "Cliente",
      inboxNotice: "",
      footer: "Notificação interna — dlucenti.com",
      adminTitle: "Nova encomenda",
      adminIntro: "Detalhes da encomenda para expedição.",
      qty: "Qtd",
      complimentaryShipping: "Incluído",
    },
  },
};

export function getOrderEmailCopy(
  locale: Locale,
  kind: EmailKind,
): OrderEmailCopy {
  return COPY[locale][kind];
}
