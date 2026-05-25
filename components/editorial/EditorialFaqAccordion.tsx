"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface EditorialFaqAccordionProps {
  items: FaqItem[];
}

export function EditorialFaqAccordion({ items }: EditorialFaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="editorial-faq max-w-2xl">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div
            key={item.id}
            className="border-b border-[var(--maison-hairline)] last:border-b-0"
          >
            <button
              type="button"
              id={`faq-${item.id}`}
              aria-expanded={open}
              aria-controls={`faq-panel-${item.id}`}
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-baseline justify-between gap-6 py-6 text-left transition-colors duration-500 ease-[var(--ease-maison)] hover:text-[var(--maison-gold)] md:py-7"
            >
              <span className="font-sans text-[0.9375rem] font-normal leading-snug tracking-normal text-[var(--maison-charcoal)]">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-[var(--maison-mist)] transition-transform duration-500 ease-[var(--ease-maison)]",
                  open && "rotate-180",
                )}
                strokeWidth={1.25}
                aria-hidden
              />
            </button>
            <div
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-${item.id}`}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-maison)] motion-reduce:transition-none",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-6 pr-4 font-sans text-[0.875rem] leading-[1.75] text-[var(--maison-gray)] md:pb-7">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
