-- Jardín Infantil Arcoíris Florencia
-- Feature: "Experiencias de nuestras familias" — opiniones públicas de apoderados
-- con moderación (pendiente / aprobado / rechazado / oculto).
--
-- Este proyecto no tenía Supabase configurado previamente: esta es la
-- primera migración, no continúa una numeración existente.

-- ---------------------------------------------------------------------
-- Tabla principal
-- ---------------------------------------------------------------------
create table if not exists public.family_testimonials (
  id                  uuid primary key default gen_random_uuid(),
  guardian_name       text not null check (char_length(trim(guardian_name)) between 2 and 80),
  relationship        text not null check (relationship in ('madre', 'padre', 'apoderado_a', 'otro')),
  comment             text not null check (char_length(trim(comment)) between 10 and 600),
  rating              smallint check (rating between 1 and 5),
  consent_to_publish  boolean not null default false,
  status              text not null default 'pendiente'
                        check (status in ('pendiente', 'aprobado', 'rechazado', 'oculto')),
  created_at          timestamptz not null default now(),
  reviewed_at         timestamptz,
  reviewed_by         uuid references auth.users(id) on delete set null,
  published_at        timestamptz,
  -- Honeypot anti-spam: campo oculto en el formulario público. Un bot que
  -- rellene todos los campos automáticamente probablemente lo complete;
  -- un humano nunca lo ve ni lo llena. Debe llegar vacío.
  hp_field            text
);

comment on table public.family_testimonials is
  'Opiniones de apoderados sobre su experiencia en el jardín. Requieren aprobación manual antes de publicarse.';

create index if not exists family_testimonials_status_published_idx
  on public.family_testimonials (status, published_at desc);

create index if not exists family_testimonials_created_at_idx
  on public.family_testimonials (created_at desc);

-- ---------------------------------------------------------------------
-- Lista de administradores autorizados a moderar
-- (se puebla manualmente desde el panel de Supabase; no expuesta al público)
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

comment on table public.admin_users is
  'Lista de usuarios autorizados a moderar opiniones de familias. Se administra manualmente vía SQL/dashboard de Supabase.';

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.family_testimonials enable row level security;
alter table public.admin_users enable row level security;

-- Público: puede INSERTAR una opinión, solo si llega en estado "pendiente",
-- sin campos de revisión ya rellenados, con consentimiento marcado, y con
-- el honeypot vacío (si un bot lo rellena, el insert es rechazado por RLS).
create policy "public_insert_testimonials"
  on public.family_testimonials
  for insert
  to anon, authenticated
  with check (
    status = 'pendiente'
    and consent_to_publish = true
    and reviewed_at is null
    and reviewed_by is null
    and published_at is null
    and coalesce(hp_field, '') = ''
  );

-- Público: solo puede LEER comentarios aprobados.
create policy "public_select_approved"
  on public.family_testimonials
  for select
  to anon, authenticated
  using (status = 'aprobado');

-- Administradores: pueden leer todo (para moderar).
create policy "admin_select_all"
  on public.family_testimonials
  for select
  to authenticated
  using (public.is_admin());

-- Administradores: pueden aprobar, rechazar, editar y ocultar
-- (todo mediante UPDATE; no se expone DELETE vía API pública).
create policy "admin_update_all"
  on public.family_testimonials
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- admin_users: sin políticas para anon/authenticated → acceso denegado por
-- defecto para todos salvo el service_role (usado solo desde el dashboard
-- de Supabase para dar de alta administradores).
