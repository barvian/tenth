begin;
select plan(10);

insert into auth.users (id, email) values
('b9511b07-87eb-4e02-bfb5-3b7095129c73', 'unregistered@test.com'),
('6ce7faef-966c-40f3-bb32-d7852c6e8430', 'registered@test.com');

insert into public.profiles (user_id, first_name, last_name, stripe_id, change_id, percentage) values
('6ce7faef-966c-40f3-bb32-d7852c6e8430', 'Registered', 'User', 'fake-stripe-id', 'fake-change-id', 0.100);

-- 

set local role authenticated;
set local "request.jwt.claim.sub" to 'b9511b07-87eb-4e02-bfb5-3b7095129c73';

select throws_ok(
    $$
    insert into public.profiles (user_id, stripe_id, change_id) values
    ('b9511b07-87eb-4e02-bfb5-3b7095129c73', 'fake-stripe-id', 'fake-change-id');
    $$,
    42501,
    'new row violates row-level security policy for table "profiles"',
    'A user cannot insert a profile outside register()'
);

select lives_ok(
    $$
    select register(
        'fake-stripe-id2',
        'fake-change-id2',
        'Registered2',
        'User',
        0.100,
        '{"(id3,0.75)","(id2,0.5)"}'
    );
    $$,
    'register() succeeds for unregistered users'
);

select results_eq(
    $$
    select count(*) from public.designated;
    $$,
    $$
    values(2::bigint)
    $$,
    'register() inserts the designated charities into the designated table'
);

select results_eq(
    $$
    select first_name from public.profiles;
    $$,
    $$
    values('Registered2')
    $$,
    'A user can only read their own profile'
);

select is_empty(
    $$
    update public.profiles set last_name = 'Last' where first_name = 'Registered' returning *;
    $$,
    'A user cannot update another profile'
);

select is_empty(
    $$
    delete from public.profiles returning *;
    $$,
    'A user cannot delete any profiles'
);

select throws_ok(
    $$
    update public.profiles set stripe_id = 'fake-stripe-id' returning *;
    $$,
    23505,
    'duplicate key value violates unique constraint "profiles_stripe_id_key"',
    'A user cannot set their stripe_id to an existing one'
);

select throws_ok(
    $$
    update public.profiles set change_id = 'fake-change-id' returning *;
    $$,
    23505,
    'duplicate key value violates unique constraint "profiles_change_id_key"',
    'A user cannot set their change_id to an existing one'
);

select results_eq(
    $$
    update public.profiles set percentage = 0.333 returning percentage;
    $$,
    $$
    values(0.333)
    $$,
    'A user can update their percentage'
);

set local role postgres;

delete from auth.users where id = 'b9511b07-87eb-4e02-bfb5-3b7095129c73';

select results_eq(
    $$
    select email, change_id from public.deleted_profiles
    $$,
    $$
    values ('unregistered@test.com'::varchar, 'fake-change-id2')
    $$,
    'Deleted users get archived in deleted_profiles'
);

select * from finish();
rollback;
