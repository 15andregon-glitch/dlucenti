"use client";

import { cn } from "@/lib/cn";
import type { ProductTargetGender } from "@/types/database/schema";

const OPTIONS: { value: ProductTargetGender; label: string }[] = [
  { value: "women", label: "Mulher" },
  { value: "men", label: "Homem" },
  { value: "unisex", label: "Unissexo" },
];

interface AdminTargetGenderFieldProps {
  name?: string;
  defaultValue?: ProductTargetGender;
}

/** Maison-styled gender targeting — hidden radios + segmented labels */
export function AdminTargetGenderField({
  name = "target_gender",
  defaultValue = "unisex",
}: AdminTargetGenderFieldProps) {
  return (
    <div
      className="inline-flex max-w-md flex-wrap gap-0 border border-[var(--maison-hairline)]"
      role="radiogroup"
      aria-label="Categoria"
    >
      {OPTIONS.map((option, index) => (
        <label
          key={option.value}
          className={cn(
            "relative cursor-pointer px-5 py-2.5 font-sans text-[0.8125rem] tracking-[0.04em] transition-colors duration-300",
            index > 0 && "border-l border-[var(--maison-hairline)]",
            "has-[:checked]:bg-[var(--maison-charcoal)] has-[:checked]:text-[var(--maison-ivory)]",
            "has-[:not(:checked)]:text-[var(--maison-gray)] has-[:not(:checked)]:hover:text-[var(--maison-charcoal)]",
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            defaultChecked={defaultValue === option.value}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
