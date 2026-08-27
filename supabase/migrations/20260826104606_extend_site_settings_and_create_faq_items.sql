-- Etapa 5 del CMS institucional: Contacto, Footer y Configuración global
-- restante se resuelven ampliando site_settings de forma aditiva (sin
-- duplicar dirección, teléfonos, correo ni redes sociales, que ya existen
-- desde la Etapa 2). Se agrega además la tabla faq_items. No se modifica
-- ninguna política ni columna existente.

-- =========================================================================
-- site_settings: columnas nuevas, todas opcionales (con respaldo estático
-- si quedan vacías, igual que el resto de la fila).
-- =========================================================================
alter table public.site_settings
  add column if not exists logo_url text,
  add column if not exists rbd text,
  add column if not exists map_query text,
  add column if not exists contact_section_eyebrow text,
  add column if not exists contact_section_title text,
  add column if not exists contact_section_description text;

-- Semilla del RBD y de los textos de la sección Contacto, con el contenido
-- real actualmente hardcodeado, para que no quede en blanco al pasar a
-- editable. logo_url y map_query quedan en null a propósito: se resuelven
-- con respaldo (logo estático / dirección calculada) mientras no se fijen
-- explícitamente desde el admin.
update public.site_settings
set
  rbd = coalesce(rbd, '42064-0'),
  contact_section_eyebrow = coalesce(contact_section_eyebrow, 'Hablemos'),
  contact_section_title = coalesce(contact_section_title, 'Estamos aquí para ti'),
  contact_section_description =
    coalesce(contact_section_description, 'Escríbenos y responderemos a la brevedad.')
where id = 1;

-- =========================================================================
-- faq_items
-- =========================================================================
create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  -- 'text' = respuesta normal; 'schedule' = además de "answer", el sitio
  -- público agrega debajo la lista de horarios vigente desde site_settings,
  -- para no duplicar esa información como texto estático.
  content_type text not null default 'text' check (content_type in ('text', 'schedule')),
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists faq_items_visible_sort_idx
  on public.faq_items (is_visible, sort_order);

drop trigger if exists set_faq_items_updated_at on public.faq_items;
create trigger set_faq_items_updated_at
  before update on public.faq_items
  for each row execute function public.set_updated_at();

alter table public.faq_items enable row level security;

drop policy if exists public_select_visible_faq_items on public.faq_items;
create policy public_select_visible_faq_items
  on public.faq_items
  for select
  using (is_visible = true);

drop policy if exists admin_select_all_faq_items on public.faq_items;
create policy admin_select_all_faq_items
  on public.faq_items
  for select
  using (public.is_admin());

drop policy if exists admin_insert_faq_items on public.faq_items;
create policy admin_insert_faq_items
  on public.faq_items
  for insert
  with check (public.is_admin());

drop policy if exists admin_update_faq_items on public.faq_items;
create policy admin_update_faq_items
  on public.faq_items
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists admin_delete_faq_items on public.faq_items;
create policy admin_delete_faq_items
  on public.faq_items
  for delete
  using (public.is_admin());

-- Semilla con las 5 preguntas reales actualmente en src/data/faq.ts. La
-- pregunta de horarios usa content_type = 'schedule': su "answer" es solo
-- la frase introductoria, y el listado de horarios se agrega en tiempo
-- real desde site_settings (sin duplicarlo aquí como texto estático).
insert into public.faq_items (question, answer, content_type, sort_order)
select v.question, v.answer, v.content_type, v.sort_order
from (values
  (
    '¿Cómo puedo solicitar información?',
    'Puedes comunicarte con nosotros a través del formulario de contacto de nuestra página web, escribirnos al correo arcoiris.florencia2020@gmail.com o contactarnos mediante nuestras redes sociales. Estaremos encantados de resolver tus consultas.',
    'text',
    0
  ),
  (
    '¿Qué documentación se requiere?',
    'La documentación puede variar según el nivel y el proceso de matrícula. Contáctanos para conocer los antecedentes requeridos y recibir orientación personalizada.',
    'text',
    1
  ),
  (
    '¿Cuáles son los horarios?',
    'Contamos con distintas alternativas de jornada:',
    'schedule',
    2
  ),
  (
    '¿Cómo puedo conocer el jardín?',
    'Puedes contactarnos para coordinar una visita y conocer personalmente nuestras instalaciones, propuesta educativa y los espacios donde niños y niñas desarrollan sus experiencias de aprendizaje.',
    'text',
    3
  ),
  (
    '¿Cómo solicitar una entrevista?',
    'Puedes solicitar una entrevista mediante nuestro formulario de contacto, correo electrónico o redes sociales, indicando tus datos y el motivo de la consulta. Nos comunicaremos contigo para coordinarla.',
    'text',
    4
  )
) as v(question, answer, content_type, sort_order)
where not exists (select 1 from public.faq_items);
