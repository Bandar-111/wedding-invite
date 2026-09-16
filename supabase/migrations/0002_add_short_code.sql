-- Adds a short, human-typeable code (e.g. "K7P2XQ") as an alternative to
-- scanning the QR code — same guest, same uniqueness guarantee, usable for
-- manual check-in at the door when a phone camera isn't cooperating.

alter table guests add column if not exists short_code text;

-- Alphabet avoids visually-ambiguous characters (0/O, 1/I/L, etc).
create or replace function generate_short_code() returns text as $$
declare
  chars text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  result text := '';
  i integer;
begin
  for i in 1..6 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

-- Auto-assigns a unique short_code on insert, same pattern as qr_token.
create or replace function set_guest_short_code() returns trigger as $$
declare
  candidate text;
  tries integer := 0;
begin
  if new.short_code is not null then
    return new;
  end if;
  loop
    candidate := generate_short_code();
    tries := tries + 1;
    exit when not exists (select 1 from guests where short_code = candidate) or tries > 20;
  end loop;
  new.short_code := candidate;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_guest_short_code on guests;
create trigger trg_set_guest_short_code
  before insert on guests
  for each row execute function set_guest_short_code();

-- Backfill any existing rows created before this migration.
do $$
declare
  g record;
  candidate text;
begin
  for g in select id from guests where short_code is null loop
    loop
      candidate := generate_short_code();
      exit when not exists (select 1 from guests where short_code = candidate);
    end loop;
    update guests set short_code = candidate where id = g.id;
  end loop;
end $$;

alter table guests alter column short_code set not null;

create unique index if not exists guests_short_code_idx on guests (short_code);

-- Extend check-in lookup to accept either the QR token or the short code,
-- so manual entry at the scanner goes through the exact same atomic,
-- race-safe check-in path as scanning the QR image.
create or replace function check_in_guest(p_token text)
returns table (
  result text,
  guest_id uuid,
  full_name text,
  number_of_guests integer,
  checked_in_at timestamptz
) as $$
declare
  v_guest guests%rowtype;
  v_normalized text := upper(trim(p_token));
begin
  select * into v_guest from guests
    where qr_token = p_token or short_code = v_normalized
    for update;

  if not found then
    return query select 'invalid'::text, null::uuid, null::text, null::integer, null::timestamptz;
    return;
  end if;

  if v_guest.checked_in then
    return query select 'already_used'::text, v_guest.id, v_guest.full_name, v_guest.number_of_guests, v_guest.checked_in_at;
    return;
  end if;

  update guests
    set checked_in = true, checked_in_at = now()
    where id = v_guest.id
    returning * into v_guest;

  return query select 'success'::text, v_guest.id, v_guest.full_name, v_guest.number_of_guests, v_guest.checked_in_at;
end;
$$ language plpgsql security definer;
