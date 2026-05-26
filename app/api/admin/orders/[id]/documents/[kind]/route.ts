import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getOrderAdmin } from "@/services/supabase/admin-orders";

function splitStoragePath(value: string): { bucket: string; path: string } | null {
  const idx = value.indexOf("/");
  if (idx <= 0 || idx === value.length - 1) return null;
  return {
    bucket: value.slice(0, idx),
    path: value.slice(idx + 1),
  };
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string; kind: string }> },
) {
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, kind } = await context.params;
    if (kind !== "label" && kind !== "receipt") {
      return NextResponse.json({ error: "Invalid document kind" }, { status: 400 });
    }

    const order = await getOrderAdmin(id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const rawValue =
      kind === "label"
        ? order.packlink_label_url ?? order.label_url
        : order.receipt_pdf_url;
    if (!rawValue) {
      return NextResponse.json({ error: "Document not generated yet" }, { status: 404 });
    }

    if (rawValue.startsWith("http://") || rawValue.startsWith("https://")) {
      return NextResponse.redirect(rawValue, 302);
    }

    const parsed = splitStoragePath(rawValue);
    if (!parsed) {
      return NextResponse.json({ error: "Invalid stored document path" }, { status: 400 });
    }

    const client = createSupabaseAdminClient();
    const expiresIn = 60 * 10;
    const { data, error } = await client.storage
      .from(parsed.bucket)
      .createSignedUrl(parsed.path, expiresIn, {
        download: request.url.includes("download=1"),
      });
    if (error || !data?.signedUrl) {
      throw new Error(error?.message ?? "Failed to create signed download URL");
    }

    return NextResponse.redirect(data.signedUrl, 302);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Document request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
