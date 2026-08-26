-- Jardín Infantil Arcoíris Florencia
-- Etapa 2 del CMS institucional: Configuración general + Equipo.
-- Reutiliza el patrón de autorización ya existente (public.is_admin() +
-- admin_users, creados en 20260825120000_create_family_testimonials.sql).
-- No modifica ninguna tabla, política ni función existente.

-- ---------------------------------------------------------------------
-- Función auxiliar: mantiene updated_at al día en cada UPDATE.
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- site_settings — fila única (singleton) con la configuración
-- institucional y los textos/imagen del Hero.
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id                          smallint primary key default 1,
  name                        text not null,
  short_name                  text not null,
  address_street              text,
  sector                      text,
  region                      text,
  -- [{ "display": "+56 9 ...", "whatsapp": "56..." }, ...]
  phones                      jsonb not null default '[]'::jsonb,
  email                       text,
  -- [{ "label": "Jornada Completa", "hours": "08:00 a 18:30" }, ...]
  schedules                   jsonb not null default '[]'::jsonb,
  social_facebook             text,
  social_instagram            text,
  hero_title_prefix           text,
  hero_title_highlight        text,
  hero_subtitle               text,
  hero_primary_button_label   text,
  hero_primary_button_href    text,
  hero_secondary_button_label text,
  hero_secondary_button_href  text,
  hero_image_url              text,
  updated_at                  timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

comment on table public.site_settings is
  'Configuración institucional única del sitio (fila singleton, id siempre 1). Editable solo por administradores; lectura pública.';

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

-- Público: puede leer la configuración completa (no contiene datos sensibles).
create policy "public_select_site_settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

-- Administradores: pueden crear (solo la primera vez) y actualizar.
-- Sin política de DELETE: la fila singleton no debe poder borrarse desde la app.
create policy "admin_insert_site_settings"
  on public.site_settings
  for insert
  to authenticated
  with check (public.is_admin());

create policy "admin_update_site_settings"
  on public.site_settings
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Semilla: solo si la tabla está vacía, con los datos reales ya
-- publicados hoy en src/data/siteConfig.ts y src/components/Hero.tsx.
insert into public.site_settings (
  id, name, short_name, address_street, sector, region, phones, email, schedules,
  social_facebook, social_instagram,
  hero_title_prefix, hero_title_highlight, hero_subtitle,
  hero_primary_button_label, hero_primary_button_href,
  hero_secondary_button_label, hero_secondary_button_href,
  hero_image_url
)
select
  1,
  'Jardín Infantil Arcoíris Florencia',
  'Arcoíris Florencia',
  'General Manuel Baquedano 283',
  'Llolleo',
  'Región de Valparaíso',
  '[{"display":"+56 9 5961 3494","whatsapp":"56959613494"},{"display":"+56 9 3540 3115","whatsapp":"56935403115"}]'::jsonb,
  'arcoiris.florencia2020@gmail.com',
  '[{"label":"Jornada Completa","hours":"08:00 a 18:30"},{"label":"Media Jornada Mañana","hours":"08:00 a 13:00"},{"label":"Media Jornada Tarde","hours":"13:30 a 18:30"}]'::jsonb,
  'https://www.facebook.com/arcoiris.florencia/',
  'https://www.instagram.com/jardin.arcoirisflorencia/',
  'Aprendemos, jugamos y',
  'crecemos juntos',
  'En Jardín Infantil Arcoíris Florencia acompañamos los primeros aprendizajes de niños y niñas en un ambiente acogedor, seguro y lleno de oportunidades para descubrir, aprender y crecer.',
  'Conoce nuestro jardín', '#nuestro-jardin',
  'Contáctanos', '#contacto',
  '/images/PORTADA.jpeg'
where not exists (select 1 from public.site_settings);

-- ---------------------------------------------------------------------
-- team_members — integrantes del equipo, ordenables y con visibilidad.
-- ---------------------------------------------------------------------
create table if not exists public.team_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(trim(name)) between 2 and 100),
  role        text not null check (char_length(trim(role)) between 2 and 100),
  photo_url   text,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.team_members is
  'Integrantes del equipo mostrados en la página pública. Solo is_visible = true es público, ordenado por sort_order.';

create index if not exists team_members_visible_sort_idx
  on public.team_members (is_visible, sort_order);

create trigger team_members_set_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

alter table public.team_members enable row level security;

-- Público: solo integrantes visibles.
create policy "public_select_visible_team_members"
  on public.team_members
  for select
  to anon, authenticated
  using (is_visible = true);

-- Administradores: pueden ver todos (incluidos ocultos) y hacer CRUD completo.
create policy "admin_select_all_team_members"
  on public.team_members
  for select
  to authenticated
  using (public.is_admin());

create policy "admin_insert_team_members"
  on public.team_members
  for insert
  to authenticated
  with check (public.is_admin());

create policy "admin_update_team_members"
  on public.team_members
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_delete_team_members"
  on public.team_members
  for delete
  to authenticated
  using (public.is_admin());

-- Semilla: solo si la tabla está vacía, con los integrantes reales ya
-- publicados hoy en src/data/team.ts. Las fotos siguen sirviéndose desde
-- /public/images/equipo/ (archivos estáticos existentes) — no se suben a
-- Storage en la migración; una foto solo pasa a Storage cuando un
-- administrador la reemplaza desde /admin.
insert into public.team_members (name, role, photo_url, sort_order, is_visible)
select * from (values
  ('Rosa Verdugo Matamala', 'Directora', '/images/equipo/directora-rosa-verdugo.jpg', 1, true),
  ('Daniela Araya Cisternas', 'Técnico en Educación Parvularia', '/images/equipo/daniela-araya-cisternas.jpg', 2, true),
  ('Valentina Jeria Cuevas', 'Técnico en Educación Parvularia', '/images/equipo/valentina-jeria-cuevas.jpg', 3, true),
  ('Grimilda Matamala', 'Auxiliar de Servicios', '/images/equipo/grimilda-matamala.jpg', 4, true)
) as seed(name, role, photo_url, sort_order, is_visible)
where not exists (select 1 from public.team_members);

-- ---------------------------------------------------------------------
-- Storage: bucket público para fotografías administradas desde /admin.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('public-media', 'public-media', true)
on conflict (id) do nothing;

-- Lectura pública de cualquier archivo del bucket (son todas fotos
-- institucionales destinadas a mostrarse en el sitio público).
create policy "public_read_public_media"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'public-media');

-- Escritura, actualización y eliminación solo para administradores.
create policy "admin_insert_public_media"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'public-media' and public.is_admin());

create policy "admin_update_public_media"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'public-media' and public.is_admin())
  with check (bucket_id = 'public-media' and public.is_admin());

create policy "admin_delete_public_media"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'public-media' and public.is_admin());
