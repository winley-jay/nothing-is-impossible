-- Run this in the Supabase SQL editor.
-- After creating the admin Auth user, add their user id to public.admin_users.

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert site content" on public.site_content;
create policy "Admins can insert site content"
on public.site_content
for insert
to authenticated
with check (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update site content" on public.site_content;
create policy "Admins can update site content"
on public.site_content
for update
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can read admin list" on public.admin_users;
create policy "Admins can read admin list"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

insert into public.site_content (id, content)
values (
  'main',
  '{
    "artistName": "Nothing Is Impossible",
    "heroLine": "Singer, survivor, storyteller. Every song carries light from the fight he already won.",
    "heroImage": "",
    "backgroundTheme": "theme-default",
    "whatsappNumber": "",
    "whatsappTicketMessage": "Hi, I would like to buy tickets for",
    "loveCount": 128,
    "story": {
      "headline": "A voice that came through the fire",
      "body": "He faced cancer with faith, music, and the people who refused to let him stand alone. Beating it did not just give him more time, it gave every lyric a deeper reason. This space shares the music, the healing, and the message that nothing is impossible.",
      "image": ""
    },
    "releases": [],
    "events": [],
    "posts": [],
    "merch": [],
    "socials": {
      "tiktok": {
        "platform": "tiktok",
        "label": "TikTok",
        "profileUrl": "",
        "storyTitle": "Studio warm-up",
        "storyText": "A quick behind-the-scenes vocal run before the next release.",
        "storyUrl": "",
        "updatedAt": "2026-07-04"
      },
      "instagram": {
        "platform": "instagram",
        "label": "Instagram",
        "profileUrl": "",
        "storyTitle": "Thank you for the love",
        "storyText": "A short message for everyone supporting the journey and the music.",
        "storyUrl": "",
        "updatedAt": "2026-07-04"
      },
      "facebook": {
        "platform": "facebook",
        "label": "Facebook",
        "profileUrl": "",
        "storyTitle": "Next show update",
        "storyText": "New event details, tickets, and a note for the people coming through.",
        "storyUrl": "",
        "updatedAt": "2026-07-04"
      }
    }
  }'::jsonb
)
on conflict (id) do nothing;

create or replace function public.increment_love_count(content_id text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  next_count integer;
begin
  update public.site_content
  set
    content = jsonb_set(
      content,
      '{loveCount}',
      to_jsonb(coalesce((content->>'loveCount')::integer, 0) + 1),
      true
    ),
    updated_at = now()
  where id = content_id
  returning (content->>'loveCount')::integer into next_count;

  return next_count;
end;
$$;

grant execute on function public.increment_love_count(text) to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read site images" on storage.objects;
create policy "Public can read site images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-images');

drop policy if exists "Admins can upload site images" on storage.objects;
create policy "Admins can upload site images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-images'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update site images" on storage.objects;
create policy "Admins can update site images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'site-images'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'site-images'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete site images" on storage.objects;
create policy "Admins can delete site images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-images'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);
