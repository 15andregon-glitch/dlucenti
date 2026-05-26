"use server";

import { revalidatePath } from "next/cache";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { actionError, actionSuccess, parseCheckbox } from "@/lib/admin/utils";
import { guardAdminAction } from "@/lib/admin/guard-action";
import { sendShippingConfirmationEmail } from "@/services/emails/send-shipping-email";
import {
  getOrderAdmin,
  updateOrderAdmin,
} from "@/services/supabase/admin-orders";

function revalidateOrder(orderId: string) {
  revalidatePath(ADMIN_ROUTES.orders);
  revalidatePath(ADMIN_ROUTES.order(orderId));
}

function parseOptionalString(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s.length > 0 ? s : null;
}

export async function markOrderProcessingAction(orderId: string) {
  const denied = await guardAdminAction();
  if (denied) return denied;

  try {
    const order = await getOrderAdmin(orderId);
    if (!order) return actionError("Order not found");

    await updateOrderAdmin(orderId, {
      fulfillment_status: "processing",
      status: order.status === "cancelled" ? order.status : "paid",
    });

    revalidateOrder(orderId);
    return actionSuccess();
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to update order");
  }
}

export async function updateOrderFulfillmentAction(
  orderId: string,
  formData: FormData,
) {
  const denied = await guardAdminAction();
  if (denied) return denied;

  try {
    const order = await getOrderAdmin(orderId);
    if (!order) return actionError("Order not found");

    await updateOrderAdmin(orderId, {
      courier: parseOptionalString(formData.get("courier")),
      tracking_number: parseOptionalString(formData.get("tracking_number")),
      tracking_url: parseOptionalString(formData.get("tracking_url")),
      label_url: parseOptionalString(formData.get("label_url")),
      shipping_address: parseOptionalString(formData.get("shipping_address")),
    });

    revalidateOrder(orderId);
    return actionSuccess();
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to save");
  }
}

export async function markOrderShippedAction(
  orderId: string,
  formData: FormData,
) {
  const denied = await guardAdminAction();
  if (denied) return denied;

  try {
    const order = await getOrderAdmin(orderId);
    if (!order) return actionError("Order not found");

    const forceResend = parseCheckbox(formData.get("force_resend_email"));
    const courier = parseOptionalString(formData.get("courier"));
    const trackingNumber = parseOptionalString(formData.get("tracking_number"));
    const trackingUrl = parseOptionalString(formData.get("tracking_url"));
    const labelUrl = parseOptionalString(formData.get("label_url"));
    const shippedAt = new Date().toISOString();

    await updateOrderAdmin(orderId, {
      fulfillment_status: "shipped",
      status: "shipped",
      courier,
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
      label_url: labelUrl,
      shipped_at: order.shipped_at ?? shippedAt,
    });

    const shouldSendEmail =
      Boolean(order.customer_email) &&
      (forceResend || !order.shipping_email_sent_at);

    let emailSent = false;
    if (shouldSendEmail) {
      emailSent = await sendShippingConfirmationEmail({
        id: orderId,
        orderNumber: order.order_number,
        customerEmail: order.customer_email,
        customerName: order.customer_name,
        locale: order.locale,
        trackingNumber,
        trackingUrl,
        courier,
      });

      if (emailSent) {
        await updateOrderAdmin(orderId, {
          shipping_email_sent_at: new Date().toISOString(),
        });
      }
    }

    revalidateOrder(orderId);
    return actionSuccess({ emailSent });
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to mark shipped");
  }
}
