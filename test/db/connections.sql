begin;

select no_plan();

set local role authenticated;

\echo =======================
\echo connections constraints
\echo =======================

set local "request.jwt.claim.user_id" to 1;

select
  throws_ok(
    $$
    insert into connections(user_1_id, user_2_id) values (1, 2);
    $$,
    42501,
    'new row violates row-level security policy for table "connections"',
    'should not be able to write to connections directly'
  );



select * from finish();

do $$ begin assert num_failed() = 0; end $$;

rollback;