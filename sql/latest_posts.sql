-- Latest in-app posts for the sporkitapp.com landing page.
-- Public read-only: only fields that are already public in the app.
-- Paste the CONTENTS into the Supabase SQL editor (safe to re-run).

create or replace function public.get_latest_public_posts(p_limit integer default 3)
returns table (
  id uuid,
  dish_name text,
  restaurant_name text,
  username text,
  thumbnail_url text,
  video_url text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select v.id, v.dish_name, r.name, u.username, v.thumbnail_url, v.video_url, v.created_at
  from public.videos v
  join public.users u on u.id = v.creator_id and u.status = 'active'
  left join public.restaurants r on r.id = v.restaurant_id
  where v.source = 'direct_upload'
    and v.status = 'active'
    and (r.id is null or r.status <> 'closed')
  order by v.created_at desc
  limit greatest(1, least(coalesce(p_limit, 3), 12));
$$;

revoke all on function public.get_latest_public_posts(integer) from public;
grant execute on function public.get_latest_public_posts(integer) to anon, authenticated;
