begin;
select plan(7);

set local role authenticated;
set local "request.jwt.claim.sub" to 'b9511b07-87eb-4e02-bfb5-3b7095129c73'; -- unregistered user

select
    throws_ok(
        $$
        insert into public.profiles (user_id, stripe_id, change_id) values
        ('b9511b07-87eb-4e02-bfb5-3b7095129c73', 'fake-stripe-id', 'fake-change-id');
        $$,
        42501,
        'new row violates row-level security policy for table "profiles"',
        'A user cannot insert a profile outside register()'
    );

select
    lives_ok(
        $$
        select register(
            'fake-stripe-id2',
            'fake-change-id2',
            'Registered2', 'User',
            0.100,
            '{"fake-charity-id"}'
        );
        $$,
        'register() succeeds for unregistered users'
    );

select
    results_eq(
        $$
        select first_name from public.profiles;
        $$,
        $$
        values('Registered2')
        $$,
        'A user can only read their own profile'
    );

select
    is_empty(
        $$
        update public.profiles set last_name = 'Last' where first_name = 'Registered' returning *;
        $$,
        'A user cannot update another profile'
    );

select
  is_empty(
    $$
    delete from public.profiles returning *;
    $$,
    'A user cannot delete any profiles'
  );

select
    is_empty(
        $$
        update public.profiles set stripe_id = 'fake-stripe-id' returning *;
        $$,
        'A user cannot set their stripe_id'
    );

select
    is_empty(
        $$
        update public.profiles set change_id = 'fake-change-id' returning *;
        $$,
        'A user cannot set their change_id'
    );


select * from finish();
rollback;
