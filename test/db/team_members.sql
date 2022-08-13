begin;

select no_plan();

set local role authenticated;

\echo ========================
\echo team_members constraints
\echo ========================

-- set local "request.jwt.claim.user_id" to 1;

select  
  throws_ok(
    $$
    insert into team_members(name, role) values ('Max', 'Designer');
    $$,
    42501,
    'new row violates row-level security policy for table "team_members"',
    'should not be able to write to team_members directly'
  );



select * from finish();

do $$ begin assert num_failed() = 0; end $$;

rollback;