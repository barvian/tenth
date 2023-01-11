begin;
select plan(3);

insert into auth.users (id, email) values
('b9511b07-87eb-4e02-bfb5-3b7095129c73', 'me@test.com'),
('6ce7faef-966c-40f3-bb32-d7852c6e8430', 'registered@test.com');

insert into public.accounts (user_id, percentage) values
('b9511b07-87eb-4e02-bfb5-3b7095129c73', 0.100);

-- 

set local role authenticated;
set local "request.jwt.claim.sub" to 'b9511b07-87eb-4e02-bfb5-3b7095129c73';

select lives_ok(
    $$
    insert into public.designated (account_id, pledge_org_id) values (currval(pg_get_serial_sequence('accounts','id')), 'fake-pledge-id');
    $$,
    'An authenticated user can create designations'
);

select throws_ok(
    $$
    insert into public.designated (account_id, pledge_org_id) values (currval(pg_get_serial_sequence('accounts','id')), 'fake-pledge-id');
    $$,
    23505,
    'duplicate key value violates unique constraint "designated_pkey"',
    'An authenticated user cannot create non-unique designations'
);

set local "request.jwt.claim.sub" to '6ce7faef-966c-40f3-bb32-d7852c6e8430';

select is_empty(
    $$
    delete from public.designated where pledge_org_id = 'fake-pledge-id' returning *;
    $$,
    'A user cannot delete other designations'
);

select * from finish();
rollback;
