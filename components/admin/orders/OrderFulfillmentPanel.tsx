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
type DocAction = "label" | "receipt";

export function OrderFulfillmentPanel({ order }: OrderFulfillmentPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [docPending, setDocPending] = useState<DocAction | null>(null);

  const emailSent = Boolean(order.shipping_email_sent_at);
  const labelExists = Boolean(order.packlink_label_url ?? order.label_url);
  const receiptExists = Boolean(order.receipt_pdf_url);

  const handleGenerateDocument = async (kind: DocAction) => {
    setMessage(null);
    setError(null);
    setDocPending(kind);
    try {
      const endpoint =
        kind === "label"
          ? `/api/admin/orders/${order.id}/generate-label`
          : `/api/admin/orders/${order.id}/generate-receipt`;
      const response = await fetch(endpoint, { method: "POST" });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!response.ok || data.ok === false) {
        throw new Error(data.error || `Failed to generate ${kind}`);
      }
      setMessage(
        kind === "label"
          ? "Official carrier label generated."
          : "Packing receipt generated.",
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setDocPending(null);
    }
  };

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
        <Field
          label="Label URL"
          name="label_url"
          defaultValue={order.packlink_label_url ?? order.label_url ?? ""}
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

        <div className="space-y-4 border-t border-[var(--maison-hairline)] pt-6">
          <p className="admin-label">Shipping Label</p>
          <p className="font-sans text-[0.75rem] text-[var(--maison-mist)]">
            {order.shipping_status
              ? `Status: ${order.shipping_status}`
              : "Status: Not generated"}
          </p>
          <p className="font-sans text-[0.75rem] text-[var(--maison-mist)]">
            Carrier: {order.selected_free_shipping_carrier ?? order.courier ?? "—"} • Service:{" "}
            {order.selected_free_shipping_service ?? order.shipping_service_name ?? "—"}
          </p>
          <p className="font-sans text-[0.75rem] text-[var(--maison-mist)]">
            Tracking: {order.packlink_tracking_number ?? order.tracking_number ?? "—"}
          </p>
          <div className="flex flex-wrap gap-3">
            {!labelExists ? (
              <AdminButton
                type="button"
                variant="solid"
                disabled={docPending !== null}
                onClick={() => void handleGenerateDocument("label")}
              >
                {docPending === "label" ? "Generating..." : "Generate shipping label"}
              </AdminButton>
            ) : (
              <>
                <a
                  className="admin-btn"
                  href={`/api/admin/orders/${order.id}/documents/label`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View label
                </a>
                <a
                  className="admin-btn"
                  href={`/api/admin/orders/${order.id}/documents/label?download=1`}
                >
                  Download label
                </a>
                {(order.packlink_tracking_url ?? order.tracking_url) ? (
                  <a
                    className="admin-btn"
                    href={order.packlink_tracking_url ?? order.tracking_url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Track shipment
                  </a>
                ) : null}
              </>
            )}
          </div>
          {order.packlink_label_generated_at ? (
            <p className="font-sans text-[0.75rem] text-[var(--maison-mist)]">
              Label generated{" "}
              {new Date(order.packlink_label_generated_at).toLocaleString("en-GB")}
            </p>
          ) : null}
        </div>

        <div className="space-y-4 border-t border-[var(--maison-hairline)] pt-6">
          <p className="admin-label">Packing Receipt</p>
          <div className="flex flex-wrap gap-3">
            <AdminButton
              type="button"
              variant={receiptExists ? "default" : "solid"}
              disabled={docPending !== null}
              onClick={() => void handleGenerateDocument("receipt")}
            >
              {docPending === "receipt"
                ? "Generating..."
                : receiptExists
                  ? "Regenerate receipt"
                  : "Generate receipt"}
            </AdminButton>
            {receiptExists ? (
              <>
                <a
                  className="admin-btn"
                  href={`/api/admin/orders/${order.id}/documents/receipt`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View receipt
                </a>
                <a
                  className="admin-btn"
                  href={`/api/admin/orders/${order.id}/documents/receipt?download=1`}
                >
                  Download receipt
                </a>
              </>
            ) : null}
          </div>
          {order.receipt_generated_at ? (
            <p className="font-sans text-[0.75rem] text-[var(--maison-mist)]">
              Receipt generated{" "}
              {new Date(order.receipt_generated_at).toLocaleString("en-GB")}
            </p>
          ) : null}
        </div>

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
