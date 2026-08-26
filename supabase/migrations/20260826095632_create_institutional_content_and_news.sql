-- Etapa 3 del CMS institucional: Institución (Historia / Misión / Visión /
-- Principios y valores) y Noticias, siguiendo el mismo patrón de
-- admin_users + is_admin() ya establecido. No se modifica ninguna política
-- ni tabla existente.

-- =========================================================================
-- institutional_content: fila única (singleton), igual patrón que
-- site_settings. Los párrafos de Historia admiten **texto** para negrita,
-- reemplazando el resaltado por lista fija de términos que usaba
-- HistorySection.tsx (más simple de editar desde el admin).
-- =========================================================================
create table if not exists public.institutional_content (
  id smallint primary key default 1,
  history_paragraphs jsonb not null default '[]'::jsonb,
  mission_text text,
  vision_text text,
  principles_summary text,
  principles_items jsonb not null default '[]'::jsonb,
  values_summary text,
  values_items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint institutional_content_singleton check (id = 1)
);

drop trigger if exists set_institutional_content_updated_at on public.institutional_content;
create trigger set_institutional_content_updated_at
  before update on public.institutional_content
  for each row execute function public.set_updated_at();

alter table public.institutional_content enable row level security;

drop policy if exists public_select_institutional_content on public.institutional_content;
create policy public_select_institutional_content
  on public.institutional_content
  for select
  using (true);

drop policy if exists admin_insert_institutional_content on public.institutional_content;
create policy admin_insert_institutional_content
  on public.institutional_content
  for insert
  with check (public.is_admin());

drop policy if exists admin_update_institutional_content on public.institutional_content;
create policy admin_update_institutional_content
  on public.institutional_content
  for update
  using (public.is_admin())
  with check (public.is_admin());

-- Semilla con el contenido real actualmente en HistorySection.tsx y
-- projectPillars.ts, marcando en negrita ("**texto**") exactamente los
-- mismos términos que hoy resalta highlightTerms().
insert into public.institutional_content (
  id,
  history_paragraphs,
  mission_text,
  vision_text,
  principles_summary,
  principles_items,
  values_summary,
  values_items
)
select
  1,
  '[
    "El Jardín Infantil Arcoíris Florencia nace el **1 de febrero de 2020** en Llolleo, comuna de San Antonio, como el sueño de dos profesionales de la educación: **Rosa Verdugo Matamala**, Educadora de Párvulos y Magíster en Dirección y Liderazgo para la Gestión Educacional, actual directora del establecimiento; y su esposo, **Cristian Gaona**, Profesor, Magíster en Dirección y Liderazgo para la Gestión Educacional y Magíster en Gestión Pedagógica y Curricular.",
    "A partir de su experiencia en jardines infantiles, escuelas y colegios, ambos decidieron dar vida a un proyecto educativo orientado a entregar una educación de calidad desde los primeros años, en un ambiente seguro, acogedor y comprometido con el **desarrollo integral** de niños y niñas.",
    "El nombre \"**Arcoíris Florencia**\" nace en honor a su primera hija, **Florencia**, cuya experiencia desde muy pequeña en sala cuna y jardín infantil permitió a sus padres valorar profundamente la importancia de la educación parvularia y de las experiencias tempranas en el desarrollo de la autonomía, los vínculos, las habilidades y los aprendizajes.",
    "Este proyecto representa así una **convicción personal y profesional**: que cada niño y niña merece vivir sus primeros años educativos en un espacio donde pueda sentirse protegido, valorado, acompañado y estimulado para descubrir el mundo.",
    "El **10 de mayo de 2022**, el Jardín Infantil Arcoíris Florencia obtuvo su **Reconocimiento Oficial del Estado**, constituyéndose en un importante hito dentro de su proceso de consolidación institucional."
  ]'::jsonb,
  'Promover el desarrollo integral de niños y niñas mediante experiencias significativas, inclusivas y afectivas, trabajando colaborativamente con las familias como primeros educadores.',
  'Ser una comunidad educativa reconocida por brindar una educación parvularia de calidad, inclusiva y acogedora, donde cada niño y niña pueda aprender, desarrollarse y crecer plenamente.',
  'Orientamos nuestra labor reconociendo a cada niño y niña como protagonista de sus aprendizajes, respetando sus características, intereses y ritmos de desarrollo.',
  '["Bienestar", "Singularidad", "Juego", "Participación", "Relaciones positivas", "Aprendizajes significativos", "Potenciación"]'::jsonb,
  'Estos valores orientan nuestra convivencia y fortalecen una comunidad educativa basada en el buen trato, la colaboración y el respeto por los demás.',
  '["Inclusión", "Amor", "Respeto", "Solidaridad", "Responsabilidad", "Libertad", "Compartir", "Verdad"]'::jsonb
where not exists (select 1 from public.institutional_content where id = 1);

-- =========================================================================
-- news: colección con borrador/publicado. Público solo ve 'publicado';
-- admin ve y gestiona todo.
-- =========================================================================
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  category text not null,
  cover_image_url text,
  body jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  event_date date not null default current_date,
  status text not null default 'borrador' check (status in ('borrador', 'publicado')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists news_status_event_date_idx on public.news (status, event_date desc);

drop trigger if exists set_news_updated_at on public.news;
create trigger set_news_updated_at
  before update on public.news
  for each row execute function public.set_updated_at();

alter table public.news enable row level security;

drop policy if exists public_select_published_news on public.news;
create policy public_select_published_news
  on public.news
  for select
  using (status = 'publicado');

drop policy if exists admin_select_all_news on public.news;
create policy admin_select_all_news
  on public.news
  for select
  using (public.is_admin());

drop policy if exists admin_insert_news on public.news;
create policy admin_insert_news
  on public.news
  for insert
  with check (public.is_admin());

drop policy if exists admin_update_news on public.news;
create policy admin_update_news
  on public.news
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists admin_delete_news on public.news;
create policy admin_delete_news
  on public.news
  for delete
  using (public.is_admin());

-- Semilla con las 2 noticias reales ya publicadas en src/data/news.ts,
-- para que el sitio público siga mostrando exactamente el mismo contenido
-- una vez que NewsSection.tsx pase a leer desde Supabase.
insert into public.news (
  title, summary, category, cover_image_url, body, gallery, event_date, status, published_at
)
select
  'Celebración del Día del Niño y la Niña',
  'Una jornada llena de magia, alegría y diversión para celebrar a nuestros niños y niñas junto a toda la comunidad educativa.',
  'Celebraciones',
  '/images/dia-del-nino/5.jpeg',
  '[
    "Con mucha alegría celebramos el Día del Niño y la Niña en el Jardín Infantil Arcoíris Florencia, compartiendo una jornada especialmente preparada para que nuestros niños y niñas disfrutaran, jugaran y vivieran momentos inolvidables.",
    "Durante la actividad pudieron disfrutar de un entretenido show de magia, lleno de sorpresas, risas y diversión, generando un espacio de encuentro y alegría junto a sus compañeros y equipo educativo.",
    "Agradecemos sinceramente a nuestras familias y apoderados por su permanente apoyo y colaboración, que contribuyeron a hacer posible esta hermosa celebración.",
    "Asimismo, agradecemos a Petit Mon Diversiones por acompañarnos con su espectáculo y regalar a nuestros niños y niñas una experiencia llena de magia y felicidad.",
    "En Arcoíris Florencia continuamos creando experiencias que fortalecen la convivencia, el bienestar y los vínculos de nuestra comunidad educativa."
  ]'::jsonb,
  '[
    "/images/dia-del-nino/1.jpeg",
    "/images/dia-del-nino/2.jpeg",
    "/images/dia-del-nino/3.jpeg",
    "/images/dia-del-nino/4.jpeg"
  ]'::jsonb,
  date '2026-08-07',
  'publicado',
  now()
where not exists (select 1 from public.news where title = 'Celebración del Día del Niño y la Niña');

insert into public.news (
  title, summary, category, cover_image_url, body, gallery, event_date, status, published_at
)
select
  'Salida educativa a KidZania',
  'Nuestros niños y niñas disfrutaron de una enriquecedora salida educativa a KidZania, aprendiendo mediante el juego, la exploración y nuevas experiencias.',
  'Actividades',
  '/images/kidzania/1.jpeg',
  '[
    "Nuestros niños y niñas participaron el 31 de julio de 2026 en una entretenida salida educativa a KidZania, donde tuvieron la oportunidad de aprender a través del juego, la exploración y la participación en distintas experiencias relacionadas con el mundo de las profesiones y la vida cotidiana.",
    "Esta experiencia permitió fortalecer la autonomía, la convivencia, la participación y el aprendizaje significativo, ofreciendo nuevos espacios para descubrir, experimentar y compartir junto a sus compañeros y equipo educativo.",
    "Fue una jornada llena de entusiasmo, aprendizajes y experiencias que enriquecen nuestro proyecto educativo y permiten que niños y niñas continúen aprendiendo más allá del aula."
  ]'::jsonb,
  '[
    "/images/kidzania/2.jpeg",
    "/images/kidzania/3.jpeg",
    "/images/kidzania/4.jpeg",
    "/images/kidzania/5.jpeg",
    "/images/kidzania/6.jpeg",
    "/images/kidzania/7.jpeg",
    "/images/kidzania/8.jpeg",
    "/images/kidzania/9.jpeg",
    "/images/kidzania/10.jpeg"
  ]'::jsonb,
  date '2026-07-31',
  'publicado',
  now()
where not exists (select 1 from public.news where title = 'Salida educativa a KidZania');
