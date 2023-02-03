create extension citext;
create domain email as citext
  check ( value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' );

create type account_status as enum ('active', 'inactive', 'disconnected');

create table if not exists public.accounts
(
    id serial,
    user_id uuid not null default auth.uid(),
    stripe_pm_id text unique,
    stripe_fca_id text unique,
    last4 text,
    institution_name text,
    created_at timestamptz not null default now(),
    percentage numeric(3,3) default 0.100 not null check (percentage > 0),
    status account_status not null default 'active',
    constraint accounts_pkey primary key (id),
    constraint accounts_user_id_fkey foreign key (user_id)
        references auth.users (id) match simple
        on update no action
        on delete cascade
);

alter table if exists public.accounts
    enable row level security;

create policy "Owner can read their own"
    on public.accounts
    as permissive
    for select
    to public
    using (auth.uid() = user_id);

create table if not exists public.users
(
    id uuid not null default auth.uid(),
    first_name text,
    last_name text,
    stripe_cus_id text not null unique,
    current_account_id int,
    last_acceptance jsonb,
    constraint users_pkey primary key (id),
    constraint users_user_id_fkey foreign key (id)
        references auth.users (id) match simple
        on update no action
        on delete cascade,
    constraint users_current_account_id_fkey foreign key (current_account_id)
        references public.accounts (id) match simple
);

create function email(public.users) returns text security definer stable as $$
  select email::text from auth.users a where a.id = $1.id
$$ language sql;

revoke update on public.users from anon, authenticated;
grant update ("first_name", "last_name") on public.users to authenticated;

alter table if exists public.users
    enable row level security;

create policy "Owner can read own profile"
    on public.users
    as permissive
    for select
    to public
    using (auth.uid() = id);
create policy "Owner can update own profile"
    on public.users
    as permissive
    for update
    to public
    using (auth.uid() = id);

create function set_active_account()
  returns trigger as $$
  begin
    update public.users set current_account_id = new.id where id = new.user_id;
    return null;
  end;
$$ language plpgsql;

create function maybe_attach_to_account()
  returns trigger as $$
  declare
    unused_id int;
  begin
    select id into unused_id from public.accounts where user_id = new.user_id and stripe_fca_id is null limit 1;

    if new.stripe_fca_id is not null and unused_id is not null then
        update public.accounts a
        set
            stripe_pm_id = new.stripe_pm_id,
            stripe_fca_id = new.stripe_fca_id,
            last4 = new.last4,
            institution_name = new.institution_name
        where id = unused_id;

        return null;
    end if;

    return new;
  end;
$$ language plpgsql;

create trigger handle_account_before_insert
  before insert on public.accounts
  for each row
  execute procedure maybe_attach_to_account();

create trigger handle_account_after_insert
  after insert on public.accounts
  for each row
  execute procedure set_active_account();

create type designated_input as(
    pledge_org_id text,
    weight float
);

create or replace function public.register(
	stripe_cus_id text,
    first_name text,
    last_name text,
	percentage numeric,
	designated designated_input[]
)
    returns void
    security definer
    language 'plpgsql'
    volatile
as $$
begin
    insert into public.users (stripe_cus_id, first_name, last_name) values ($1, $2, $3);
    with new_account as (
        insert into public.accounts (percentage) values ($4) returning *
    )
    insert into public.designated (account_id, pledge_org_id, weight) select new_account.id, d.pledge_org_id, d.weight from unnest($5) d, new_account;
end;
$$;

create or replace function public.email_exists(
	email character varying)
    returns boolean
    security definer
    language 'plpgsql'
    stable
    set search_path=auth, pg_temp
as $$
begin
    return exists(
        select 1
        from auth.users au
        where au.email = $1
        and exists(
            select 1
            from public.users pu
            where pu.id = au.id
        )
    );
end;
$$;

create table if not exists public.designated
(
    user_id uuid default auth.uid(),
    account_id int,
    pledge_org_id text,
    weight float not null default 1 check (weight > 0),
    created_at timestamptz not null default now(),
    constraint designated_pkey primary key (user_id, account_id, pledge_org_id),
    constraint designated_user_id_fkey foreign key (user_id)
        references auth.users (id) match simple
        on update no action
        on delete cascade,
    constraint designated_account_id_fkey foreign key (account_id)
        references public.accounts (id) match simple
        on update no action
        on delete cascade
);

alter table if exists public.designated
    enable row level security;

create policy "Owner has all permissions"
    on public.designated
    as permissive
    for all
    to public
    using (auth.uid() = user_id);

create table if not exists public.requests
(
    id serial,
    ngo_id text not null,
    user_id uuid default auth.uid(),
    email email,
    constraint requests_pkey primary key (id),
    constraint requests_user_id_fkey foreign key (user_id)
        references auth.users (id) match simple
        on update no action
        on delete cascade
);

alter table if exists public.requests
    enable row level security;

create policy "Anonymous users can create their own"
on public.requests
    as permissive
    for insert
    to anon
    with check (user_id is null and email is not null);

create policy "Authenticated users can create their own"
on public.requests
    as permissive
    for insert
    to authenticated
    with check (auth.uid() = user_id and email is null);