-- ============================================================================
-- Saraillon — migration initiale (C0). Schéma EXACT de contracts.md §3,
-- RLS & RPC §4, Storage §5, Realtime sur courses, trigger updated_at.
-- Idempotente : ré-exécutable sans erreur.
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================ TABLES (contracts §3) =========================

-- §3.1 programme — table maîtresse (Planning ET Repas & Courses)
create table if not exists public.programme (
  id                  uuid primary key default gen_random_uuid(),
  ordre               int not null,
  jour                text not null,
  activite            text not null,
  horaires            text not null,
  lieu_details        text not null,
  inscription_requise boolean not null default false,
  lien_inscription    text,
  repas_concerne      text,
  responsables        text,
  petit_dejeuner      text,
  regimes_allergies   text,
  materiel_collectif  text,
  materiel_individuel text,
  eau_snacks          text,
  creme_chapeau       text,
  medicaments         text,
  updated_at          timestamptz not null default now()
);

-- §3.2 courses — liste de courses (temps réel)
create table if not exists public.courses (
  id           uuid primary key default gen_random_uuid(),
  programme_id uuid references public.programme(id) on delete set null,
  libelle      text not null,
  quantite     text,
  is_checked   boolean not null default false,
  created_by   uuid,
  created_at   timestamptz not null default now()
);

-- §3.3 defis
create table if not exists public.defis (
  id         uuid primary key default gen_random_uuid(),
  texte      text not null,
  actif      boolean not null default true,
  created_at timestamptz not null default now()
);

-- §3.4 equipe
create table if not exists public.equipe (
  id     uuid primary key default gen_random_uuid(),
  prenom text not null
);

-- §3.5 corvees
create table if not exists public.corvees (
  id    uuid primary key default gen_random_uuid(),
  tache text not null
);

-- §3.6 messages_caches — secrets (accès via RPC uniquement, §4)
create table if not exists public.messages_caches (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  type        text not null check (type in ('video', 'audio')),
  contenu_url text,
  message     text
);

-- §3.7 photos — métadonnées galerie (fichiers dans Storage, §5)
create table if not exists public.photos (
  id           uuid primary key default gen_random_uuid(),
  storage_path text not null,
  uploaded_by  uuid,
  caption      text,
  created_at   timestamptz not null default now()
);

-- ============================ TRIGGER updated_at ===========================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_programme_updated_at on public.programme;
create trigger trg_programme_updated_at
  before update on public.programme
  for each row execute function public.set_updated_at();

-- ============================ RLS (contracts §4) ===========================
-- Groupe fermé : tout authentifié lit/écrit le partagé ; l'anonyme n'a rien.

alter table public.programme       enable row level security;
alter table public.courses         enable row level security;
alter table public.defis           enable row level security;
alter table public.equipe          enable row level security;
alter table public.corvees         enable row level security;
alter table public.messages_caches enable row level security;
alter table public.photos          enable row level security;

-- programme : lecture + écriture (édition responsables/petit-déj) pour authenticated
drop policy if exists programme_all on public.programme;
create policy programme_all on public.programme
  for all to authenticated using (true) with check (true);

-- courses : lecture + écriture pour authenticated
drop policy if exists courses_all on public.courses;
create policy courses_all on public.courses
  for all to authenticated using (true) with check (true);

-- defis / equipe / corvees : lecture seule pour l'app (écriture = seed/admin via service_role)
drop policy if exists defis_select on public.defis;
create policy defis_select on public.defis for select to authenticated using (true);

drop policy if exists equipe_select on public.equipe;
create policy equipe_select on public.equipe for select to authenticated using (true);

drop policy if exists corvees_select on public.corvees;
create policy corvees_select on public.corvees for select to authenticated using (true);

-- photos : SELECT + INSERT authenticated ; DELETE uniquement par la propriétaire
drop policy if exists photos_select on public.photos;
create policy photos_select on public.photos for select to authenticated using (true);

drop policy if exists photos_insert on public.photos;
create policy photos_insert on public.photos
  for insert to authenticated with check (uploaded_by = auth.uid());

drop policy if exists photos_delete_own on public.photos;
create policy photos_delete_own on public.photos
  for delete to authenticated using (uploaded_by = auth.uid());

-- messages_caches : AUCUNE policy → tout SELECT direct est refusé.
-- L'accès se fait exclusivement via la RPC reveal_secret (security definer) ci-dessous.

-- ============================ RPC reveal_secret (§4) =======================

create or replace function public.reveal_secret(p_code text)
returns table (type text, contenu_url text, message text)
language sql
security definer
set search_path = public
as $$
  select type, contenu_url, message
  from public.messages_caches
  where code = p_code
  limit 1;
$$;

revoke all on function public.reveal_secret(text) from public;
grant execute on function public.reveal_secret(text) to authenticated;

-- ============================ Storage (contracts §5) =======================

-- Bucket privé `photos` (lecture via URLs signées côté client).
insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

-- Policies sur storage.objects, restreintes au bucket `photos`.
-- Chemin attendu : photos/<uid>/<uuid>.<ext> (1er dossier = uid de l'autrice).
drop policy if exists photos_storage_select on storage.objects;
create policy photos_storage_select on storage.objects
  for select to authenticated
  using (bucket_id = 'photos');

drop policy if exists photos_storage_insert on storage.objects;
create policy photos_storage_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists photos_storage_delete_own on storage.objects;
create policy photos_storage_delete_own on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos' and owner = auth.uid());

-- ============================ Realtime sur courses (§3.2) ==================

-- Payloads complets sur UPDATE/DELETE (sinon seules les clés primaires remontent).
alter table public.courses replica identity full;

-- Ajoute courses à la publication Realtime (créée par défaut sur Supabase).
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'courses'
  ) then
    alter publication supabase_realtime add table public.courses;
  end if;
end
$$;
