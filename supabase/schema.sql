-- ============================================================
-- JARVIS.ID — Supabase PostgreSQL Schema
-- ============================================================
-- Run this in Supabase SQL Editor (Dashboard → SQL → New Query).
-- All objects are idempotent (safe to re-run).
--
-- This is the PRODUCTION schema for Supabase PostgreSQL.
-- The sandbox demo uses Prisma + SQLite with an equivalent shape;
-- see prisma/schema.prisma for the demo version.
-- ============================================================

-- Required extension for UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUM TYPES
-- ============================================================
do $$
begin
  -- Service area
  if not exists (select 1 from pg_type where typname = 'service_area_type') then
    create type service_area_type as enum ('ON_SITE', 'SEND_DEVICE');
  end if;

  -- Payment method
  if not exists (select 1 from pg_type where typname = 'payment_method_type') then
    create type payment_method_type as enum ('CASH', 'TRANSFER');
  end if;

  -- Payment status
  if not exists (select 1 from pg_type where typname = 'payment_status_type') then
    create type payment_status_type as enum ('UNPAID', 'WAITING_CONFIRMATION', 'PAID', 'CANCELLED');
  end if;

  -- Order status
  if not exists (select 1 from pg_type where typname = 'order_status_type') then
    create type order_status_type as enum (
      'NEW',
      'WAITING_CONFIRMATION',
      'CONFIRMED',
      'WAITING_SHIPMENT',
      'RECEIVED',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED'
    );
  end if;

  -- Media file type
  if not exists (select 1 from pg_type where typname = 'media_file_type') then
    create type media_file_type as enum ('DAMAGE_PHOTO', 'DAMAGE_VIDEO', 'PAYMENT_PROOF');
  end if;
end$$;

-- ============================================================
-- TABLES
-- ============================================================

-- ------------------------------------------------------------
-- service_orders
-- ------------------------------------------------------------
create table if not exists public.service_orders (
  id                uuid primary key default gen_random_uuid(),
  order_number      text unique not null,
  service_area      service_area_type not null,

  -- Customer
  customer_name     text not null,
  customer_phone    text not null,
  customer_email    text,
  customer_city     text not null,
  customer_province text not null,

  -- Device
  device_brand      text not null,
  device_model      text not null,
  imei              text,
  device_condition  text not null,

  -- Service
  service_type      text[] not null default '{}',
  service_details   text,
  previous_repair   text,
  root_status       text,
  custom_rom_status text,
  water_exposure    text,
  dropped_status    text,

  -- Location (on-site)
  service_address   text,
  service_landmark  text,
  latitude          numeric(10, 7),
  longitude         numeric(10, 7),
  maps_url          text,
  preferred_date    date,
  preferred_time    text,

  -- Shipping (send-device)
  shipping_notes    text,

  -- Payment
  payment_method    payment_method_type not null,
  payment_status    payment_status_type not null default 'UNPAID',

  -- Status
  order_status      order_status_type not null default 'NEW',

  -- Consent
  privacy_consent   boolean not null default false,

  -- Timestamps
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_service_orders_order_number on public.service_orders(order_number);
create index if not exists idx_service_orders_order_status on public.service_orders(order_status);
create index if not exists idx_service_orders_payment_status on public.service_orders(payment_status);
create index if not exists idx_service_orders_customer_phone on public.service_orders(customer_phone);
create index if not exists idx_service_orders_created_at on public.service_orders(created_at desc);

-- ------------------------------------------------------------
-- order_media
-- ------------------------------------------------------------
create table if not exists public.order_media (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.service_orders(id) on delete cascade,
  file_type   media_file_type not null,
  file_name   text not null,
  file_path   text not null,
  file_url    text not null,
  mime_type   text not null,
  file_size   bigint not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_order_media_order_id on public.order_media(order_id);
create index if not exists idx_order_media_file_type on public.order_media(file_type);

-- ------------------------------------------------------------
-- order_status_history
-- ------------------------------------------------------------
create table if not exists public.order_status_history (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.service_orders(id) on delete cascade,
  old_status  text,
  new_status  text not null,
  note        text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_order_status_history_order_id on public.order_status_history(order_id);

-- ------------------------------------------------------------
-- service_notes
-- ------------------------------------------------------------
create table if not exists public.service_notes (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.service_orders(id) on delete cascade,
  note        text not null,
  note_type   text not null default 'GENERAL',
  created_at  timestamptz not null default now()
);

create index if not exists idx_service_notes_order_id on public.service_notes(order_id);

-- ============================================================
-- TRIGGERS — updated_at auto-update
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_service_orders_updated_at on public.service_orders;
create trigger trg_service_orders_updated_at
  before update on public.service_orders
  for each row
  execute function public.handle_updated_at();

-- ============================================================
-- ORDER NUMBER GENERATOR
-- Format: JARVIS-YYYYMMDD-XXXXXX (6 hex chars)
-- ============================================================
create or replace function public.generate_order_number()
returns text
language plpgsql
as $$
declare
  suffix text;
  candidate text;
  date_part text := to_char(now(), 'YYYYMMDD');
begin
  for i in 1..5 loop
    suffix := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    candidate := 'JARVIS-' || date_part || '-' || suffix;
    if not exists (select 1 from public.service_orders where order_number = candidate) then
      return candidate;
    end if;
  end loop;
  -- Fallback with longer suffix
  suffix := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
  return 'JARVIS-' || date_part || '-' || suffix;
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Public (anonymous) customers may CREATE orders but cannot READ others' orders.
-- Authenticated admins (via Supabase Auth) may READ/UPDATE everything.

-- Enable RLS
alter table public.service_orders        enable row level security;
alter table public.order_media           enable row level security;
alter table public.order_status_history  enable row level security;
alter table public.service_notes         enable row level security;

-- ------------------------------------------------------------
-- service_orders policies
-- ------------------------------------------------------------
drop policy if exists "anon can insert orders" on public.service_orders;
create policy "anon can insert orders"
  on public.service_orders for insert
  to anon, authenticated
  with check (true);

drop policy if exists "anon can view own order by id" on public.service_orders;
create policy "anon can view own order by id"
  on public.service_orders for select
  to anon
  using (id = nullif(current_setting('request.cookie.jarvis_order_lookup', true), '')::uuid);

drop policy if exists "admin can view all orders" on public.service_orders;
create policy "admin can view all orders"
  on public.service_orders for select
  to authenticated
  using (true);

drop policy if exists "admin can update orders" on public.service_orders;
create policy "admin can update orders"
  on public.service_orders for update
  to authenticated
  using (true)
  with check (true);

-- ------------------------------------------------------------
-- order_media policies
-- ------------------------------------------------------------
drop policy if exists "anon can insert media" on public.order_media;
create policy "anon can insert media"
  on public.order_media for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admin can view all media" on public.order_media;
create policy "admin can view all media"
  on public.order_media for select
  to authenticated
  using (true);

drop policy if exists "admin can delete media" on public.order_media;
create policy "admin can delete media"
  on public.order_media for delete
  to authenticated
  using (true);

-- ------------------------------------------------------------
-- order_status_history policies
-- ------------------------------------------------------------
drop policy if exists "admin can view status history" on public.order_status_history;
create policy "admin can view status history"
  on public.order_status_history for select
  to authenticated
  using (true);

drop policy if exists "admin can insert status history" on public.order_status_history;
create policy "admin can insert status history"
  on public.order_status_history for insert
  to authenticated
  with check (true);

-- ------------------------------------------------------------
-- service_notes policies
-- ------------------------------------------------------------
drop policy if exists "admin can view notes" on public.service_notes;
create policy "admin can view notes"
  on public.service_notes for select
  to authenticated
  using (true);

drop policy if exists "admin can insert notes" on public.service_notes;
create policy "admin can insert notes"
  on public.service_notes for insert
  to authenticated
  with check (true);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
-- Create the private bucket for service media.
insert into storage.buckets (id, name, public)
values ('service-media', 'service-media', false)
on conflict (id) do nothing;

-- Storage policies: customers can upload to orders/{order_id}/{photos,videos,payment}/
-- but cannot read; admin can read & list.
drop policy if exists "anon can upload service media" on storage.objects;
create policy "anon can upload service media"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'service-media'
    and (storage.foldername(name))[1] = 'orders'
  );

drop policy if exists "admin can read service media" on storage.objects;
create policy "admin can read service media"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'service-media');

drop policy if exists "admin can delete service media" on storage.objects;
create policy "admin can delete service media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'service-media');

-- ============================================================
-- ADMIN USER SETUP (manual)
-- ============================================================
-- Create admin user via Supabase Dashboard → Authentication → Users → Add user.
-- After creating the user, they can sign in at /admin (uses Supabase Auth).
-- Recommended: enable email + password auth, disable public sign-ups
-- (Authentication → Providers → Email → Disable "Allow new users to sign up").

-- ============================================================
-- DONE
-- ============================================================
-- Tables created:
--   - public.service_orders
--   - public.order_media
--   - public.order_status_history
--   - public.service_notes
--
-- Storage bucket created:
--   - service-media (private)
--
-- RLS enabled on all tables with secure policies.
-- Anonymous users can INSERT orders + media only.
-- Authenticated admins can SELECT/UPDATE everything.
-- Updated_at trigger auto-maintains the timestamp.
-- Order number generator: select public.generate_order_number();
