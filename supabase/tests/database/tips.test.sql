begin;
select plan(10);

insert into auth.users (id, email) values
('b9511b07-87eb-4e02-bfb5-3b7095129c73', 'unregistered@test.com'),
('6ce7faef-966c-40f3-bb32-d7852c6e8430', 'registered@test.com');

--

alter table public.tips disable trigger handle_updated_at;

set local role anon;

select throws_ok(
    $$
    insert into public.tips default values;
    $$,
    42501,
    'permission denied for table tips',
    'An anonymous user cannot insert into tips'
);

select throws_ok(
    $$
    delete from public.tips;
    $$,
    42501,
    'permission denied for table tips',
    'An anonymous user cannot delete from tips'
);

select throws_ok(
    $$
    update public.tips set ytd = 0;
    $$,
    42501,
    'permission denied for table tips',
    'An anonymous user cannot update tips'
);

set local role authenticated;
set local "request.jwt.claim.sub" to '6ce7faef-966c-40f3-bb32-d7852c6e8430';

select throws_ok(
    $$
    insert into public.tips default values;
    $$,
    42501,
    'permission denied for table tips',
    'An authenticated user cannot insert into tips'
);

select throws_ok(
    $$
    update public.tips set ytd = 0;
    $$,
    42501,
    'permission denied for table tips',
    'An authenticated user cannot update tips'
);

select throws_ok(
    $$
    delete from public.tips;
    $$,
    42501,
    'permission denied for table tips',
    'An authenticated user cannot delete from tips'
);

set local role service_role;

select lives_ok(
    $$
    update public.tips set ytd = 100 returning ytd;
    $$,
    'Service role user can update tips'
);

select results_eq(
    $$
    update public.tips set ytd = 100 returning ytd;
    $$,
    $$
    values(200);
    $$,
    'YTD grows by set amount'
);

select results_eq(
    $$
    update public.tips set ytd = -100 returning ytd;
    $$,
    $$
    values(100);
    $$,
    'YTD shrinks by set amount'
);

select results_eq(
    $$
    update public.tips set ytd = 100, updated_at = updated_at + '1 years'::interval returning ytd;
    $$,
    $$
    values(100);
    $$,
    'YTD resets on a new year'
);

select * from finish();
rollback;
