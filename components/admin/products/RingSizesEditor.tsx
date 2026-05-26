"use client";

import { useState, useTransition } from "react";
import { saveRingSizesAction } from "@/lib/admin/actions/product-variants";
import type { RingSizeInput } from "@/queries/product-variants";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminField } from "@/components/admin/ui/AdminField";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { cn } from "@/lib/cn";

export interface RingSizeRow {
  id?: string;
  label: string;
  sku: string;
  stockQuantity: number;
  isActive: boolean;
  sortOrder: number;
}

interface RingSizesEditorProps {
  productId: string;
  initialSizes: RingSizeRow[];
}

function emptyRow(sortOrder: number): RingSizeRow {
  return {
    label: "",
    sku: "",
    stockQuantity: 0,
    isActive: true,
    sortOrder,
  };
}

export function RingSizesEditor({ productId, initialSizes }: RingSizesEditorProps) {
  const [sizes, setSizes] = useState<RingSizeRow[]>(initialSizes);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const move = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= sizes.length) return;
    setSizes((rows) => {
      const copy = [...rows];
      const [row] = copy.splice(index, 1);
      copy.splice(next, 0, row);
      return copy.map((r, i) => ({ ...r, sortOrder: i }));
    });
  };

  const save = () => {
    setMessage(null);
    const payload: RingSizeInput[] = sizes.map((row, index) => ({
      id: row.id,
      label: row.label,
      sku: row.sku.trim() || null,
      stockQuantity: row.stockQuantity,
      isActive: row.isActive,
      sortOrder: index,
    }));

    startTransition(async () => {
      const result = await saveRingSizesAction(productId, payload);
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setMessage("Ring sizes saved.");
    });
  };

  return (
    <AdminPanel title="Ring sizes">
      <p className="mb-6 font-sans text-[0.75rem] leading-relaxed text-[var(--maison-mist)]">
        Stock for this ring is managed per size. Total product stock syncs from
        active sizes after save.
      </p>

      <div className="space-y-4">
        {sizes.length === 0 ? (
          <p className="font-sans text-[0.8125rem] text-[var(--maison-mist)]">
            No sizes yet. Add the first size below.
          </p>
        ) : null}

        {sizes.map((row, index) => (
          <div
            key={row.id ?? `new-${index}`}
            className="grid gap-4 border border-[var(--maison-hairline)] p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_6rem_5rem_auto]"
          >
            <AdminField label="Size" htmlFor={`ring-size-${index}`}>
              <AdminInput
                id={`ring-size-${index}`}
                value={row.label}
                onChange={(e) =>
                  setSizes((rows) =>
                    rows.map((r, i) =>
                      i === index ? { ...r, label: e.target.value } : r,
                    ),
                  )
                }
                placeholder="14"
              />
            </AdminField>
            <AdminField label="SKU" htmlFor={`ring-sku-${index}`}>
              <AdminInput
                id={`ring-sku-${index}`}
                value={row.sku}
                onChange={(e) =>
                  setSizes((rows) =>
                    rows.map((r, i) =>
                      i === index ? { ...r, sku: e.target.value } : r,
                    ),
                  )
                }
                placeholder="DLU-RING-001-14"
              />
            </AdminField>
            <AdminField label="Stock" htmlFor={`ring-stock-${index}`}>
              <AdminInput
                id={`ring-stock-${index}`}
                type="number"
                min={0}
                value={row.stockQuantity}
                onChange={(e) =>
                  setSizes((rows) =>
                    rows.map((r, i) =>
                      i === index
                        ? { ...r, stockQuantity: Number(e.target.value) }
                        : r,
                    ),
                  )
                }
              />
            </AdminField>
            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2 font-sans text-[0.8125rem] text-[var(--maison-charcoal)]">
                <input
                  type="checkbox"
                  checked={row.isActive}
                  onChange={(e) =>
                    setSizes((rows) =>
                      rows.map((r, i) =>
                        i === index ? { ...r, isActive: e.target.checked } : r,
                      ),
                    )
                  }
                  className="h-3.5 w-3.5 accent-[var(--maison-charcoal)]"
                />
                Active
              </label>
            </div>
            <div className="flex items-end gap-2 pb-1">
              <button
                type="button"
                className="font-sans text-[0.75rem] text-[var(--maison-mist)] hover:text-[var(--maison-charcoal)]"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="font-sans text-[0.75rem] text-[var(--maison-mist)] hover:text-[var(--maison-charcoal)]"
                onClick={() => move(index, 1)}
                disabled={index === sizes.length - 1}
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                className="font-sans text-[0.75rem] text-[var(--maison-mist)] hover:text-[var(--maison-charcoal)]"
                onClick={() =>
                  setSizes((rows) =>
                    rows
                      .filter((_, i) => i !== index)
                      .map((r, i) => ({ ...r, sortOrder: i })),
                  )
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <AdminButton
          type="button"
          variant="default"
          onClick={() =>
            setSizes((rows) => [...rows, emptyRow(rows.length)])
          }
        >
          Add size
        </AdminButton>
        <AdminButton
          type="button"
          variant="solid"
          disabled={pending}
          onClick={save}
        >
          {pending ? "Saving sizes…" : "Save ring sizes"}
        </AdminButton>
        {message ? (
          <p
            className={cn(
              "font-sans text-[0.8125rem]",
              message.includes("saved")
                ? "text-[var(--maison-charcoal)]"
                : "text-red-700",
            )}
          >
            {message}
          </p>
        ) : null}
      </div>
    </AdminPanel>
  );
}
