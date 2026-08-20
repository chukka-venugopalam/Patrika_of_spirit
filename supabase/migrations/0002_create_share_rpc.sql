-- Wraps both inserts (share_links + awareness_events) in one atomic
-- operation. If either insert fails, the whole call rolls back — no
-- orphaned share_links rows from a crash between two separate inserts.
create or replace function public.create_share(
  p_post_id uuid,
  p_actor_id uuid,
  p_parent_token uuid default null,
  p_causing_event_id uuid default null
)
returns table (token uuid, event_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token uuid := gen_random_uuid();
  v_event_id uuid := gen_random_uuid();
  v_causing_event record;
begin
  if p_causing_event_id is not null then
    select id, event_type, post_id into v_causing_event
    from public.awareness_events
    where id = p_causing_event_id;

    if not found or v_causing_event.event_type <> 'view' or v_causing_event.post_id <> p_post_id then
      raise exception 'invalid_causing_event' using errcode = 'P0001';
    end if;
  end if;

  insert into public.share_links (token, post_id, actor_id, parent_token)
  values (v_token, p_post_id, p_actor_id, p_parent_token);

  insert into public.awareness_events (id, post_id, actor_id, event_type, share_token, parent_event_id)
  values (v_event_id, p_post_id, p_actor_id, 'share', v_token, p_causing_event_id);

  return query select v_token, v_event_id;
end;
$$;

grant execute on function public.create_share(uuid, uuid, uuid, uuid) to authenticated;
