begin;
select plan(11);

insert into auth.users (id, email) values
('b9511b07-87eb-4e02-bfb5-3b7095129c73', 'unregistered@test.com'),
('6ce7faef-966c-40f3-bb32-d7852c6e8430', 'registered@test.com');

insert into public.users (id, stripe_cus_id) values
('6ce7faef-966c-40f3-bb32-d7852c6e8430', 'fake-stripe-id');

create function public.add_account(
	stripe_fca_id text
)
    returns setof public.accounts
    security definer
    language sql
as $$
    insert into public.accounts (stripe_fca_id) values ($1) returning *;
$$;

-- 

set local role authenticated;
set local "request.jwt.claim.sub" to 'b9511b07-87eb-4e02-bfb5-3b7095129c73';

select throws_ok(
    $$
    insert into public.users (id, stripe_cus_id) values
    ('b9511b07-87eb-4e02-bfb5-3b7095129c73', 'fake-stripe-id');
    $$,
    42501,
    'new row violates row-level security policy for table "users"',
    'A user cannot insert a profile outside register()'
);

select lives_ok(
    $$
    select register(
        'fake-stripe-id2',
        'First',
        'Last',
        0.200,
        '{"(id3,0.75)","(id2,0.5)"}'
    );
    $$,
    'register() succeeds for unregistered users'
);

select is(
    u.email,
    'unregistered@test.com',
    'public.users.email mirrors auth.users.email'
) from public.users u;

select isnt(
    current_account_id,
    null,
    'Adding a new account changes the current_account_id on the user'
) from public.users;

select is(
    percentage,
    0.200,
    'register() creates a blank account with the proper percentage'
) from public.accounts;

select results_eq(
    $$
    select count(*) from public.designated;
    $$,
    $$
    values(2::bigint)
    $$,
    'register() inserts the designated charities into the designated table'
);

select public.add_account('fake-stripe-fc-id');
select public.add_account('fake-stripe-fc-id2');

select results_eq(
    $$
    select count(*) from public.accounts;
    $$,
    $$
    values (2::bigint)
    $$,
    'inserting an account when an empty one exists attaches it instead'
);

select results_eq(
    $$
    select stripe_cus_id from public.users;
    $$,
    $$
    values('fake-stripe-id2')
    $$,
    'A user can only read their own profile'
);

select is_empty(
    $$
    update public.users set last_name = 'Fake Last' where id = '6ce7faef-966c-40f3-bb32-d7852c6e8430' returning *;
    $$,
    'A user cannot update another user'
);

select throws_ok(
    $$
    update public.users set stripe_cus_id = 'fake-stripe-id3' where id = 'b9511b07-87eb-4e02-bfb5-3b7095129c73';
    $$,
    42501,
    'permission denied for table users',
    'A user cannot update their own stripe_cus_id'
);

select is_empty(
    $$
    delete from public.users returning *;
    $$,
    'A user cannot delete any profiles'
);

select * from finish();
rollback;
