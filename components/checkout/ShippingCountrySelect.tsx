"use client";

import { CHECKOUT_SHIPPING_COUNTRIES } from "@/lib/shipping";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/cn";

interface ShippingCountrySelectProps {
  value: string;
  onChange: (country: string) => void;
  className?: string;
}

export function ShippingCountrySelect({
  value,
  onChange,
  className,
}: ShippingCountrySelectProps) {
  const { t } = useTranslations();

  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor="shipping-country"
        className="text-maison-label text-[var(--maison-mist)]"
      >
        {t("checkout.deliveryCountry")}
      </label>
      <select
        id="shipping-country"
        name="shipping-country"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full max-w-xs border-0 border-b border-[var(--maison-hairline)] bg-transparent",
          "py-2 font-sans text-[0.875rem] text-[var(--maison-charcoal)]",
          "outline-none transition-colors duration-500 ease-[var(--ease-maison)]",
          "focus:border-[var(--maison-charcoal)]",
        )}
      >
        {CHECKOUT_SHIPPING_COUNTRIES.map((code) => (
          <option key={code} value={code}>
            {t(`countries.${code}` as "countries.PT")}
          </option>
        ))}
      </select>
    </div>
  );
}
