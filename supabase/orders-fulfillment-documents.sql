-- =============================================================================
-- Orders — fulfillment documents (official label + packing receipt)
-- =============================================================================

alter table public.orders
  add column if not exists packlink_shipment_id text,
  add column if not exists packlink_tracking_number text,
  add column if not exists packlink_tracking_url text,
  add column if not exists packlink_label_url text,
  add column if not exists packlink_label_generated_at timestamptz,
  add column if not exists shipping_status text,
  add column if not exists receipt_pdf_url text,
  add column if not exists receipt_generated_at timestamptz;
