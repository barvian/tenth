begin;
select plan(5);

insert into auth.users (id, email) values
('b9511b07-87eb-4e02-bfb5-3b7095129c73', 'me@test.com'),
('6ce7faef-966c-40f3-bb32-d7852c6e8430', 'registered@test.com');

-- 

set local role authenticated;
set local "request.jwt.claim.sub" to 'b9511b07-87eb-4e02-bfb5-3b7095129c73';

select lives_ok(
    $$
    insert into public.designated (change_id) values ('fake-change-id');
    $$,
    'An authenticated user can create designations'
);

select throws_ok(
    $$
    insert into public.designated (change_id) values ('fake-change-id');
    $$,
    23505,
    'duplicate key value violates unique constraint "designated_pkey"',
    'An authenticated user cannot create non-unique designations'
);

select lives_ok(
    $$
    insert into public.designated (change_id) values (' ');
    $$,
    'An authenticated user can create a designation to the site'
);

select throws_ok(
    $$
    insert into public.designated (change_id) values (' ');
    $$,
    23505,
    'duplicate key value violates unique constraint "designated_pkey"',
    'An authenticated user cannot create two designations to the site'
);

set local "request.jwt.claim.sub" to '6ce7faef-966c-40f3-bb32-d7852c6e8430';

select is_empty(
    $$
    delete from public.designated where change_id = 'fake-change-id' returning *;
    $$,
    'A user cannot delete other designations'
);

select * from finish();
rollback;
