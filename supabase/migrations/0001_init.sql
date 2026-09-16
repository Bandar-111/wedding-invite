-- Wedding invitation system - initial schema
-- Simple, single-table design on purpose (see project scope: one wedding, one gate).

create extension if not exists "pgcrypto";

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  number_of_guests integer not null default 1,
  qr_token text not null unique default encode(gen_random_bytes(16), 'hex'),
  checked_in boolean not null default false,
  checked_in_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

-- Fast lookup by token (invitation page + scanner check-in)
create unique index if not exists guests_qr_token_idx on guests (qr_token);

-- Fast search by name / phone in the admin dashboard
create index if not exists guests_full_name_idx on guests using gin (to_tsvector('simple', full_name));
create index if not exists guests_phone_idx on guests (phone);
create index if not exists guests_checked_in_idx on guests (checked_in);

-- Row Level Security: all access happens through the server (service role),
-- never directly from the browser, so we lock the table down completely.
alter table guests enable row level security;

-- No policies are created on purpose -> with RLS enabled and zero policies,
-- the anon/authenticated keys get zero access. Only the service_role key
-- (used exclusively in server-side API routes) can read/write this table.

-- Atomic check-in function: prevents two scanners from checking in the
-- same guest at the same time (race condition safe via row-level locking).
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
begin
  -- Lock the row for the duration of this transaction so concurrent
  -- scans of the same token serialize instead of racing.
  select * into v_guest from guests where qr_token = p_token for update;

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
