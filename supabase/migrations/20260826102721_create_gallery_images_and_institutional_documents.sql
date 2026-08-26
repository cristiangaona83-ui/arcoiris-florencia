-- Etapa 4 del CMS institucional: Galería y Documentos institucionales,
-- siguiendo el mismo patrón admin_users + is_admin() ya establecido.
-- No se modifica ninguna política ni tabla existente. Reutiliza el bucket
-- público `public-media` (carpetas nuevas gallery/ y documents/), sin
-- crear buckets nuevos.

-- =========================================================================
-- gallery_images
-- =========================================================================
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  image_url text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_images_visible_sort_idx
  on public.gallery_images (is_visible, sort_order);

drop trigger if exists set_gallery_images_updated_at on public.gallery_images;
create trigger set_gallery_images_updated_at
  before update on public.gallery_images
  for each row execute function public.set_updated_at();

alter table public.gallery_images enable row level security;

drop policy if exists public_select_visible_gallery_images on public.gallery_images;
create policy public_select_visible_gallery_images
  on public.gallery_images
  for select
  using (is_visible = true);

drop policy if exists admin_select_all_gallery_images on public.gallery_images;
create policy admin_select_all_gallery_images
  on public.gallery_images
  for select
  using (public.is_admin());

drop policy if exists admin_insert_gallery_images on public.gallery_images;
create policy admin_insert_gallery_images
  on public.gallery_images
  for insert
  with check (public.is_admin());

drop policy if exists admin_update_gallery_images on public.gallery_images;
create policy admin_update_gallery_images
  on public.gallery_images
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists admin_delete_gallery_images on public.gallery_images;
create policy admin_delete_gallery_images
  on public.gallery_images
  for delete
  using (public.is_admin());

-- Semilla con las fotografías reales actualmente en src/data/gallery.ts,
-- preservando categoría, ruta e "alt" exactos, y el orden actual como
-- sort_order.
insert into public.gallery_images (category, image_url, alt_text, sort_order)
select v.category, v.image_url, v.alt_text, v.sort_order
from (values
  ('Nuestro Jardín', '/images/galeria/nuestro-jardin-01.jpg', 'Fachada del Jardín Infantil Arcoíris Florencia', 0),
  ('Experiencias de aprendizaje', '/images/galeria/experiencias-aprendizaje-01.jpg', 'Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia', 1),
  ('Experiencias de aprendizaje', '/images/galeria/experiencias-aprendizaje-02.jpg', 'Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia', 2),
  ('Experiencias de aprendizaje', '/images/galeria/experiencias-aprendizaje-03.jpg', 'Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia', 3),
  ('Experiencias de aprendizaje', '/images/galeria/experiencias-aprendizaje-04.jpg', 'Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia', 4),
  ('Experiencias de aprendizaje', '/images/galeria/experiencias-aprendizaje-05.jpg', 'Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia', 5),
  ('Experiencias de aprendizaje', '/images/galeria/experiencias-aprendizaje-06.jpg', 'Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia', 6),
  ('Experiencias de aprendizaje', '/images/galeria/experiencias-aprendizaje-07.jpg', 'Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia', 7),
  ('Experiencias de aprendizaje', '/images/galeria/experiencias-aprendizaje-08.jpg', 'Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia', 8),
  ('Experiencias de aprendizaje', '/images/galeria/experiencias-aprendizaje-09.jpg', 'Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia', 9),
  ('Experiencias de aprendizaje', '/images/galeria/experiencias-aprendizaje-10.jpg', 'Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia', 10),
  ('Experiencias de aprendizaje', '/images/galeria/experiencias-aprendizaje-11.jpg', 'Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia', 11),
  ('Experiencias de aprendizaje', '/images/galeria/experiencias-aprendizaje-12.jpg', 'Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia', 12),
  ('KidZania', '/images/kidzania/1.jpeg', 'Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia', 13),
  ('KidZania', '/images/kidzania/2.jpeg', 'Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia', 14),
  ('KidZania', '/images/kidzania/3.jpeg', 'Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia', 15),
  ('KidZania', '/images/kidzania/4.jpeg', 'Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia', 16),
  ('KidZania', '/images/kidzania/5.jpeg', 'Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia', 17),
  ('KidZania', '/images/kidzania/6.jpeg', 'Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia', 18),
  ('KidZania', '/images/kidzania/7.jpeg', 'Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia', 19),
  ('KidZania', '/images/kidzania/8.jpeg', 'Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia', 20),
  ('KidZania', '/images/kidzania/9.jpeg', 'Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia', 21),
  ('KidZania', '/images/kidzania/10.jpeg', 'Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia', 22),
  ('Celebraciones', '/images/galeria/celebraciones-01.jpg', 'Celebración en el Jardín Infantil Arcoíris Florencia', 23),
  ('Celebraciones', '/images/galeria/celebraciones-02.jpg', 'Celebración en el Jardín Infantil Arcoíris Florencia', 24),
  ('Celebraciones', '/images/galeria/celebraciones-03.jpg', 'Celebración en el Jardín Infantil Arcoíris Florencia', 25),
  ('Celebraciones', '/images/galeria/celebraciones-04.jpg', 'Celebración en el Jardín Infantil Arcoíris Florencia', 26),
  ('Celebraciones', '/images/galeria/celebraciones-05.jpg', 'Celebración en el Jardín Infantil Arcoíris Florencia', 27),
  ('Celebraciones', '/images/galeria/celebraciones-06.jpg', 'Celebración en el Jardín Infantil Arcoíris Florencia', 28),
  ('Día del Niño', '/images/dia-del-nino/1.jpeg', 'Celebración del Día del Niño y la Niña — Jardín Infantil Arcoíris Florencia', 29),
  ('Día del Niño', '/images/dia-del-nino/2.jpeg', 'Celebración del Día del Niño y la Niña — Jardín Infantil Arcoíris Florencia', 30),
  ('Día del Niño', '/images/dia-del-nino/3.jpeg', 'Celebración del Día del Niño y la Niña — Jardín Infantil Arcoíris Florencia', 31),
  ('Día del Niño', '/images/dia-del-nino/4.jpeg', 'Celebración del Día del Niño y la Niña — Jardín Infantil Arcoíris Florencia', 32),
  ('Día del Niño', '/images/dia-del-nino/5.jpeg', 'Celebración del Día del Niño y la Niña — Jardín Infantil Arcoíris Florencia', 33),
  ('Comunidad educativa', '/images/galeria/comunidad-educativa-01.jpg', 'Comunidad educativa del Jardín Infantil Arcoíris Florencia', 34)
) as v(category, image_url, alt_text, sort_order)
where not exists (select 1 from public.gallery_images);

-- =========================================================================
-- institutional_documents
-- =========================================================================
create table if not exists public.institutional_documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null default 'Otros',
  file_url text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists institutional_documents_visible_sort_idx
  on public.institutional_documents (is_visible, sort_order);

drop trigger if exists set_institutional_documents_updated_at on public.institutional_documents;
create trigger set_institutional_documents_updated_at
  before update on public.institutional_documents
  for each row execute function public.set_updated_at();

alter table public.institutional_documents enable row level security;

drop policy if exists public_select_visible_institutional_documents on public.institutional_documents;
create policy public_select_visible_institutional_documents
  on public.institutional_documents
  for select
  using (is_visible = true);

drop policy if exists admin_select_all_institutional_documents on public.institutional_documents;
create policy admin_select_all_institutional_documents
  on public.institutional_documents
  for select
  using (public.is_admin());

drop policy if exists admin_insert_institutional_documents on public.institutional_documents;
create policy admin_insert_institutional_documents
  on public.institutional_documents
  for insert
  with check (public.is_admin());

drop policy if exists admin_update_institutional_documents on public.institutional_documents;
create policy admin_update_institutional_documents
  on public.institutional_documents
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists admin_delete_institutional_documents on public.institutional_documents;
create policy admin_delete_institutional_documents
  on public.institutional_documents
  for delete
  using (public.is_admin());

-- Semilla con los 2 documentos reales actualmente en src/data/documents.ts.
insert into public.institutional_documents (name, description, category, file_url, sort_order)
select
  'Proyecto Educativo Institucional (PEI) 2026',
  'Documento que define la identidad, principios y orientaciones pedagógicas del jardín para el año 2026.',
  'Proyecto Educativo',
  '/documents/pei-2026.pdf',
  0
where not exists (select 1 from public.institutional_documents where name = 'Proyecto Educativo Institucional (PEI) 2026');

insert into public.institutional_documents (name, description, category, file_url, sort_order)
select
  'Reglamento Interno 2026',
  'Normas y procedimientos internos que regulan la convivencia y funcionamiento del jardín durante el año 2026.',
  'Reglamento Interno',
  '/documents/reglamento-interno-2026.pdf',
  1
where not exists (select 1 from public.institutional_documents where name = 'Reglamento Interno 2026');
