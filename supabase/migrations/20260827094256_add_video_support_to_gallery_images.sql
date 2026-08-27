-- Amplía la Galería para administrar también videos (subidos y de
-- YouTube), reutilizando gallery_images (sin tabla nueva) y el bucket
-- público existente public-media. No se modifica ninguna política ni
-- columna existente; todo lo agregado es opcional.

alter table public.gallery_images
  add column if not exists media_type text not null default 'image',
  add column if not exists title text,
  add column if not exists description text,
  -- URL del video optimizado subido (bucket public-media); null para
  -- youtube e imágenes (las imágenes siguen usando image_url).
  add column if not exists media_url text,
  -- ID de 11 caracteres del video de YouTube (no se descarga el video).
  add column if not exists youtube_id text,
  -- Miniatura: para video subido, se genera y se sube; para YouTube se
  -- puede derivar de youtube_id en el frontend sin necesidad de guardarla,
  -- pero se deja disponible por si se quiere fijar una distinta.
  add column if not exists thumbnail_url text,
  add column if not exists original_size_bytes bigint,
  add column if not exists optimized_size_bytes bigint,
  add column if not exists duration_seconds numeric,
  add column if not exists resolution text;

-- Filas existentes (las 35 fotografías ya migradas) son 'image' con
-- image_url ya presente: el valor por defecto 'image' las deja intactas.

alter table public.gallery_images
  drop constraint if exists gallery_images_media_type_check;
alter table public.gallery_images
  add constraint gallery_images_media_type_check
  check (media_type in ('image', 'video', 'youtube'));

-- Cada fila debe tener el dato mínimo que le corresponde según su tipo,
-- para no depender únicamente de la validación del frontend.
alter table public.gallery_images
  drop constraint if exists gallery_images_media_data_check;
alter table public.gallery_images
  add constraint gallery_images_media_data_check
  check (
    (media_type = 'image' and image_url is not null)
    or (media_type = 'video' and media_url is not null)
    or (media_type = 'youtube' and youtube_id is not null)
  );
