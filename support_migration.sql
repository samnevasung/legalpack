-- ============================================================
-- LegalPack AI — Live Support Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. TICKETS TABLE
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text not null,
  user_name text,
  subject text not null default 'Support Request',
  status text not null default 'open' check (status in ('open','pending','resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  unread_admin integer not null default 0
);

-- 2. MESSAGES TABLE
create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_type text not null check (sender_type in ('user','admin')),
  message text not null,
  created_at timestamptz not null default now()
);

-- 3. INDEXES
create index if not exists idx_support_messages_ticket on public.support_messages(ticket_id);
create index if not exists idx_support_tickets_user on public.support_tickets(user_id);
create index if not exists idx_support_tickets_status on public.support_tickets(status);

-- 4. AUTO-UPDATE updated_at ON TICKETS
create or replace function public.support_tickets_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_support_tickets_updated_at on public.support_tickets;
create trigger trg_support_tickets_updated_at
  before update on public.support_tickets
  for each row execute function public.support_tickets_updated_at();

-- 5. RLS
alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;

-- Users can see their own tickets
create policy "Users view own tickets"
  on public.support_tickets for select
  using (auth.uid() = user_id);

-- Users can insert their own tickets (or guests with null user_id)
create policy "Users insert own tickets"
  on public.support_tickets for insert
  with check (auth.uid() = user_id OR user_id is null);

-- Users can see messages on their own tickets
create policy "Users view own messages"
  on public.support_messages for select
  using (
    ticket_id in (
      select id from public.support_tickets where user_id = auth.uid()
    )
  );

-- Users can insert messages on their own tickets (or guest tickets)
create policy "Users insert own messages"
  on public.support_messages for insert
  with check (
    sender_type = 'user'
    and (
      ticket_id in (select id from public.support_tickets where user_id = auth.uid())
      or ticket_id in (select id from public.support_tickets where user_id is null)
    )
  );

-- Admin email — update this to your email
-- Admin can read/write everything (bypass RLS via service role in admin.html)
-- The admin console uses the anon key but checks auth — grant full access to your admin user

-- OPTIONAL: If you want to grant your admin user full access without service role key,
-- add your admin user's UUID here:
-- create policy "Admin full access tickets"
--   on public.support_tickets for all
--   using (auth.uid() = 'YOUR-ADMIN-UUID-HERE');
-- create policy "Admin full access messages"
--   on public.support_messages for all
--   using (auth.uid() = 'YOUR-ADMIN-UUID-HERE');

-- 6. ENABLE REALTIME on both tables
-- In Supabase dashboard: Database → Replication → enable support_tickets + support_messages
-- Or run:
alter publication supabase_realtime add table public.support_tickets;
alter publication supabase_realtime add table public.support_messages;

-- Done!
