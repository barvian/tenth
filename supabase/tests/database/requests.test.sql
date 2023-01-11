begin;
select plan(7);

insert into auth.users (id, email) values
('b9511b07-87eb-4e02-bfb5-3b7095129c73', 'unregistered@test.com'),
('6ce7faef-966c-40f3-bb32-d7852c6e8430', 'registered@test.com');

-- 

set local role anon;

select throws_ok(
    $$
    insert into public.requests (ngo_id, email) values ('fake-ngo-id', 'anon@,@test.com');
    $$,
    23514,
    'value for domain email violates check constraint "email_check"',
    'An anonymous user cannot create requests with an invalid email'
);

select throws_ok(
    $$
    insert into public.requests (ngo_id) values ('fake-ngo-id');
    $$,
    42501,
    'new row violates row-level security policy for table "requests"',
    'An anonymous user cannot create requests without an email'
);

select throws_ok(
    $$
    insert into public.requests (ngo_id, user_id) values ('fake-ngo-id', '6ce7faef-966c-40f3-bb32-d7852c6e8430');
    $$,
    42501,
    'new row violates row-level security policy for table "requests"',
    'An anonymous user cannot create requests with a user_id'
);

select lives_ok(
    $$
    insert into public.requests (ngo_id, email) values ('fake-ngo-id', 'anon@test.com');
    $$,
    'An anonymous user can create requests with a valid email'
);

set local role authenticated;
set local "request.jwt.claim.sub" to '6ce7faef-966c-40f3-bb32-d7852c6e8430';

select throws_ok(
    $$
    insert into public.requests (ngo_id, user_id) values ('fake-ngo-id2', 'b9511b07-87eb-4e02-bfb5-3b7095129c73');
    $$,
    42501,
    'new row violates row-level security policy for table "requests"',
    'An authenticated user cannot create requests for a different user_id'
);

select throws_ok(
    $$
    insert into public.requests (ngo_id, user_id, email) values ('fake-ngo-id2', '6ce7faef-966c-40f3-bb32-d7852c6e8430', 'random@email.com');
    $$,
    42501,
    'new row violates row-level security policy for table "requests"',
    'An authenticated user cannot create requests with an email'
);

select lives_ok(
    $$
    insert into public.requests (ngo_id, user_id) values ('fake-ngo-id2', '6ce7faef-966c-40f3-bb32-d7852c6e8430');
    $$,
    'An authenticated user can create requests without an email'
);

select * from finish();
rollback;
