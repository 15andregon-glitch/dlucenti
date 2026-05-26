"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadStripe, type StripeEmbeddedCheckout } from "@stripe/stripe-js";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/cn";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

interface StripeEmbeddedCheckoutProps {
  locale: string;
  items: { productId: string; quantity: number }[];
}

export function StripeEmbeddedCheckout({ locale, items }: StripeEmbeddedCheckoutProps) {
  const { t } = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<StripeEmbeddedCheckout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientSecret = useCallback(async () => {
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale, items }),
    });

    const data = (await response.json()) as {
      clientSecret?: string;
      error?: string;
    };

    if (!response.ok || !data.clientSecret) {
      throw new Error(data.error ?? t("checkout.errorGeneric"));
    }

    return data.clientSecret;
  }, [locale, items, t]);

  useEffect(() => {
    let cancelled = false;

    async function mountCheckout() {
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
      if (!publishableKey) {
        setError(t("checkout.errorGeneric"));
        setLoading(false);
        return;
      }

      const stripe = await stripePromise;
      if (!stripe || cancelled || !containerRef.current) {
        setError(t("checkout.errorGeneric"));
        setLoading(false);
        return;
      }

      try {
        const clientSecret = await fetchClientSecret();
        if (cancelled) return;

        const embeddedCheckout = await stripe.createEmbeddedCheckoutPage({
          fetchClientSecret: async () => clientSecret,
          onShippingDetailsChange: async (event) => {
            const response = await fetch("/api/stripe/checkout/shipping", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                checkoutSessionId: event.checkoutSessionId,
                shippingDetails: event.shippingDetails,
              }),
            });

            const data = (await response.json()) as { message?: string };

            if (!response.ok) {
              return {
                type: "reject" as const,
                errorMessage:
                  data.message ??
                  (locale === "pt"
                    ? "Não foi possível calcular o envio para esta morada."
                    : "Unable to calculate shipping for this address."),
              };
            }

            return { type: "accept" as const };
          },
        });

        if (cancelled) {
          embeddedCheckout.destroy();
          return;
        }

        checkoutRef.current = embeddedCheckout;
        embeddedCheckout.mount(containerRef.current);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : t("checkout.errorGeneric"),
          );
          setLoading(false);
        }
      }
    }

    void mountCheckout();

    return () => {
      cancelled = true;
      checkoutRef.current?.destroy();
      checkoutRef.current = null;
    };
  }, [fetchClientSecret, locale, t]);

  return (
    <div className="space-y-6">
      {loading ? (
        <p className="font-sans text-[0.8125rem] text-[var(--maison-gray)]">
          {t("checkout.redirecting")}
        </p>
      ) : null}

      {error ? (
        <p
          className="font-sans text-[0.8125rem] text-[var(--maison-charcoal)]"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div
        ref={containerRef}
        className={cn(
          "min-h-[28rem] w-full",
          (loading || error) && "sr-only",
        )}
      />
    </div>
  );
}
