import { PageContainer } from "@/components/layout/PageContainer";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Checkout",
  "Complete your order with complimentary shipping.",
);

export default function CheckoutPage() {
  return (
    <main className="bg-[var(--maison-ivory)] pt-28 pb-[clamp(4rem,10vw,7rem)] md:pt-32">
      <PageContainer>
        <header className="max-w-xl">
          <p className="text-maison-label text-[var(--maison-gold)]">Checkout</p>
          <h1 className="mt-3 font-serif text-[clamp(1.75rem,4vw,2.25rem)] font-normal leading-[1.12] tracking-tight text-[var(--maison-charcoal)]">
            Complete your order
          </h1>
        </header>

        <div className="mt-14 grid gap-16 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(280px,22rem)] lg:gap-20 xl:gap-24">
          <div className="min-w-0 max-w-xl">
            <CheckoutForm />
          </div>

          <div className="border-t border-[var(--maison-hairline)] pt-12 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12 xl:pl-16">
            <OrderSummary />
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
