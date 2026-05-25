"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import {
  markOrderProcessingAction,
  markOrderShippedAction,
  updateOrderFulfillmentAction,
} from "@/lib/admin/actions/orders";
import type { OrderWithItems } from "@/queries/orders";

interface OrderFulfillmentPanelProps {
  order: OrderWithItems;
}

type FulfillmentAction = "save" | "processing" | "shipped";

export function OrderFulfillmentPanel({ order }: OrderFulfillmentPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const emailSent = Boolean(order.shipping_email_sent_at);

  const submit = (action: FulfillmentAction, form: HTMLFormElement) => {
    setMessage(null);
    setError(null);
    const formData = new FormData(form);
    if (action === "shipped") {
      formData.set(
        "force_resend_email",
        formData.get("force_resend_email") ? "on" : "",
      );
    }

    startTransition(async () => {
      let result: { ok: boolean; error?: string; emailSent?: boolean };
      if (action === "processing") {
        result = await markOrderProcessingAction(order.id);
      } else if (action === "shipped") {
        result = await markOrderShippedAction(order.id, formData);
      } else {
        result = await updateOrderFulfillmentAction(order.id, formData);
      }

      if (!result.ok) {
        setError(result.error ?? "Something went wrong");
        return;
      }

      if ("emailSent" in result && result.emailSent) {
        setMessage("Marked as shipped. Shipping confirmation email sent.");
      } else if (action === "shipped") {
        setMessage("Marked as shipped.");
      } else if (action === "processing") {
        setMessage("Marked as processing.");
      } else {
        setMessage("Saved.");
      }
      router.refresh();
    });
  };

  return (
    <AdminPanel title="Fulfillment">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          const action = (e.nativeEvent as SubmitEvent).submitter?.getAttribute(
            "data-action",
          ) as FulfillmentAction | null;
          submit(action ?? "save", e.currentTarget);
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Courier" name="courier" defaultValue={order.courier ?? ""} />
          <Field
            label="Tracking number"
            name="tracking_number"
            defaultValue={order.tracking_number ?? ""}
          />
        </div>
        <Field
          label="Tracking URL"
          name="tracking_url"
          defaultValue={order.tracking_url ?? ""}
        />
        <div>
          <label className="admin-label" htmlFor="shipping_address">
            Shipping address
          </label>
          <textarea
            id="shipping_address"
            name="shipping_address"
            rows={4}
            defaultValue={order.shipping_address ?? ""}
            className="mt-1.5 w-full resize-y border border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] px-4 py-2.5 font-sans text-[0.8125rem] leading-relaxed text-[var(--maison-charcoal)] focus:border-[var(--maison-charcoal)] focus:outline-none"
          />
        </div>

        {order.fulfillment_status === "shipped" && emailSent ? (
          <label className="flex items-center gap-2 font-sans text-[0.8125rem] text-[var(--maison-gray)]">
            <input
              type="checkbox"
              name="force_resend_email"
              className="accent-[var(--maison-charcoal)]"
            />
            Resend shipping confirmation email
          </label>
        ) : null}

        <div className="flex flex-wrap gap-3 border-t border-[var(--maison-hairline)] pt-6">
          <AdminButton
            type="submit"
            data-action="processing"
            variant="default"
            disabled={pending || order.fulfillment_status === "processing"}
          >
            Mark processing
          </AdminButton>
          <AdminButton type="submit" data-action="save" variant="default" disabled={pending}>
            Save details
          </AdminButton>
          <AdminButton type="submit" data-action="shipped" variant="solid" disabled={pending}>
            Mark shipped
          </AdminButton>
        </div>

        {emailSent ? (
          <p className="font-sans text-[0.75rem] text-[var(--maison-mist)]">
            Shipping email sent{" "}
            {order.shipping_email_sent_at
              ? new Date(order.shipping_email_sent_at).toLocaleString("en-GB")
              : ""}
          </p>
        ) : (
          <p className="font-sans text-[0.75rem] text-[var(--maison-mist)]">
            Mark shipped sends a shipping confirmation email when a customer email is on file.
          </p>
        )}

        {order.shipped_at ? (
          <p className="font-sans text-[0.75rem] text-[var(--maison-mist)]">
            Shipped at {new Date(order.shipped_at).toLocaleString("en-GB")}
          </p>
        ) : null}

        {message ? (
          <p className="font-sans text-[0.8125rem] text-[var(--maison-charcoal)]" role="status">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="font-sans text-[0.8125rem] text-[var(--maison-charcoal)]" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </AdminPanel>
  );
}

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <div>
      <label className="admin-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="mt-1.5 w-full border border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] px-4 py-2.5 font-sans text-[0.8125rem] text-[var(--maison-charcoal)] focus:border-[var(--maison-charcoal)] focus:outline-none"
      />
    </div>
  );
}
