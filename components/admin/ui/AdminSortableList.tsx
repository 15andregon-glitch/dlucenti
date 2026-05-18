"use client";

import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/cn";

export interface SortableItem {
  id: string;
  label: string;
  meta?: string;
  preview?: React.ReactNode;
}

interface AdminSortableListProps {
  items: SortableItem[];
  onReorder: (orderedIds: string[]) => Promise<{ ok: boolean; error?: string }>;
}

export function AdminSortableList({ items: initial, onReorder }: AdminSortableListProps) {
  const [items, setItems] = useState(initial);

  useEffect(() => {
    setItems(initial);
  }, [initial]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleDragStart = (id: string) => setDragId(id);

  const handleDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault();
    if (!dragId || dragId === overId) return;

    setItems((prev) => {
      const from = prev.findIndex((i) => i.id === dragId);
      const to = prev.findIndex((i) => i.id === overId);
      if (from < 0 || to < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleDragEnd = () => {
    const orderedIds = items.map((i) => i.id);
    setDragId(null);
    startTransition(async () => {
      setError(null);
      const result = await onReorder(orderedIds);
      if (!result.ok) setError(result.error ?? "Failed to save order");
    });
  };

  return (
    <div className={cn("space-y-2", pending && "opacity-70")}>
      {items.map((item) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(item.id)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDragEnd={handleDragEnd}
          data-dragging={dragId === item.id}
          className="admin-sortable-item flex items-center gap-4 border border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] px-4 py-3"
        >
          <span className="text-[0.75rem] text-[var(--maison-mist)]" aria-hidden>
            ⋮⋮
          </span>
          {item.preview}
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-[0.8125rem] text-[var(--maison-charcoal)]">
              {item.label}
            </p>
            {item.meta && (
              <p className="text-[0.75rem] text-[var(--maison-mist)]">{item.meta}</p>
            )}
          </div>
        </div>
      ))}
      {error && (
        <p className="text-[0.75rem] text-[var(--maison-gray)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
